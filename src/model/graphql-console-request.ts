import { TabRequest } from '@/model/editor'
import { EvitaDBConnection } from '@/model/lab'
import LabEditorConsoleGraphQL from '@/components/LabEditorConsoleGraphQL.vue'
import { GraphQLInstancePointer, GraphQLInstanceType } from '@/model/graphql-console'
import { markRaw } from 'vue'

export class GraphqlConsoleRequest extends TabRequest {
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
