import { EvitaDBConnection, EvitaDBConnectionId } from '@/model/lab'
import { CatalogSchema, EntitySchema } from '@/model/evitadb/schema'
import { Catalog } from '@/model/evitadb/system'

/**
 * Stores global information about configured evitaDB servers.
 */
export type LabState = {
    /**
     * List of configured evitaDB servers.
     */
    readonly connections: EvitaDBConnection[],
    readonly catalogs: Map<EvitaDBConnectionId, Map<string, Catalog>>,
    /**
     * Cache of catalog schemas for all servers.
     */
    readonly catalogSchemas: Map<EvitaDBConnectionId, Map<string, CatalogSchema>>,
}

type LabGetters = {
    getCatalog(state: LabState): (connectionId: EvitaDBConnectionId, catalogName: string) =>  Catalog | undefined
    getCatalogs(state: LabState): (connectionId: EvitaDBConnectionId) => Catalog[] | undefined
    getCatalogSchema(state: LabState): (connectionId: EvitaDBConnectionId, catalogName: string) => CatalogSchema | undefined
    getEntitySchema(state: LabState): (connectionId: EvitaDBConnectionId, catalogName: string, entityType: string) => EntitySchema | undefined
}

type LabMutations = {
    addConnection(state: LabState, connection: EvitaDBConnection): void
    removeConnection(state: LabState, connectionName: string): void

    putCatalogs(state: LabState, payload: { connectionId: EvitaDBConnectionId, catalogs: Catalog[] }): void
    putCatalogSchema(state: LabState, payload: { connectionId: EvitaDBConnectionId, catalogSchema: CatalogSchema }): void
}

const state = (): LabState => ({
    // todo lho load from local storage
    connections: [
        new EvitaDBConnection(
            'evita local',
            'https://localhost:5555/rest',
            'https://localhost:5555/gql'
        )
    ],
    catalogs: new Map<EvitaDBConnectionId, Map<string, Catalog>>(),
    catalogSchemas: new Map<EvitaDBConnectionId, Map<string, CatalogSchema>>()
})

const getters: LabGetters = {
    getCatalog(state: LabState): (connectionId: EvitaDBConnectionId, catalogName: string) => Catalog | undefined {
        return (connectionId: EvitaDBConnectionId, catalogName: string) => {
            return state.catalogs.get(connectionId)?.get(catalogName)
        }
    },
    getCatalogs(state: LabState): (connectionId: EvitaDBConnectionId) => Catalog[] | undefined {
        return (connectionId: EvitaDBConnectionId) => {
            const catalogs: IterableIterator<Catalog> | undefined = state.catalogs.get(connectionId)?.values()
            if (catalogs === undefined) {
                return undefined
            }
            return Array.from(catalogs)
        }
    },
    getCatalogSchema(state: LabState): (connectionId: EvitaDBConnectionId, catalogName: string) => CatalogSchema | undefined {
        return (connectionId: EvitaDBConnectionId, catalogName: string) => {
            return state.catalogSchemas.get(connectionId)?.get(catalogName)
        }
    },
    getEntitySchema(state: LabState): (connectionId: EvitaDBConnectionId, catalogName: string, entityType: string) => EntitySchema | undefined {
        return (connectionId: EvitaDBConnectionId, catalogName: string, entityType: string) => {
            return state.catalogSchemas.get(connectionId)
                ?.get(catalogName)
                ?.allEntitySchemas.find(entitySchema => entitySchema.name === entityType)
        }
    }
}

const mutations: LabMutations = {
    addConnection(state, connection): void {
        if (state.connections.find(c => c.name === connection.name)) {
            throw new Error(`Connection with name ${connection.name} already exists.`)
        }
        state.connections.push(connection)
    },

    removeConnection(state, connectionName): void {
        state.connections.splice(state.connections.findIndex(connection => connection.name === connectionName), 1)
    },

    putCatalogs(state, payload): void {
        state.catalogs.set(
            payload.connectionId,
            new Map<string, Catalog>(payload.catalogs.map(catalog => [catalog.name, catalog]))
        )
    },

    putCatalogSchema(state, payload): void {
        state.catalogSchemas.set(
            payload.connectionId,
            new Map<string, CatalogSchema>([[payload.catalogSchema.name, payload.catalogSchema]])
        )
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations
}
