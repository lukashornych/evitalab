import { GraphQLResponse } from '@/model/graphql'
import { ApiClient } from '@/services/api-client'
import { EvitaDBConnection } from '@/model/EvitaDBConnection'

/**
 * Simplified GraphQL API client that doesn't need to know about specific GraphQL schemas.
 */
export class GraphQLClient extends ApiClient {

    /**
     * Fetches data from evitaDB GraphQL API.
     */
    async fetch(connection: EvitaDBConnection, path: string, query: string, variables: any = {}): Promise<GraphQLResponse> {
        try {
            return (
                await this.httpClient.post(
                    `${connection.gqlUrl}/${path}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-EvitaDB-ClientID': this.getClientIdHeaderValue()
                        },
                        body: JSON.stringify({
                            query,
                            variables
                        })
                    }
                )
                    .json()
            ) as GraphQLResponse
        } catch (e: any) {
            throw this.handleCallError(e, connection)
        }
    }
}
