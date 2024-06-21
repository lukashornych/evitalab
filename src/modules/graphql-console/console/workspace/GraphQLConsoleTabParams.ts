import { LabService } from '@/services/lab.service'
import { ExecutableTabRequest } from '@/model/editor/tab/ExecutableTabRequest'
import { TabRequestComponentParams } from '@/model/editor/tab/TabRequestComponentParams'
import { TabRequestComponentParamsDto } from '@/model/editor/tab/TabRequestComponentParamsDto'
import { GraphQLConsoleParamsDto } from '@/model/editor/tab/graphQLConsole/GraphQLConsoleParamsDto'
import { GraphQLInstancePointer } from '@/model/editor/tab/graphQLConsole/GraphQLInstancePointer'
import { GraphQLConsoleManager } from '@/modules/graphql-console/console/service/GraphQLConsoleManager'

/**
 * Represents props of the LabEditorConsoleGraphQL component.
 */
export class GraphQLConsoleTabParams implements TabRequestComponentParams<GraphQLConsoleParamsDto>, ExecutableTabRequest {
    readonly manager: GraphQLConsoleManager
    readonly executeOnOpen: boolean

    constructor(manager: GraphQLConsoleManager, executeOnOpen: boolean = false) {
        this.manager = manager
        this.executeOnOpen = executeOnOpen
    }

    static restoreFromSerializable(labService: LabService, json: TabRequestComponentParamsDto): GraphQLConsoleTabParams {
        const dto: GraphQLConsoleParamsDto = json as GraphQLConsoleParamsDto
        return new GraphQLConsoleTabParams(
            new GraphQLConsoleManager(
                graphQLClient,
                new GraphQLInstancePointer(
                    labService.getConnection(dto.connectionId),
                    dto.catalogName,
                    dto.instanceType
                )
            ),
            // We don't want to execute query on open if it's restored from a storage or link.
            // If from storage, there may a lots of tabs to restore, and we don't want to execute them all for performance reasons.
            // If from link, the query may be dangerous or something.
            false
        )
    }

    toSerializable(): GraphQLConsoleParamsDto {
        return {
            connectionId: this.manager.getInstancePointer().connection.id,
            catalogName: this.manager.getInstancePointer().catalogName,
            instanceType: this.manager.getInstancePointer().instanceType
        }
    }
}
