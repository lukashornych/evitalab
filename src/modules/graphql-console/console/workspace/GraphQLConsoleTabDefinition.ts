import LabEditorGraphQLConsole from '@/components/lab/editor/graphql-console/LabEditorGraphQLConsole.vue'
import { DefineComponent, markRaw } from 'vue'
import { LabService } from '@/services/lab.service'
import { TabRequest } from '@/model/editor/tab/TabRequest'
import { GraphQLConsoleParams } from '@/model/editor/tab/graphQLConsole/GraphQLConsoleParams'
import { GraphQLConsoleData } from '@/model/editor/tab/graphQLConsole/GraphQLConsoleData'
import { GraphQLInstanceType } from '@/model/editor/tab/graphQLConsole/GraphQLInstanceType'
import { GraphQLInstancePointer } from '@/model/editor/tab/graphQLConsole/GraphQLInstancePointer'
import { TabRequestComponentParamsDto } from '@/model/editor/tab/TabRequestComponentParamsDto'
import { TabRequestComponentDataDto } from '@/model/editor/tab/TabRequestComponentDataDto'
import { EvitaDBConnection } from '@/model/EvitaDBConnection'
import { TabDefinition } from '@/modules/workspace/tab/model/TabDefinition'

/**
 * Creates new GraphQL tab.
 */
export class GraphQLConsoleTabDefinition extends TabDefinition<GraphQLConsoleParams, GraphQLConsoleData> {

    private constructor(title: string, params: GraphQLConsoleParams, initialData: GraphQLConsoleData) {
        super(
            undefined,
            title,
            'mdi-graphql',
            markRaw(LabEditorGraphQLConsole as DefineComponent<any, any, any>),
            params,
            initialData
        )
    }

    static createNew(connection: EvitaDBConnection,
                     catalogName: string,
                     instanceType: GraphQLInstanceType,
                     initialData: GraphQLConsoleData | undefined = undefined,
                     executeOnOpen: boolean = false): GraphQLConsoleTabDefinition {
        return new GraphQLConsoleTabDefinition(
            this.constructTitle(connection, catalogName, instanceType),
            new GraphQLConsoleParams(
                new GraphQLInstancePointer(connection, catalogName, instanceType),
                executeOnOpen
            ),
            initialData ? initialData : new GraphQLConsoleData()
        )
    }

    static restoreFromJson(labService: LabService, paramsJson: TabRequestComponentParamsDto, dataJson?: TabRequestComponentDataDto): GraphQLConsoleTabDefinition {
        const params: GraphQLConsoleParams = GraphQLConsoleParams.restoreFromSerializable(labService, paramsJson)
        const data: GraphQLConsoleData = dataJson == undefined ? new GraphQLConsoleData() : GraphQLConsoleData.restoreFromSerializable(dataJson)

        return new GraphQLConsoleTabDefinition(
            this.constructTitle(params.instancePointer.connection, params.instancePointer.catalogName, params.instancePointer.instanceType),
            params,
            data
        )
    }

    private static constructTitle(connection: EvitaDBConnection, catalogName: string, instanceType: GraphQLInstanceType): string {
        return (instanceType === GraphQLInstanceType.System ? instanceType : `${catalogName} - ${instanceType}`) +  ` [${connection.name}]`
    }
}

