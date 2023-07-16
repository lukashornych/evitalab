import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, createLogger, Store } from 'vuex'
import { LabState } from './modules/lab'
import lab from './modules/lab'
import { EditorState } from './modules/editor'
import editor from './modules/editor'

const debug: boolean = process.env.NODE_ENV !== 'production'

/**
 * Root state interface
 */
export type State = {
    readonly lab: LabState,
    readonly editor: EditorState
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store: Store<State> = createStore<State>({
    modules: {
        lab,
        editor
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})

export function useStore() {
    return baseUseStore(key)
}
