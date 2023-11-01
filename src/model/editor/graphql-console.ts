import { EvitaDBConnection } from '@/model/lab'
import { ExecutableTabRequest, TabRequestComponentData, TabRequestComponentParams } from '@/model/editor/editor'

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
}

export enum GraphQLInstanceType {
    SYSTEM = 'system',
    DATA = 'data',
    SCHEMA = 'schema'
}

/**
 * Represents props of the LabEditorConsoleGraphQL component.
 */
export interface GraphQLConsoleParams extends TabRequestComponentParams, ExecutableTabRequest {
    readonly instancePointer: GraphQLInstancePointer
}

/**
 * Represents injectable/storable user data of the LabEditorConsoleGraphQL component.
 */
export interface GraphQLConsoleData extends TabRequestComponentData {
    readonly query?: string
    readonly variables?: string
}

/**
 * Single hierarchical node of evitaDB hierarchy.
 */
export class HierarchyTreeNode {
    readonly primaryKey?: number
    readonly parentPrimaryKey?: number
    readonly title?: string
    readonly childrenCount?: number
    readonly queriedEntityCount?: number
    readonly children: HierarchyTreeNode[]

    constructor(primaryKey: number | undefined,
                parentPrimaryKey: number | undefined,
                title: string | undefined,
                childrenCount: number | undefined,
                queriedEntityCount: number | undefined,
                children: HierarchyTreeNode[]) {
        this.primaryKey = primaryKey
        this.parentPrimaryKey = parentPrimaryKey
        this.title = title
        this.childrenCount = childrenCount
        this.queriedEntityCount = queriedEntityCount
        this.children = children
    }

    isLeaf(): boolean {
        return this.children.length === 0
    }
}
