import { EvitaDBConnection } from '@/model/lab'
import { inject, InjectionKey } from 'vue'
import { Store } from 'vuex'
import { State } from '@/store'
import { EvitaDBClient } from '@/services/evitadb-client'
import { Catalog, CatalogSchema, EntitySchema } from '@/model/evitadb'

export const key: InjectionKey<LabService> = Symbol()

/**
 * Service that manages lifecycle of a whole evitaLab instance. It contains generic methods for accessing evitaDB servers
 * and so on.
 */
export class LabService {
    readonly store: Store<State>
    readonly evitaDBClient: EvitaDBClient

    constructor(store: Store<State>, evitaDBClient: EvitaDBClient) {
        this.store = store
        this.evitaDBClient = evitaDBClient
    }

    getConnections = (): EvitaDBConnection[] => {
        return this.store.state.lab.connections
    }

    addConnection = (connection: EvitaDBConnection): void => {
        this.store.commit('lab/addConnection', connection)
    }

    removeConnection = (connectionName: string): void => {
        this.store.commit('lab/removeConnection', connectionName)
    }

    getCatalog = async (connection: EvitaDBConnection, catalogName: string): Promise<Catalog> => {
        let catalog: Catalog | undefined = this.store.getters['lab/getCatalog'](connection.id, catalogName)
        if (catalog === undefined) {
            await this.fetchCatalogs(connection)

            catalog = this.store.getters['lab/getCatalog'](connection.id, catalogName)
            if (catalog === undefined) {
                throw new Error(`Catalog ${catalogName} not found.`)
            }
        }
        return catalog
    }

    getCatalogs = async (connection: EvitaDBConnection): Promise<Catalog[]> => {
        let catalogs: Catalog[] | undefined = this.store.getters['lab/getCatalogs'](connection.id)
        if (catalogs === undefined) {
            catalogs = await this.fetchCatalogs(connection)
        }
        return catalogs
    }

    getCatalogSchema = async (connection: EvitaDBConnection, catalogName: string): Promise<CatalogSchema> => {
        let catalogSchema: CatalogSchema | undefined = this.store.getters['lab/getCatalogSchema'](connection.id, catalogName)
        if (catalogSchema === undefined) {
            catalogSchema = await this.fetchCatalogSchema(connection, catalogName)
        }
        return catalogSchema
    }

    getEntitySchema = async (connection: EvitaDBConnection, catalogName: string, entityType: string): Promise<any> => {
        let entitySchema: EntitySchema | undefined = this.store.getters['lab/getEntitySchema'](connection.id, catalogName, entityType)
        if (entitySchema === undefined) {
            await this.getCatalogSchema(connection, catalogName)
            entitySchema = this.store.getters['lab/getEntitySchema'](connection.id, catalogName, entityType)
        }
        return entitySchema
    }

    private async fetchCatalogs(connection: EvitaDBConnection): Promise<Catalog[]> {
        const fetchedCatalogs: Catalog[] = await this.evitaDBClient.getCatalogs(connection)

        this.store.commit(
            'lab/putCatalogs',
            {
                connectionId: connection.id,
                catalogs: fetchedCatalogs
            }
        )

        return fetchedCatalogs
    }

    private async fetchCatalogSchema(connection: EvitaDBConnection, catalogName: string): Promise<CatalogSchema> {
        const catalog: Catalog = await this.getCatalog(connection, catalogName)

        const fetchedCatalogSchema: CatalogSchema = await this.evitaDBClient.getCatalogSchema(connection, catalog.name)

        this.store.commit(
            'lab/putCatalogSchema',
            {
                connectionId: connection.id,
                catalogSchema: fetchedCatalogSchema
            }
        )

        return fetchedCatalogSchema
    }
}

export const useLabService = (): LabService => {
    return inject(key) as LabService
}
