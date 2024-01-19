import {
    TabRequestComponentDataDto,
    TabRequestComponentParamsDto
} from '@/model/editor/editor'
import LZString from 'lz-string'

/**
 * Used to share a tab and its data between browsers (users).
 */
export class ShareTabObject {
    readonly tabType: TabType
    readonly tabParams: TabRequestComponentParamsDto
    readonly tabData: TabRequestComponentDataDto

    constructor(tabType: TabType, tabParams: TabRequestComponentParamsDto, tabData: TabRequestComponentDataDto) {
        this.tabType = tabType
        this.tabParams = tabParams
        this.tabData = tabData
    }

    static fromLinkParam(param: string): ShareTabObject {
        const json: any = JSON.parse(LZString.decompressFromEncodedURIComponent(param))
        return new ShareTabObject(json.tabType, json.tabParams, json.tabData)
    }

    toLinkParam(): string {
        const serialized = JSON.stringify(this)
        return LZString.compressToEncodedURIComponent(serialized)
    }
}

/**
 * Used to identify the type of tab to share. Defines what params and data will be shared.
 */
export enum TabType {
    DataGrid = 'data-grid',
    EvitaQLConsole = 'evitaql-console',
    GraphQLConsole = 'graphql-console',
    SchemaViewer = 'schema-viewer'
}
