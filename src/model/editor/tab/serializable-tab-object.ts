import {
    TabRequestComponentData,
    TabRequestComponentDataDto,
    TabRequestComponentParamsDto
} from '@/model/editor/editor'

/**
 * Represents an object that holds serializable info about a specific tab.
 */
export abstract class SerializableTabObject {
    readonly tabType: TabType
    readonly tabParams: TabRequestComponentParamsDto
    readonly tabData: TabRequestComponentData

    protected constructor(tabType: TabType, tabParams: TabRequestComponentParamsDto, tabData: TabRequestComponentDataDto) {
        this.tabType = tabType
        this.tabParams = tabParams
        this.tabData = tabData
    }
}

/**
 * Used to identify the type of tab to serialize. Defines what params and data will be shared.
 */
export enum TabType {
    DataGrid = 'data-grid',
    EvitaQLConsole = 'evitaql-console',
    GraphQLConsole = 'graphql-console',
    SchemaViewer = 'schema-viewer'
}
