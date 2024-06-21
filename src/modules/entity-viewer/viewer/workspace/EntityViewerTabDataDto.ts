import { TabRequestComponentDataDto } from '@/model/editor/tab/TabRequestComponentDataDto'

import { QueryLanguage } from '@/model/QueryLanguage'

/**
 * Serializable DTO for storing {@link EntityViewerData} in a storage or link.
 */
interface EntityViewerTabDataDto extends TabRequestComponentDataDto {
    readonly queryLanguage?: QueryLanguage
    readonly filterBy?: string
    readonly orderBy?: string
    readonly dataLocale?: string
    readonly displayedProperties?: string[]
    readonly pageSize?: number
    readonly pageNumber?: number
}
