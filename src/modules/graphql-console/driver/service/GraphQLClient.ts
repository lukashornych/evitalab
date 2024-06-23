import { HttpApiClient } from '@/modules/driver-support/service/HttpApiClient'

/**
 * Simplified GraphQL API client that doesn't need to know about specific GraphQL schemas.
 */
export class GraphQLClient extends HttpApiClient {

    /**
     * Fetches data from evitaDB GraphQL API.
     */
    async fetch(connection: Connection, path: string, query: string, variables: any = {}): Promise<GraphQLResponse> {
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
