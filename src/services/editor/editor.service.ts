import { Store } from 'vuex'
import { State } from '@/store'
import {
    SerializableTabRequestComponentData,
    SerializableTabRequestComponentParams,
    TabRequest,
    TabRequestComponentData,
} from '@/model/editor/editor'
import { inject, InjectionKey } from 'vue'
import { TabType } from '@/model/editor/tab/serializable-tab-object'
import { DataGridRequest } from '@/model/editor/data-grid-request'
import { EvitaQLConsoleRequest } from '@/model/editor/evitaql-console-request'
import { GraphQLConsoleRequest } from '@/model/editor/graphql-console-request'
import { SchemaViewerRequest } from '@/model/editor/schema-viewer-request'
import { UnexpectedError } from '@/model/lab'
import { LabService } from '@/services/lab.service'
import { StoredTabObject } from '@/model/editor/tab/stored-tab-object'
import { LabStorage } from '@/services/lab-storage'

export const key: InjectionKey<EditorService> = Symbol()

const openedTabsStorageKey: string = 'openedTabs'

/**
 * Handles lifecycle of editor. Mainly, it handles creation and destruction of tabs.
 */
export class EditorService {
    private readonly store: Store<State>
    private readonly labService: LabService

    constructor(store: Store<State>, labService: LabService) {
        this.store = store
        this.labService = labService
    }

    getTabRequests(): TabRequest<any, any>[] {
        return this.store.state.editor.tabsRequests
    }

    getTabRequest(id: string): TabRequest<any, any> | undefined {
        return this.getTabRequests().find(it => it.id === id)
    }

    getTabRequestIndex(id: string): number {
        return this.getTabRequests().findIndex(it => it.id === id)
    }

    getNewTabRequest(): TabRequest<any, any> | undefined {
        return this.getTabRequests().find(it => it.new)
    }

    createTabRequest(tabRequest: TabRequest<any, any>): void {
        this.store.commit('editor/addTabRequest', tabRequest)
    }

    markTabRequestAsVisited(tabId: string): void {
        this.store.commit('editor/markTabRequestAsVisited', tabId)
    }

    destroyTabRequest(tabId: string): void {
        this.store.commit('editor/destroyTabRequest', tabId)
    }

    createTabRequestsForTabsFromLastSession(): Map<string, TabRequestComponentData> | undefined {
        const storage: LabStorage = this.store.state.lab.storage
        const lastOpenedTabs: StoredTabObject[] = storage.get(openedTabsStorageKey, [])
            .map((it: string) => StoredTabObject.restoreFromSerializable(it))
        storage.remove(openedTabsStorageKey)
        if (lastOpenedTabs.length === 0) {
            return undefined
        }

        const restoredTabsData: Map<string, TabRequestComponentData> = new Map()
        lastOpenedTabs
            .map(storedTabObject => {
                switch (storedTabObject.tabType) {
                    case TabType.DataGrid:
                        return DataGridRequest.restoreFromJson(this.labService, storedTabObject.tabParams, storedTabObject.tabData || {})
                    case TabType.EvitaQLConsole:
                        return EvitaQLConsoleRequest.restoreFromJson(this.labService, storedTabObject.tabParams, storedTabObject.tabData || {})
                    case TabType.GraphQLConsole:
                        return GraphQLConsoleRequest.restoreFromJson(this.labService, storedTabObject.tabParams, storedTabObject.tabData || {})
                    case TabType.SchemaViewer:
                        return SchemaViewerRequest.restoreFromJson(this.labService, storedTabObject.tabParams)
                    default:
                        throw new UnexpectedError(undefined, `Unsupported stored tab type '${storedTabObject.tabType}'.`)
                }
            })
            .forEach(tabRequest => {
                if (tabRequest.initialData != undefined) {
                    restoredTabsData.set(tabRequest.id, tabRequest.initialData)
                }
                this.createTabRequest(tabRequest)
            })

        return restoredTabsData
    }

    storeOpenedTabs(tabsData: Map<string, TabRequestComponentData>): void {
        const tabsToStore: string[] = this.getTabRequests()
            .map(tabRequest => {
                let tabType: TabType
                if (tabRequest instanceof DataGridRequest) {
                    tabType = TabType.DataGrid
                } else if (tabRequest instanceof EvitaQLConsoleRequest) {
                    tabType = TabType.EvitaQLConsole
                } else if (tabRequest instanceof GraphQLConsoleRequest) {
                    tabType = TabType.GraphQLConsole
                } else if (tabRequest instanceof SchemaViewerRequest) {
                    tabType = TabType.SchemaViewer
                } else {
                    console.info(undefined, `Unsupported tab type '${tabRequest.constructor.name}'. Not storing for next session.`)
                    return undefined
                }

                const tabData: TabRequestComponentData | undefined = tabsData.get(tabRequest.id)
                return new StoredTabObject(
                    tabType,
                    (tabRequest.params as SerializableTabRequestComponentParams<any>).toSerializable(),
                    tabData instanceof SerializableTabRequestComponentData ? tabData.toSerializable() : undefined
                )
            })
            .filter(it => it != undefined)
            .map(it => it as StoredTabObject)
            .map(it => it.toSerializable())

        const storage = this.store.state.lab.storage
        storage.set(openedTabsStorageKey, tabsToStore)
    }
}

export const useEditorService = (): EditorService => {
    return inject(key) as EditorService
}
