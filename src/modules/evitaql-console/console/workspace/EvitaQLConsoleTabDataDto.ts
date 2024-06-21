import { TabRequestComponentDataDto } from '@/model/editor/tab/TabRequestComponentDataDto'

/**
 * Serializable DTO for storing {@link EvitaQLConsoleTabDataDto} in a storage or link.
 */
export interface EvitaQLConsoleTabDataDto extends TabRequestComponentDataDto {
    readonly query?: string
    readonly variables?: string
}
