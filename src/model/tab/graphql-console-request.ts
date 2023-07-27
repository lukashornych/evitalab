import { TabRequest } from '@/model/editor'
import { EvitaDBConnection } from '@/model/lab'
import LabEditorConsoleGraphQL from '@/components/LabEditorConsoleGraphQL.vue'
import { GraphQLConsoleProps, GraphQLInstancePointer, GraphQLInstanceType } from '@/model/tab/graphql-console'
import { markRaw } from 'vue'

/**
 * Creates new GraphQL tab.
 */
export class GraphQLConsoleRequest extends TabRequest<GraphQLConsoleProps> {
    constructor(connection: EvitaDBConnection, catalogName: string, instanceType: GraphQLInstanceType) {
        super(
            `${catalogName} - ${instanceType} [${connection.name}]`,
            'mdi-graphql',
            markRaw(LabEditorConsoleGraphQL),
            {
                instancePointer: new GraphQLInstancePointer(connection, catalogName, instanceType)
            }
        )
    }
}

