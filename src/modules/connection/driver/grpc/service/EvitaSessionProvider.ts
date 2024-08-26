import { ClientProvider } from '@/modules/connection/driver/grpc/service/ClientProvider'
import { Connection } from '@/modules/connection/model/Connection'
import { GrpcEvitaSessionResponse } from '@/modules/connection/driver/grpc/gen/GrpcEvitaAPI_pb'
import { Catalog } from '@/modules/connection/model/Catalog'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { Code, ConnectError } from '@connectrpc/connect'

/**
 * Handles access to evita session. Provides way to share a single evita session across
 */
export class EvitaSessionProvider {

    private readonly clientProvider: ClientProvider

    private readonly activeReadOnlySessions: Map<string, ReadOnlySessionInfo> = new Map()
    private readonly activeReadWriteSessions: Map<string, ReadWriteSessionInfo> = new Map()

    constructor(clientProvider: ClientProvider) {
        this.clientProvider = clientProvider
    }

    async executeInReadOnlySession<T>(connection: Connection,
                                      catalog: Catalog,
                                      sessionAction: (sessionId: string) => T,
                                      retry: boolean = true): Promise<T> {
        const session: SessionInfo = await this.getReadOnlySession(connection, catalog)
        try {
            return await sessionAction(session.id)
        } catch (e) {
            if (e instanceof ConnectError && e.code === Code.Unauthenticated) {
                session.invalidate()
                if (retry) {
                    return await this.executeInReadOnlySession(connection, catalog, sessionAction, false)
                } else {
                    throw new UnexpectedError('Could not get active read-only session. Probably too many tries.')
                }
            }
            throw e
        }
    }

    async executeInReadWriteSession<T>(connection: Connection,
                                       catalog: Catalog,
                                       sessionAction: (sessionId: string) => T,
                                       retry: boolean = true): Promise<T> {
        const session: SessionInfo = await this.getReadWriteSession(connection, catalog)
        let result: T
        try {
            result = await sessionAction(session.id)
        } catch (e) {
            if (e instanceof ConnectError && e.code === Code.Unauthenticated) {
                session.invalidate()
                if (retry) {
                    return await this.executeInReadWriteSession(connection, catalog, sessionAction, false)
                } else {
                    throw new UnexpectedError('Could not get active read-only session. Probably too many tries.')
                }
            }
            throw e
        }
        await this.closeReadWriteSession(connection, catalog)
        return result
    }

    async goLiveAndCloseSession(connection: Connection, catalog: Catalog): Promise<void> {
        if (!catalog.isInWarmup) {
            throw new UnexpectedError(`Catalog '${catalog.name}' is not in warming up state.`)
        }

        const session: ReadWriteSessionInfo | undefined = this.activeReadWriteSessions.get(catalog.name)
        if (session == undefined) {
            return
        }
        await this.clientProvider
            .getEvitaSessionClient(connection)
            .close(
                {},
                {
                    headers: {
                        sessionId: session.id
                    }
                }
            )
    }

    private async getReadOnlySession(connection: Connection, catalog: Catalog): Promise<SessionInfo> {
        if (catalog.isInWarmup) {
            // in this state, we want to share a single session across all calls, which is read write session
            return await this.getReadWriteSession(connection, catalog)
        }

        let session: ReadOnlySessionInfo | undefined = this.activeReadOnlySessions.get(catalog.name)
        if (session == undefined || session.shouldInvalidate) {
            if (session != undefined) {
                await this.closeReadOnlySession(connection, catalog)
            }

            const newSession: GrpcEvitaSessionResponse = await this.clientProvider
                .getEvitaClient(connection)
                .createReadOnlySession({ catalogName: catalog.name })
            session = new ReadOnlySessionInfo(newSession.sessionId)
            this.activeReadOnlySessions.set(catalog.name, session)
        }
        return session
    }

    private async getReadWriteSession(connection: Connection, catalog: Catalog): Promise<SessionInfo> {
        let session: ReadWriteSessionInfo | undefined = this.activeReadWriteSessions.get(catalog.name)
        if (session == undefined || session.shouldInvalidate) {
            if (session != undefined) {
                await this.closeReadWriteSession(connection, catalog)
            }

            const newSessionResponse: GrpcEvitaSessionResponse = await this.clientProvider
                .getEvitaClient(connection)
                .createReadWriteSession({ catalogName: catalog.name })
            session = new ReadWriteSessionInfo(newSessionResponse.sessionId)
            this.activeReadWriteSessions.set(catalog.name, session)
        } else {
            session.registerUser()
        }
        return session
    }

    private async closeReadOnlySession(connection: Connection, catalog: Catalog): Promise<void> {
        let session: ReadOnlySessionInfo | undefined = this.activeReadOnlySessions.get(catalog.name)
        if (session == undefined) {
            return
        }

        try {
            await this.clientProvider
                .getEvitaSessionClient(connection)
                .close(
                    {},
                    {
                        headers: {
                            sessionId: session.id
                        }
                    }
                )
        } catch (e) {
            if (e instanceof ConnectError && e.code === Code.InvalidArgument) {
                // ignore, session already closed
                return
            }
            throw e
        }
    }

    private async closeReadWriteSession(connection: Connection, catalog: Catalog): Promise<void> {
        let session: ReadWriteSessionInfo | undefined = this.activeReadWriteSessions.get(catalog.name)
        if (session == undefined) {
            return
        }

        session.unregisterUser()
        if (!catalog.isInWarmup && session.canClose) {
            try {
                await this.clientProvider
                    .getEvitaSessionClient(connection)
                    .close(
                        {},
                        {
                            headers: {
                                sessionId: session.id
                            }
                        }
                    )
            } catch (e) {
                if (e instanceof ConnectError && e.code === Code.InvalidArgument) {
                    // ignore, session already closed
                    return
                }
                throw e
            }
        }

        if (!catalog.isInWarmup) {
            // there will not be any read only session in alive state

            const readOnlySessionForCatalog: SessionInfo | undefined = await this.getReadOnlySession(connection, catalog)
            if (readOnlySessionForCatalog != undefined && readOnlySessionForCatalog instanceof ReadOnlySessionInfo) {
                readOnlySessionForCatalog.invalidate()
            }
        }
    }
}

abstract class SessionInfo {
    readonly id: string

    private _invalidate: boolean = false

    protected constructor(id: string) {
        this.id = id
    }

    get shouldInvalidate(): boolean {
        return this._invalidate
    }

    invalidate(): void {
        this._invalidate = true
    }
}

class ReadOnlySessionInfo extends SessionInfo {

    constructor(id: string) {
        super(id)
    }
}

class ReadWriteSessionInfo extends SessionInfo {

    private _usages: number = 1

    constructor(id: string) {
        super(id)
    }

    registerUser(): void {
        this._usages++
    }

    unregisterUser(): void {
        this._usages--
    }

    get canClose(): boolean {
        return this._usages <= 0
    }
}
