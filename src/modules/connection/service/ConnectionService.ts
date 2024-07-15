import { InjectionKey } from 'vue'
import { ConnectionStore } from '@/modules/connection/store/connectionStore'
import Cookies from 'js-cookie'
import { Connection } from '@/modules/connection/model/Connection'
import { LabStorage } from '@/modules/storage/LabStorage'
import { ConnectionId } from '@/modules/connection/model/ConnectionId'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { DuplicateConnectionError } from '@/modules/connection/exception/DuplicateConnectionError'
import { Catalog } from '@/modules/connection/model/Catalog'
import { CatalogSchema } from '@/modules/connection/model/schema/CatalogSchema'
import { EntitySchema } from '@/modules/connection/model/schema/EntitySchema'
import { mandatoryInject } from '@/utils/reactivity'
import { EvitaDBDriverResolver } from '@/modules/connection/driver/EvitaDBDriverResolver'
import { EvitaDBDriver } from '@/modules/connection/driver/EvitaDBDriver'

/**
 * Cookie containing preconfigured connections. These will be displayed next to the user-defined connections.
 */
const preconfiguredConnectionsCookieName: string = 'evitalab_pconnections'
const userConnectionsStorageKey: string = 'userConnections'

export const connectionServiceInjectionKey: InjectionKey<ConnectionService> = Symbol('connectionService')

/**
 * Service that manages lifecycle of a whole evitaLab instance. It contains generic methods for accessing evitaDB servers
 * and so on.
 */
export class ConnectionService {
    private readonly store: ConnectionStore
    private readonly labStorage: LabStorage
    private readonly evitaDBDriverResolver: EvitaDBDriverResolver

    private readonly connectionDriverCache: Map<ConnectionId, EvitaDBDriver> = new Map()

    private constructor(store: ConnectionStore, labStorage: LabStorage, evitaDBDriverResolver: EvitaDBDriverResolver) {
        this.store = store
        this.labStorage = labStorage
        this.evitaDBDriverResolver = evitaDBDriverResolver
    }

    /**
     * Loads data and initializes connection manager
     */
    static load(store: ConnectionStore, labStorage: LabStorage, evitaDBDriverResolver: EvitaDBDriverResolver): ConnectionService {
        let preconfiguredConnections: Connection[] = []
        // load preconfigured connections from cookie from hosted evitaDB instance
        const preconfiguredConnectionsCookie: string | undefined = Cookies.get(preconfiguredConnectionsCookieName)
        if (preconfiguredConnectionsCookie != undefined) {
            try {
                preconfiguredConnections = (JSON.parse(atob(preconfiguredConnectionsCookie)) as Array<any>)
                    .map(connection => Connection.fromJson(connection, true))
                // todo validate duplicate connections, move this to Lab component to have access to Toaster
            } catch (e) {
                console.error('Failed to load preconfigured connections cookie', e)
            }
        }
        // automatic demo connection configuration for easier development
        if (import.meta.env.DEV) {
            preconfiguredConnections.push(new Connection(
                'demo',
                'Demo (dev)',
                true,
                'http://demo.evitadb.io:5555/system',
                'https://demo.evitadb.io/lab/api',
                'https://demo.evitadb.io:5555/gql',
                'https://demo.evitadb.io:5555/rest'
            ))
            preconfiguredConnections.push(new Connection(
                'localhost',
                'Localhost (dev)',
                true,
                'http://localhost:5555/system',
                'https://localhost:5555/lab/api',
                'https://localhost:5555/gql',
                'https://localhost:5555/rest'
            ))
        }

        // load user-defined connections from local storage
        const userConnections: Connection[] = labStorage.get(userConnectionsStorageKey, [])
            .map((it: any) => Connection.fromJson(it, false))

        // inject connections into the lab
        store.replacePreconfiguredConnections(preconfiguredConnections)
        store.replaceUserConnections(userConnections)

        // expire cookies, so when the lab is reloaded, it will load new cookie values
        Cookies.remove(preconfiguredConnectionsCookieName)

        return new ConnectionService(store, labStorage, evitaDBDriverResolver)
    }

    /**
     * Returns specific connection (either preconfigured or user one)
     */
    getConnection(id: ConnectionId): Connection {
        const connection: Connection | undefined = this.store.connections
            .find(c => c.id === id) as Connection | undefined
        if (connection == undefined) {
            throw new UnexpectedError(`Connection for ID '${id}' not found.`)
        }
        return connection
    }

