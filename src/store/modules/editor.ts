import { TabRequest } from '@/model/editor/tab/TabRequest'
import { TabHistoryKey } from '@/model/editor/tab/history/TabHistoryKey'

export type EditorState = {
    readonly tabRequests: TabRequest<any, any>[],
    tabHistory: Map<string, any[]>
}

type EditorGetters = {
    getTabHistoryRecords(state: EditorState): <R>(historyKey: TabHistoryKey<R>) => R[]
}

type EditorMutations = {
    addTab: (state: EditorState, tabRequest: TabRequest<any, any>) => void,
    markTabAsVisited: (state: EditorState, id: string) => void,
    destroyTab: (state: EditorState, id: string) => void,
    destroyAllTabs: (state: EditorState) => void,

    prefillTabHistory: (state: EditorState, tabHistory: Map<string, any[]>) => void,
    addTabHistoryRecord: <R>(state: EditorState, payload: { historyKey: TabHistoryKey<R>, record: R }) => void,
    clearTabHistory: (state: EditorState, historyKey: TabHistoryKey<any>) => void
}

const state = (): EditorState => ({
    tabRequests: [],
    tabHistory: new Map()
})

const getters: EditorGetters = {
    getTabHistoryRecords(state: EditorState): <R>(historyKey: TabHistoryKey<R>) => R[] {
        return (historyKey) => {
            return state.tabHistory.get(historyKey.toString()) ?? []
        }
    }
}

const mutations: EditorMutations = {
    addTab (state, tabRequest): void {
        // tab requests may share static ID to indicate only one such tab can be opened at a time
        const tabRequestWithSameId = state.tabRequests.find(it => it.id === tabRequest.id)
        if (tabRequestWithSameId == undefined) {
            state.tabRequests.push(tabRequest)
        }
    },

    markTabAsVisited (state, id): void {
        const tabRequest: TabRequest<any, any> | undefined = state.tabRequests.find(tabRequest => tabRequest.id === id)
        if (tabRequest) {
            tabRequest.new = false
        }
    },

    destroyTab (state, id): void {
        state.tabRequests.splice(state.tabRequests.findIndex(tabRequest => tabRequest.id === id), 1)
    },

    destroyAllTabs (state): void {
        state.tabRequests.splice(0)
    },

    prefillTabHistory (state, tabHistory): void {
        state.tabHistory = tabHistory
    },

    addTabHistoryRecord (state, payload): void {
        const historyKey: string = payload.historyKey.toString()

        let records: any[] | undefined = state.tabHistory.get(historyKey)
        if (records == undefined) {
            records = []
            state.tabHistory.set(historyKey, records)
        }

        // ignore empty records
        if (payload.record instanceof Array) {
            let emptyParts: number = 0
            for (let i = 1; i < payload.record.length; i++) {
                const part: any | undefined = payload.record[i]
                if (part == undefined || part === '') {
                    emptyParts += 1
                }
            }
            if (emptyParts === payload.record.length - 1) {
                return
            }
        } else {
            if (payload.record == undefined || payload.record === '') {
                return
            }
        }

        // ignore duplicate records
        const lastRecord: any | undefined = records.at(-1)
        if (lastRecord != undefined) {
            if (payload.record instanceof Array) {
                let equalParts: number = 0
                for (let i = 1; i < payload.record.length; i++) {
                    const recordPart: any | undefined = payload.record[i]
                    const lastRecordPart: any | undefined = lastRecord[i]
                    if (recordPart === lastRecordPart) {
                        equalParts += 1
                    }
                }
                if (equalParts === payload.record.length - 1) {
                    return
                }
            } else {
                if (lastRecord === payload.record) {
                    return
                }
            }
        }

        records.push(payload.record)
        if (records.length > 10) {
            records.shift()
        }
    },

    clearTabHistory (state, historyKey): void {
        state.tabHistory.delete(historyKey.toString())
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations
}
