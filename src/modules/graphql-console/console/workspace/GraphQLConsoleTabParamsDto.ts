import { TabRequestComponentParamsDto } from '@/model/editor/tab/TabRequestComponentParamsDto'
import { GraphQLInstanceType } from '@/model/editor/tab/graphQLConsole/GraphQLInstanceType'
import { EvitaDBConnectionId } from '@/model/EvitaDBConnectionId'

/**
 * Serializable DTO for storing {@link GraphQLConsoleParams} in a storage or link.
 */
export interface GraphQLConsoleTabParamsDto extends TabRequestComponentParamsDto {
    readonly connectionId: EvitaDBConnectionId
    readonly catalogName: string
    readonly instanceType: GraphQLInstanceType
}