    /**
     * Returns all connections: preconfigured and user ones.
     */
    getConnections(): Connection[] {
        return this.store.connections as Connection[]
    }

    isConnectionExists(connectionName: string): boolean {
        return this.store.connections.find(c => c.name === connectionName) != undefined
    }

    /**
     * Adds connection to UI and lab storage
     */
    addConnection(connection: Connection): void {
        if (this.isConnectionExists(connection.name)) {
            throw new DuplicateConnectionError(connection.name)
        }

        this.store.userConnections.push(connection)
        this.labStorage.set(userConnectionsStorageKey, this.store.userConnections)
    }

    /**
     * Removes connection from UI and lab storage
     */
    removeConnection(connectionName: string): void {
        this.store.userConnections.splice(
            this.store.userConnections.findIndex(connection => connection.name === connectionName),
            1
        )
        this.labStorage.set(userConnectionsStorageKey, this.store.userConnections)
    }

    /**
     * Returns cached catalog. If not present, it tries to fetch current catalog.
     */
    async getCatalog(connection: Connection, catalogName: string): Promise<Catalog> {
        let catalog: Catalog | undefined = this.store.cachedCatalogs.get(connection.id)?.get(catalogName) as Catalog
        if (catalog == undefined) {
            await this.fetchCatalogs(connection)

            catalog = this.store.cachedCatalogs.get(connection.id)?.get(catalogName) as Catalog
            if (catalog == undefined) {
                throw new UnexpectedError(`Catalog '${catalogName}' not found for connection '${connection.name}'.`)
            }
        }
        return catalog
    }

    async getCatalogs(connection: Connection): Promise<Catalog[]> {
        const cachedCatalogs: IterableIterator<Catalog> | undefined = this.store.cachedCatalogs.get(connection.id)?.values() as IterableIterator<Catalog>
        if (cachedCatalogs == undefined) {
            return await this.fetchCatalogs(connection)
        } else {
            return Array.from(cachedCatalogs)
        }
    }

    async getCatalogSchema(connection: Connection, catalogName: string): Promise<CatalogSchema> {
        let catalogSchema: CatalogSchema | undefined = this.store.cachedCatalogSchemas.get(connection.id)?.get(catalogName) as CatalogSchema
        if (catalogSchema == undefined) {
            catalogSchema = await this.fetchCatalogSchema(connection, catalogName)
        }
        return catalogSchema
    }

    async getEntitySchema(connetion: Connection, catalogName: string, entityType: string): Promise<EntitySchema> {
        const catalogSchema: CatalogSchema = await this.getCatalogSchema(connetion, catalogName)
        const entitySchema: EntitySchema | undefined = catalogSchema.entitySchemas
            .getIfSupported()
            ?.get(entityType)
        if (entitySchema == undefined) {
            throw new UnexpectedError(`Entity '${entityType}' not found in catalog '${catalogName}'.`)
        }
        return entitySchema
    }

    private async fetchCatalogs(connection: Connection): Promise<Catalog[]> {
        const fetchedCatalogs: Catalog[] = await (await this.getDriver(connection)).getCatalogs(connection)
        this.store.cachedCatalogs.set(
            connection.id,
            new Map<string, Catalog>(fetchedCatalogs.map(catalog => {
                return [catalog.name, catalog]
            }))
        )
        return fetchedCatalogs
    }

    private async fetchCatalogSchema(connection: Connection, catalogName: string): Promise<CatalogSchema> {
        const catalog: Catalog = await this.getCatalog(connection, catalogName)

        const fetchedCatalogSchema: CatalogSchema = await (await this.getDriver(connection)).getCatalogSchema(connection, catalog.name)
        this.store.cachedCatalogSchemas.set(
            connection.id,
            new Map<string, CatalogSchema>([[fetchedCatalogSchema.name, fetchedCatalogSchema]])
        )
        return fetchedCatalogSchema
    }

    private async getDriver(connection: Connection): Promise<EvitaDBDriver> {
        let cachedDriver: EvitaDBDriver | undefined = this.connectionDriverCache.get(connection.id)
        if (cachedDriver == undefined) {
            cachedDriver = await this.evitaDBDriverResolver.resolveDriver(connection)
            this.connectionDriverCache.set(connection.id, cachedDriver)
        }
        return cachedDriver
    }
}

export const useConnectionService = (): ConnectionService => {
    return mandatoryInject(connectionServiceInjectionKey) as ConnectionService
}
