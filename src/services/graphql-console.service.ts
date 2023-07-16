import ky from 'ky'
import { buildClientSchema, getIntrospectionQuery, GraphQLSchema } from 'graphql'
import { acceptHeader, contentTypeHeader, GraphQLInstancePointer } from '@/model/graphql-console'
import { KyInstance } from 'ky/distribution/types/ky'
import { inject, InjectionKey } from 'vue'

export const key: InjectionKey<GraphQLConsoleService> = Symbol()

/**
 * Service for running GraphQL console component.
 */
export class GraphQLConsoleService {
    readonly graphQLClient: KyInstance

    constructor() {
        this.graphQLClient = ky.create({
            headers: {
                "Content-Type": contentTypeHeader,
                "Accept": acceptHeader
            }
        })
    }

    /**
     * Fetches and parses a GraphQL schema from a given evitaDB server and catalog.
     */
    getGraphQLSchema = async (instancePointer: GraphQLInstancePointer): Promise<GraphQLSchema> => {
        const introspectionSchema: any = await this.callGraphQLApi(
            instancePointer,
            getIntrospectionQuery()
        )

        return buildClientSchema(introspectionSchema.data)
    }

    /**
     * Executes user GraphQL query against a given evitaDB server and catalog.
     */
    executeGraphQLQuery = async (instancePointer: GraphQLInstancePointer, query: string, variables?: object): Promise<string> => {
        const result: object = await this.callGraphQLApi(
            instancePointer,
            query,
            variables
        )
        return JSON.stringify(result, null, 2)
    }

    /**
     * Executes query against evitaDB GraphQL API.
     */
    private callGraphQLApi<T>(instancePointer: GraphQLInstancePointer, query: string, variables: object = {}): Promise<T> {
        return this.graphQLClient.post(
            instancePointer.url(),
            {
                body: JSON.stringify({
                    query,
                    variables
                })
            }
        )
            .json()
    }
}

export const useGraphQLConsoleService = (): GraphQLConsoleService => {
    return inject(key) as GraphQLConsoleService
}
