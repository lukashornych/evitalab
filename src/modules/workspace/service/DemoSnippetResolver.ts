import ky from 'ky'
import { inject, InjectionKey } from 'vue'
import { TabDefinition } from '@/modules/workspace/tab/model/TabDefinition'
import { EvitaDBConnectionId } from '@/modules/connection/model/EvitaDBConnectionId'
import { DemoSnippetRequest } from '@/modules/workspace/tab/model/DemoSnippetRequest'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { EvitaDBConnection } from '@/modules/connection/model/EvitaDBConnection'
import { EvitaQLConsoleTabDefinition } from '@/modules/evitaql-console/console/workspace/EvitaQLConsoleTabDefinition'
import { EvitaQLConsoleTabData } from '@/modules/evitaql-console/console/workspace/EvitaQLConsoleTabData'
import { GraphQLConsoleTabDefinition } from '@/modules/graphql-console/console/workspace/GraphQLConsoleTabDefinition'
import { GraphQLInstanceType } from '@/modules/graphql-console/console/model/GraphQLInstanceType'
import { GraphQLConsoleTabData } from '@/modules/graphql-console/console/workspace/GraphQLConsoleTabData'

const demoConnectionId: EvitaDBConnectionId = 'demo'
const demoCatalog: string = 'evita'
const baseCodeSnippetUrl: string = 'https://raw.githubusercontent.com/FgForrest/evitaDB'

export const key: InjectionKey<DemoSnippetResolver> = Symbol()

/**
 * Resolves demo code snippet requests from URL into {@link TabRequest}s.
 */
export class DemoSnippetResolver {
    private readonly labService: LabService

    constructor(labService: LabService) {
        this.labService = labService
    }

    /**
     * Resolves input request into tab request.
     */
    async resolve(requestSerialized: string | undefined): Promise<TabDefinition<any, any> | undefined> {
        if (requestSerialized == undefined) {
            return undefined
        }
        const request: DemoSnippetRequest = JSON.parse(atob(requestSerialized)) as DemoSnippetRequest

        const codeSnippetUrl: string = `${baseCodeSnippetUrl}/${request.branch}/${request.path}`
        let codeSnippetContent: string
        try {
            codeSnippetContent = await ky.get(codeSnippetUrl).text()
        } catch (e) {
            throw new UnexpectedError(undefined, `Cannot fetch demo code snippet '${request.path}' from GitHub from branch '${request.branch}'.`)
        }

        const demoConnection: EvitaDBConnection = this.labService.getConnection(demoConnectionId)

        const extension: string = request.path.substring(request.path.lastIndexOf(".") + 1)
        switch (extension) {
            case CodeSnippetType.EvitaQL:
                return EvitaQLConsoleTabDefinition.createNew(
                    demoConnection,
                    demoCatalog,
                    new EvitaQLConsoleTabData(codeSnippetContent),
                    true
                )
            case CodeSnippetType.GraphQL:
                return GraphQLConsoleTabDefinition.createNew(
                    demoConnection,
                    demoCatalog,
                    GraphQLInstanceType.Data,
                    new GraphQLConsoleTabData(codeSnippetContent),
                    true
                )
            default:
                throw new UnexpectedError(undefined, `Unsupported demo code snippet type: ${extension}`)
        }
    }
}

export const useDemoSnippetResolver = (): DemoSnippetResolver => {
    return inject(key) as DemoSnippetResolver
}

/**
 * Supported demo code snippet types.
 */
enum CodeSnippetType {
    EvitaQL = "evitaql",
    GraphQL = "graphql",
}
