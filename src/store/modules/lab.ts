import { EvitaDBConnection } from '@/model/lab'

/**
 * Stores global information about connections to different evitaDB servers.
 */
export type LabState = {
    readonly connections: Array<EvitaDBConnection>
}

type LabMutations = {
    addConnection: (state: LabState, connection: EvitaDBConnection) => void
    removeConnection: (state: LabState, connectionName: string) => void
}

const state = (): LabState => ({
    // todo lho load from local storage
    connections: [
        {
            name: 'evita local',
            restUrl: 'https://localhost:5555/rest',
            gqlUrl: 'https://localhost:5555/gql'
        }
    ]
})

const mutations: LabMutations = {
    addConnection (state, connection): void {
        if (state.connections.find(c => c.name === connection.name)) {
            throw new Error(`Connection with name ${connection.name} already exists.`)
        }
        state.connections.push(connection)
    },

    removeConnection (state, connectionName): void {
        state.connections.splice(state.connections.findIndex(connection => connection.name === connectionName), 1)
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
