import { buildClientSchema, getIntrospectionQuery, GraphQLSchema } from 'graphql'
import { inject, InjectionKey } from 'vue'
import { GraphQLResponse } from '@/model/graphql'
import { GraphQLClient } from '@/services/graphql-client'
import { EvitaDBConnection, UnexpectedError } from '@/model/lab'
import { LabService } from '@/services/lab.service'
import { GraphQLInstancePointer } from '@/model/editor/tab/graphQLConsole/GraphQLInstancePointer'
import { GraphQLInstanceType } from '@/model/editor/tab/graphQLConsole/GraphQLInstanceType'

export const key: InjectionKey<GraphQLConsoleService> = Symbol()

/**
 * Service for running GraphQL console component.
 */
export class GraphQLConsoleService {
    private readonly graphQLClient: GraphQLClient

    constructor(graphQLClient: GraphQLClient) {
        this.graphQLClient = graphQLClient
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
        let path
        if (instancePointer.instanceType === GraphQLInstanceType.System) {
            path = 'system'
        } else {
            switch (instancePointer.instanceType) {
                case GraphQLInstanceType.Data:
                    path = instancePointer.catalogName
                    break
                case GraphQLInstanceType.Schema:
                    path = `${instancePointer.catalogName}/schema`
                    break
                default: throw new UnexpectedError(instancePointer.connection, `Unsupported GraphQL instance type '${instancePointer.instanceType}'.`)
            }
        }

        return await this.graphQLClient.fetch(instancePointer.connection, path, query, variables)
    }
}

export const useGraphQLConsoleService = (): GraphQLConsoleService => {
    return inject(key) as GraphQLConsoleService
}
