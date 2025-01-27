import { TrafficRecordType } from '@/modules/connection/model/traffic/TrafficRecordType'

/**
 * Simplified and grouped traffic record types for users to choose from
 */
export enum UserTrafficRecordType {
    SourceQuery = 'sourceQuery',
    Query = 'query',
    Fetch = 'fetch',
    Enrichment = 'enrichment',
    Mutation = 'mutation'
}

const userTrafficRecordTypeToSystemTrafficRecordType: Map<UserTrafficRecordType, TrafficRecordType[]> = new Map([
    [
        UserTrafficRecordType.SourceQuery,
        [TrafficRecordType.SourceQuery, TrafficRecordType.SourceQueryStatistics]
    ],
    [UserTrafficRecordType.Query, [TrafficRecordType.Query]],
    [UserTrafficRecordType.Fetch, [TrafficRecordType.Fetch]],
    [UserTrafficRecordType.Enrichment, [TrafficRecordType.Enrichment]],
    [UserTrafficRecordType.Mutation, [TrafficRecordType.Mutation]]
])

export function convertUserToSystemRecordType(userTrafficRecordType: UserTrafficRecordType): TrafficRecordType[] {
    return userTrafficRecordTypeToSystemTrafficRecordType.get(userTrafficRecordType) || []
}
