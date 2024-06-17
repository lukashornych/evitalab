import { TabRequestComponentParamsDto } from '@/model/editor/tab/TabRequestComponentParamsDto'
import { EvitaDBConnectionId } from '@/model/lab'

/**
 * Serializable DTO for storing {@link EntityViewerParams} in a storage or link.
 */
interface EntityViewerParamsDto extends TabRequestComponentParamsDto {
    readonly connectionId: EvitaDBConnectionId
    readonly catalogName: string
    readonly entityType: string
}
