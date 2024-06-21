import { TabRequestComponentParamsDto } from '@/model/editor/tab/TabRequestComponentParamsDto'

import { EvitaDBConnectionId } from '@/model/EvitaDBConnectionId'

/**
 * Serializable DTO for storing {@link EntityViewerParams} in a storage or link.
 */
interface EntityViewerTabParamsDto extends TabRequestComponentParamsDto {
    readonly connectionId: EvitaDBConnectionId
    readonly catalogName: string
    readonly entityType: string
}
