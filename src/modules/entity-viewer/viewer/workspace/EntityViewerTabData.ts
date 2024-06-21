import { TabRequestComponentData } from '@/model/editor/tab/TabRequestComponentData'
import { QueryPriceMode } from '@/model/evitadb'
import { TabRequestComponentDataDto } from '@/model/editor/tab/TabRequestComponentDataDto'

import { EntityPropertyKey } from '@/modules/entity-viewer/viewer/workspace/EntityPropertyKey'
import { QueryLanguage } from '@/model/QueryLanguage'

/**
 * Represents injectable/storable user data of the LabEditorConsoleDataGrid component.
 */
export class EntityViewerTabData implements TabRequestComponentData<DataGridDataDto> {
    readonly queryLanguage?: QueryLanguage
    readonly filterBy?: string
    readonly orderBy?: string
    readonly dataLocale?: string
    readonly priceType?: QueryPriceMode
    readonly displayedProperties?: EntityPropertyKey[]
    readonly pageSize?: number
    readonly pageNumber?: number

    constructor(queryLanguage?: QueryLanguage,
                filterBy?: string,
                orderBy?: string,
                dataLocale?: string,
                displayedProperties?: EntityPropertyKey[],
                pageSize?: number,
                pageNumber?: number) {
        this.queryLanguage = queryLanguage
        this.filterBy = filterBy
        this.orderBy = orderBy
        this.dataLocale = dataLocale
        this.displayedProperties = displayedProperties
        this.pageSize = pageSize
        this.pageNumber = pageNumber
    }

    static restoreFromSerializable(json: TabRequestComponentDataDto): EntityViewerTabData {
        const dto: DataGridDataDto = json as DataGridDataDto
        return new EntityViewerTabData(
            dto.queryLanguage,
            dto.filterBy,
            dto.orderBy,
            dto.dataLocale,
            dto.displayedProperties?.map((key: string) => EntityPropertyKey.fromString(key)),
            dto.pageSize,
            dto.pageNumber
        )
    }

    toSerializable(): DataGridDataDto {
        return {
            queryLanguage: this.queryLanguage,
            filterBy: this.filterBy,
            orderBy: this.orderBy,
            dataLocale: this.dataLocale,
            displayedProperties: this.displayedProperties?.map(key => key.toString()),
            pageSize: this.pageSize,
            pageNumber: this.pageNumber
        }
    }
}
