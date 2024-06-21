import { TabRequestComponentData } from '@/model/editor/tab/TabRequestComponentData'
import { TabRequestComponentDataDto } from '@/model/editor/tab/TabRequestComponentDataDto'
import { GraphQLConsoleDataDto } from '@/model/editor/tab/graphQLConsole/GraphQLConsoleDataDto'

/**
 * Represents injectable/storable user data of the LabEditorConsoleGraphQL component.
 */
export class GraphQLConsoleTabData implements TabRequestComponentData<GraphQLConsoleDataDto> {
    readonly query?: string
    readonly variables?: string

    constructor(query?: string, variables?: string) {
        this.query = query
        this.variables = variables
    }

    static restoreFromSerializable(json: TabRequestComponentDataDto): GraphQLConsoleTabData {
        const dto: GraphQLConsoleDataDto = json as GraphQLConsoleDataDto
        return new GraphQLConsoleTabData(dto.query, dto.variables)
    }

    toSerializable(): GraphQLConsoleDataDto {
        return {
            query: this.query,
            variables: this.variables
        }
    }
}
