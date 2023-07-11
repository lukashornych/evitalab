import { InjectionKey } from 'vue'
import { createStore, createLogger, Store } from 'vuex'
import { ConnectionsState } from './modules/connections'
import connections from './modules/connections'

const debug: boolean = process.env.NODE_ENV !== 'production'

/**
 * Root state interface
 */
export type State = {
    connections: ConnectionsState
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store: Store<State> = createStore<State>({
    modules: {
        connections
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})
