import { buildClientSchema, getIntrospectionQuery, GraphQLSchema } from 'graphql'
import { GraphQLInstancePointer } from '@/model/editor/graphql-console'
import { inject, InjectionKey } from 'vue'
import { fetchGraphQL } from '@/services/graphql-client'
import { GraphQLResponse } from '@/model/graphql'
import { LabService } from '@/services/lab.service'

export const key: InjectionKey<GraphQLConsoleService> = Symbol()

/**
 * Service for running GraphQL console component.
 */
export class GraphQLConsoleService {
    readonly labService: LabService

    constructor(labService: LabService) {
        this.labService = labService
    }

    /**
     * Fetches and parses a GraphQL schema from a given evitaDB server and catalog.
     */
    getGraphQLSchema = async (instancePointer: GraphQLInstancePointer): Promise<GraphQLSchema> => {
        const introspectionSchema: GraphQLResponse = await this.callGraphQLApi(
            instancePointer,
            getIntrospectionQuery()
        )

        return buildClientSchema(introspectionSchema.data)
    }

    /**
     * Executes user GraphQL query against a given evitaDB server and catalog.
     */
    executeGraphQLQuery = async (instancePointer: GraphQLInstancePointer, query: string, variables?: object): Promise<string> => {
        const result: GraphQLResponse = await this.callGraphQLApi(
            instancePointer,
            query,
            variables
        )
        return JSON.stringify(result, null, 2)
    }

    /**
     * Executes query against evitaDB GraphQL API.
     */
    private async callGraphQLApi(instancePointer: GraphQLInstancePointer, query: string, variables: object = {}): Promise<GraphQLResponse> {
        const urlCatalogName: string = (await this.labService.getCatalogSchema(instancePointer.connection, instancePointer.catalogName))
            .nameVariants
            .kebabCase
        const url = `${instancePointer.connection.gqlUrl}/${urlCatalogName}${instancePointer.instanceTypeSuffix()}`

        return await fetchGraphQL(url, query, variables)
    }
}

export const useGraphQLConsoleService = (): GraphQLConsoleService => {
    return inject(key) as GraphQLConsoleService
}
