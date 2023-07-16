import { TabRequest } from '@/model/editor'

export type EditorState = {
    readonly tabsRequests: TabRequest[]
}

type EditorMutations = {
    addTabRequest: (state: EditorState, console: TabRequest) => void,
    destroyTabRequest: (state: EditorState, consoleId: string) => void
}

const state = (): EditorState => ({
    tabsRequests: []
})

const mutations: EditorMutations = {
    addTabRequest (state, tabRequest): void {
        state.tabsRequests.push(tabRequest)
    },

    destroyTabRequest (state, consoleId): void {
        state.tabsRequests.splice(state.tabsRequests.findIndex(tabRequest => tabRequest.id === consoleId), 1)
    }
}

export default {
    namespaced: true,
    state,
    mutations
}
