import ky from 'ky'
import { GraphQLResponse } from '@/model/graphql'

/**
 * Simplified GraphQL API client that doesn't need to know about specific GraphQL schemas.
 *
 * @param url url of GraphQL API instance
 * @param query GraphQL query
 * @param variables GraphQL query variables
 */
export async function fetchGraphQL(url: string, query: string, variables: any = {}): Promise<GraphQLResponse> {
    return (
        await ky.post(
            url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
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
