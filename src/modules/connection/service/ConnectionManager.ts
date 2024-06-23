import { inject, InjectionKey } from 'vue'
import { ConnectionStore, useConnectionStore } from '@/modules/connection/store/connectionStore'
import Cookies from 'js-cookie'
import { EvitaDBConnection } from '@/modules/connection/model/EvitaDBConnection'
import { LabStorage } from '@/modules/storage/LabStorage'
import { EvitaDBConnectionId } from '@/modules/connection/model/EvitaDBConnectionId'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { DuplicateEvitaDBConnectionError } from '@/modules/connection/exception/DuplicateEvitaDBConnectionError'
import { Catalog } from '@/modules/connection/model/Catalog'
import { CatalogSchema } from '@/modules/connection/model/CatalogSchema'

/**
 * Cookie containing preconfigured connections. These will be displayed next to the user-defined connections.
 */
const preconfiguredConnectionsCookieName: string = 'evitalab_pconnections'

const userConnectionsStorageKey: string = 'userConnections'

export const key: InjectionKey<ConnectionManager> = Symbol()

/**
 * Service that manages lifecycle of a whole evitaLab instance. It contains generic methods for accessing evitaDB servers
 * and so on.
 */
export class ConnectionManager {
    private readonly store: ConnectionStore
    private readonly labStorage: LabStorage

    private constructor(store: ConnectionStore, labStorage: LabStorage) {
        this.store = store
        this.labStorage = labStorage
    }

    /**
     * Loads data and initializes connection manager
     *
     * @param labStorage
     */
    static load(labStorage: LabStorage): ConnectionManager {
        const store: ConnectionStore = useConnectionStore()

        let preconfiguredConnections: EvitaDBConnection[] = []
        // load preconfigured connections from cookie from hosted evitaDB instance
        const preconfiguredConnectionsCookie: string | undefined = Cookies.get(preconfiguredConnectionsCookieName)
        if (preconfiguredConnectionsCookie != undefined) {
            try {
                preconfiguredConnections = (JSON.parse(atob(preconfiguredConnectionsCookie)) as Array<any>)
                    .map(connection => EvitaDBConnection.fromJson(connection, true))
                // todo validate duplicate connections, move this to Lab component to have access to Toaster
            } catch (e) {
                console.error('Failed to load preconfigured connections cookie', e)
            }
        }
        // automatic demo connection configuration for easier development
        if (import.meta.env.DEV) {
            preconfiguredConnections.push(new EvitaDBConnection(
                'demo',
                'Demo (dev)',
                true,
                'https://demo.evitadb.io/lab/api',
                'https://demo.evitadb.io:5555/rest',
                'https://demo.evitadb.io:5555/gql'
            ))
            preconfiguredConnections.push(new EvitaDBConnection(
                'localhost',
                'Localhost (dev)',
                true,
                'https://localhost:5555/lab/api',
                'https://localhost:5555/rest',
                'https://localhost:5555/gql'
            ))
        }

        // load user-defined connections from local storage
        const userConnections: EvitaDBConnection[] = labStorage.get(userConnectionsStorageKey, [])
            .map((it: any) => EvitaDBConnection.fromJson(it, false))

        // inject connections into the lab
        store.replacePreconfiguredConnections(preconfiguredConnections)
        store.replaceUserConnections(userConnections)

        // expire cookies, so when the lab is reloaded, it will load new cookie values
        Cookies.remove(preconfiguredConnectionsCookieName)

        return new ConnectionManager(store, labStorage)
    }

    /**
     * Returns specific connection (either preconfigured or user one)
     */
    getConnection(id: EvitaDBConnectionId): EvitaDBConnection {
        const connection: EvitaDBConnection | undefined = this.store.connections
            .find(c => c.id === id) as EvitaDBConnection | undefined
        if (connection == undefined) {
            throw new UnexpectedError(undefined, `Connection for ID '${id}' not found.`)
        }
        return connection
    }

    /**
     * Returns all connections: preconfigured and user ones.
     */
    getConnections(): EvitaDBConnection[] {
        return this.store.connections as EvitaDBConnection[]
    }

    isConnectionExists(connectionName: string): boolean {
        return this.store.connections.find(c => c.name === connectionName) != undefined
    }

    /**
     * Adds connection to UI and lab storage
     */
    addConnection(connection: EvitaDBConnection): void {
        if (this.isConnectionExists(connection.name)) {
            throw new DuplicateEvitaDBConnectionError(connection.name)
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
    async getCatalog(connection: EvitaDBConnection, catalogName: string): Promise<Catalog> {
        let catalog: Catalog | undefined = this.store.cachedCatalogs.get(connection.id)?.get(catalogName)
        if (catalog == undefined) {
            await this.fetchCatalogs(connection)

            catalog = this.store.cachedCatalogs.get(connection.id)?.get(catalogName)
            if (catalog == undefined) {
                throw new UnexpectedError(connection, `Catalog ${catalogName} not found.`)
            }
        }
        return catalog
    }

    async getCatalogs(connection: EvitaDBConnection): Promise<Catalog[]> {
        const cachedCatalogs: IterableIterator<Catalog> | undefined = this.store.cachedCatalogs.get(connection.id)?.values()
        if (cachedCatalogs == undefined) {
            return await this.fetchCatalogs(connection)
        } else {
            return Array.from(cachedCatalogs)
        }
    }

    async getCatalogSchema(connection: EvitaDBConnection, catalogName: string): Promise<CatalogSchema> {
        let catalogSchema: CatalogSchema | undefined = this.store.cachedCatalogSchemas.get(connection.id)?.get(catalogName)
        if (catalogSchema == undefined) {
            catalogSchema = await this.fetchCatalogSchema(connection, catalogName)
        }
        return catalogSchema
    }

    private async fetchCatalogs(connection: EvitaDBConnection): Promise<Catalog[]> {
        const fetchedCatalogs: Catalog[] = await (await connection.getResolvedDriver()).getCatalogs(connection)
        this.store.cachedCatalogs.set(
            connection.id,
            new Map<string, Catalog>(fetchedCatalogs.map(catalog => [catalog.name, catalog]))
        )
        return fetchedCatalogs
    }

    private async fetchCatalogSchema(connection: EvitaDBConnection, catalogName: string): Promise<CatalogSchema> {
        const catalog: Catalog = await this.getCatalog(connection, catalogName)

        const fetchedCatalogSchema: CatalogSchema = await (await connection.getResolvedDriver()).getCatalogSchema(connection, catalog.name)
        this.store.cachedCatalogSchemas.set(
            connection.id,
            new Map<string, CatalogSchema>([[fetchedCatalogSchema.name, fetchedCatalogSchema]])
        )
        return fetchedCatalogSchema
    }
}

export const useConnectionManager = (): ConnectionManager => {
    return inject(key) as ConnectionManager
}
