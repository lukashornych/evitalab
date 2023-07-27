import { Store } from 'vuex'
import { State } from '@/store'
import { TabRequest } from '@/model/editor'
import { inject, InjectionKey } from 'vue'

export const key: InjectionKey<EditorService> = Symbol()

/**
 * Handles lifecycle of editor. Mainly, it handles creation and destruction of tabs.
 */
export class EditorService {
    readonly store: Store<State>

    constructor(store: Store<State>) {
        this.store = store
    }

    getTabRequests(): TabRequest<any>[] {
        return this.store.state.editor.tabsRequests
    }

    getTabRequest(id: string): TabRequest<any> | null {
        return this.getTabRequests().find(it => it.id === id) || null
    }

    createTabRequest(tabRequest: TabRequest<any>): void {
        this.store.commit('editor/addTabRequest', tabRequest)
    }

    destroyTabRequest(tabId: string): void {
        this.store.commit('editor/destroyTabRequest', tabId)
    }
}

export const useEditorService = (): EditorService => {
    return inject(key) as EditorService
}
