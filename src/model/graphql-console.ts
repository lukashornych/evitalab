import { EvitaDBConnection } from '@/model/lab'

export const contentTypeHeader = 'application/json'
export const acceptHeader = 'application/graphql-response+json'

/**
 * Points to concrete evitaDB GraphQL instance
 */
export class GraphQLInstancePointer {
    readonly connection: EvitaDBConnection
    readonly catalogName: string
    readonly instanceType: GraphQLInstanceType

    constructor(connection: EvitaDBConnection, catalogName: string, instanceType: GraphQLInstanceType) {
        this.connection = connection
        this.catalogName = catalogName
        this.instanceType = instanceType
    }

    url(): string {
        // todo lho proper catalog name notation
        return `${this.connection.gqlUrl}/${this.catalogName}${this.instanceTypeSuffix()}`
    }

    private instanceTypeSuffix(): string {
        switch (this.instanceType) {
            case GraphQLInstanceType.DATA:
                return ''
            case GraphQLInstanceType.SCHEMA:
                return '/schema'
        }
    }
}

export enum GraphQLInstanceType{
    DATA = 'data',
    SCHEMA = 'schema'
}
