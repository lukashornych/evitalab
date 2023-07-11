import { Connection } from '@/model/connection'

/**
 * Stores global information about connections to different evitaDB servers.
 */
export type ConnectionsState = {
    connections: Array<Connection>
}

type ConnectionsMutations = {
    addConnection: (state: ConnectionsState, connection: Connection) => void
}

const state = (): ConnectionsState => ({
    connections: []
})

const mutations: ConnectionsMutations = {
    addConnection (state, connection): void {
        state.connections.push(connection)
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
