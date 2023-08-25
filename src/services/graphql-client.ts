import ky from 'ky'
import { GraphQLResponse } from '@/model/graphql'
import { EvitaDBConnection } from '@/model/lab'

/**
 * Simplified GraphQL API client that doesn't need to know about specific GraphQL schemas.
 *
 * @param url url of GraphQL API instance
 * @param query GraphQL query
 * @param variables GraphQL query variables
 */
// todo lho reimplement it into a injectable class
export async function fetchGraphQL(connection: EvitaDBConnection, path: string, query: string, variables: any = {}): Promise<GraphQLResponse> {
    return (
        await ky.post(
            `${connection.gqlUrl}/${path}`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query,
                    variables
                })
            }
        )
            .json()
    ) as GraphQLResponse
}
