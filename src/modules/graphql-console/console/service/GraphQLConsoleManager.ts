import { buildClientSchema, getIntrospectionQuery, GraphQLSchema } from 'graphql'
import { inject, InjectionKey } from 'vue'
import { GraphQLResponse } from '@/model/graphql'
import { GraphQLClient } from '@/services/graphql-client'
import { LabService } from '@/services/lab.service'
import { GraphQLInstancePointer } from '@/model/editor/tab/graphQLConsole/GraphQLInstancePointer'
import { GraphQLInstanceType } from '@/model/editor/tab/graphQLConsole/GraphQLInstanceType'
import { EvitaDBConnection } from '@/model/EvitaDBConnection'
import { UnexpectedError } from '@/model/UnexpectedError'

/**
 * Service for running GraphQL console component.
 */
export class GraphQLConsoleManager {
    private readonly graphQLClient: GraphQLClient
    private readonly instancePointer: GraphQLInstancePointer

    constructor(graphQLClient: GraphQLClient, instancePointer: GraphQLInstancePointer) {
        this.graphQLClient = graphQLClient
        this.instancePointer = instancePointer
    }

    getInstancePointer(): GraphQLInstancePointer {
        return this.instancePointer
    }

    /**
     * Fetches and parses a GraphQL schema from a given evitaDB server and catalog.
     */
    async getGraphQLSchema(): Promise<GraphQLSchema> {
        const introspectionSchema: GraphQLResponse = await this.callGraphQLApi(
            this.instancePointer,
            getIntrospectionQuery()
        )

        return buildClientSchema(introspectionSchema.data)
    }

    /**
     * Executes user GraphQL query against a given evitaDB server and catalog.
     */
    async executeGraphQLQuery(query: string, variables?: object): Promise<string> {
        const result: GraphQLResponse = await this.callGraphQLApi(
            this.instancePointer,
            query,
            variables
        )
        return JSON.stringify(result, null, 2)
    }

    /**
     * Executes query against evitaDB GraphQL API.
     */
    private async callGraphQLApi(query: string, variables: object = {}): Promise<GraphQLResponse> {
        let path
        if (this.instancePointer.instanceType === GraphQLInstanceType.System) {
            path = 'system'
        } else {
            switch (this.instancePointer.instanceType) {
                case GraphQLInstanceType.Data:
                    path = this.instancePointer.catalogName
                    break
                case GraphQLInstanceType.Schema:
                    path = `${this.instancePointer.catalogName}/schema`
                    break
                default: throw new UnexpectedError(this.instancePointer.connection, `Unsupported GraphQL instance type '${this.instancePointer.instanceType}'.`)
            }
        }

        return await this.graphQLClient.fetch(this.instancePointer.connection, path, query, variables)
    }
}
