import { EvitaDBConnection } from '@/model/lab'
import { TabRequestComponentProps } from '@/model/editor/editor'

/**
 * Points to concrete evitaDB GraphQL instance
 */
export class GraphQLInstancePointer  {
    readonly connection: EvitaDBConnection
    readonly catalogName: string
    readonly instanceType: GraphQLInstanceType

    constructor(connection: EvitaDBConnection, catalogName: string, instanceType: GraphQLInstanceType) {
        this.connection = connection
        this.catalogName = catalogName
        this.instanceType = instanceType
    }

    instanceTypeSuffix(): string {
        switch (this.instanceType) {
            case GraphQLInstanceType.DATA:
                return ''
            case GraphQLInstanceType.SCHEMA:
                return '/schema'
        }
    }
}

export enum GraphQLInstanceType {
    DATA = 'data',
    SCHEMA = 'schema'
}

/**
 * Represents props of the LabEditorConsoleGraphQL component.
 */
export interface GraphQLConsoleProps extends TabRequestComponentProps {
    readonly instancePointer: GraphQLInstancePointer
}
