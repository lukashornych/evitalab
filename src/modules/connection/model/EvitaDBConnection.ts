import XXH, { HashObject } from 'xxhashjs'
import { EvitaDBConnectionId } from '@/modules/connection/model/EvitaDBConnectionId'
import { ConnectionServerInfo } from '@/modules/connection/model/ConnectionServerInfo'
import { EvitaDBServerProbe, useEvitaDBServerProbe } from '@/modules/connection/service/EvitaDBServerProbe'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { EvitaDBDriver } from '@/modules/connection/driver/EvitaDBDriver'
import { EvitaDBDriverResolver, useEvitaDBDriverResolver } from '@/modules/connection/driver/EvitaDBDriverResolver'

const hasher: HashObject = XXH.h64()

/**
 * Represents a connection to a single evitaDB server. This allows the user to fetch data from concrete evitaDB server.
 */
export class EvitaDBConnection {
    readonly id: EvitaDBConnectionId
    readonly name: string
    readonly preconfigured: boolean
    readonly systemUrl: string
    readonly labApiUrl?: string
    readonly gqlUrl?: string
    readonly restUrl?: string

    private serverInfo?: ConnectionServerInfo
    private resolvedDriver?: EvitaDBDriver

    constructor(id: EvitaDBConnectionId | undefined,
                name: string,
                preconfigured: boolean,
                systemUrl: string,
                labApiUrl?: string,
                gqlUrl?: string,
                restUrl?: string) {
        this.id = id ? id : hasher.update(name).digest().toString(16)
        this.name = name
        this.preconfigured = preconfigured
        this.systemUrl = this.normalizeApiUrl(systemUrl)!
        this.labApiUrl = this.normalizeApiUrl(labApiUrl)
        this.gqlUrl = this.normalizeApiUrl(gqlUrl)
        this.restUrl = this.normalizeApiUrl(restUrl)
    }

    static fromJson(json: any, preconfigured: boolean): EvitaDBConnection {
        return new EvitaDBConnection(json.id, json.name, preconfigured, json.labApiUrl, json.gqlUrl, json.restUrl)
    }

    /**
     * Returns info about server represented by this connection
     */
    async getServerInfo(): Promise<ConnectionServerInfo> {
        if (this.serverInfo == undefined) {
            await this.probeServer()
        }
        if (this.serverInfo == undefined) {
            throw new UnexpectedError(this, `Could not probe server for connection '${this.name}.'`)
        }
        return this.serverInfo
    }

    /**
     * Returns resolved evitaDB driver for this connection based on the server info
     */
    async getResolvedDriver(): Promise<EvitaDBDriver> {
        if (this.resolvedDriver == undefined) {
            await this.resolveDriver()
        }
        if (this.resolvedDriver == undefined) {
            throw new UnexpectedError(this, `Could not resolve driver for connection '${this.name}.'`)
        }
        return this.resolvedDriver
    }

    private async probeServer(): Promise<void> {
        const evitaDBServerProbe: EvitaDBServerProbe = useEvitaDBServerProbe()
        this.serverInfo = await evitaDBServerProbe.fetchServerInfo(this)
    }

    private async resolveDriver(): Promise<void> {
        const evitaDBDriverResolver: EvitaDBDriverResolver = useEvitaDBDriverResolver()
        this.resolvedDriver = await evitaDBDriverResolver.resolveDriver(this)
    }

    private normalizeApiUrl(url: string | undefined): string | undefined {
        if (url == undefined) {
            return undefined
        }
        return url.endsWith('/') ? url.substring(0, url.length - 1) : url
    }
}
