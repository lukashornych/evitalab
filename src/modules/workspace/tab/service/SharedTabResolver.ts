import { inject, InjectionKey } from 'vue'
import { ShareTabObject } from '@/modules/workspace/tab/model/ShareTabObject'
import { TabDefinition } from '@/modules/workspace/tab/model/TabDefinition'
import { TabType } from '@/modules/workspace/tab/model/TabType'
import { EntityViewerTabDefinition } from '@/modules/entity-viewer/viewer/workspace/EntityViewerTabDefinition'
import { EvitaQLConsoleTabDefinition } from '@/modules/evitaql-console/console/workspace/EvitaQLConsoleTabDefinition'
import { GraphQLConsoleTabDefinition } from '@/modules/graphql-console/console/workspace/GraphQLConsoleTabDefinition'
import { SchemaViewerTabDefinition } from '@/modules/schema-viewer/viewer/workspace/SchemaViewerTabDefinition'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'

export const key: InjectionKey<SharedTabResolver> = Symbol()

/**
 * Resolves shared tab requests from URL into {@link TabRequest}s.
 */
export class SharedTabResolver {
    private readonly labService: LabService

    constructor(labService: LabService) {
        this.labService = labService
    }

    async resolve(shareTabObjectSerialized: string | undefined): Promise<TabDefinition<any, any> | undefined> {
        if (shareTabObjectSerialized == undefined) {
            return undefined
        }
        const shareTabObject: ShareTabObject = ShareTabObject.fromLinkParam(shareTabObjectSerialized)

        switch (shareTabObject.tabType as string) {
            case 'data-grid':
            case 'dataGrid':
            case TabType.EntityViewer:
                return EntityViewerTabDefinition.restoreFromJson(this.labService, shareTabObject.tabParams, shareTabObject.tabData)
            case 'evitaql-console':
            case TabType.EvitaQLConsole:
                return EvitaQLConsoleTabDefinition.restoreFromJson(this.labService, shareTabObject.tabParams, shareTabObject.tabData)
            case 'graphql-console':
            case TabType.GraphQLConsole:
                return GraphQLConsoleTabDefinition.restoreFromJson(this.labService, shareTabObject.tabParams, shareTabObject.tabData)
            case 'schema-viewer':
            case TabType.SchemaViewer:
                return SchemaViewerTabDefinition.restoreFromJson(this.labService, shareTabObject.tabParams)
            default:
                throw new UnexpectedError(undefined, `Unsupported shared tab type '${shareTabObject.tabType}'.`)
        }
    }
}

export const useSharedTabResolver = (): SharedTabResolver => {
    return inject(key) as SharedTabResolver
}
