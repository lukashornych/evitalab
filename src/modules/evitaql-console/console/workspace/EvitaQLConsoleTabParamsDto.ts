import { TabRequestComponentParamsDto } from '@/model/editor/tab/TabRequestComponentParamsDto'
import { EvitaDBConnectionId } from '@/model/EvitaDBConnectionId'

/**
 * Serializable DTO for storing {@link EvitaQLConsoleParams} in a storage or link.
 */
export interface EvitaQLConsoleTabParamsDto extends TabRequestComponentParamsDto {
    readonly connectionId: EvitaDBConnectionId
    readonly catalogName: string
}
