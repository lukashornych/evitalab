import {
    ResultVisualiserService,
    FacetSummaryVisualiserService,
    HierarchyVisualiserService
} from '@/services/editor/result-visualiser/result-visualiser.service'
import {
    Result,
    VisualisedFacetGroupStatistics,
    VisualisedFacetStatistics, VisualisedNamedHierarchy, VisualisedHierarchyTreeNode,
    VisualiserType,
    VisualiserTypeType
} from '@/model/editor/result-visualiser'
import { CatalogSchema, EntitySchema, ReferenceSchema } from '@/model/evitadb'
import { EvitaDBConnection, UnexpectedError } from '@/model/lab'
import {  LabService } from '@/services/lab.service'
import { inject, InjectionKey } from 'vue'

export const key: InjectionKey<GraphqlResultVisualiserService> = Symbol()

/**
 * {@link ResultVisualiserService} for GraphQL query language.
 */
export class GraphqlResultVisualiserService extends ResultVisualiserService {
    private readonly labService: LabService
    private facetSummaryVisualiserService: GraphQLFacetSummaryVisualiserService | undefined = undefined
    private hierarchyVisualiserService: GraphQLHierarchyVisualiserService | undefined = undefined

    constructor(labService: LabService) {
        super()
        this.labService = labService
    }

    supportsMultipleQueries(): boolean {
        return true
    }

    findQueries(result: Result): string[] {
        if (result == undefined) {
            return []
        }
        const dataResult: Result | undefined = result['data']
        if (dataResult == undefined) {
            return []
        }
        // we currently support visualisations only of extra results, so we need only full queries
        return Object.keys(dataResult)
    }

    findQueryResult(result: Result, query: string): Result | undefined {
        const dataResult: Result | undefined = result['data']
        if (dataResult == undefined) {
            return undefined
        }
        return dataResult[query]
    }

    async getEntitySchemaForQuery(query: string, connection: EvitaDBConnection, catalogName: string): Promise<EntitySchema> {
        const entityType: string = (query).replace(/^(get|list|query)/, '')
        const catalogSchema: CatalogSchema = await this.labService.getCatalogSchema(connection, catalogName)
        const entitySchema: EntitySchema | undefined = Object.values(catalogSchema.entitySchemas)
            .find(it => it.nameVariants.pascalCase === entityType)
        if (entitySchema == undefined) {
            throw new UnexpectedError(connection, `Entity schema '${entityType}' not found in catalog '${catalogName}'.`)
        }
        return entitySchema
    }

    findVisualiserTypes(queryResult: Result): VisualiserType[] {
        const visualiserTypes: VisualiserType[] = []

        const extraResults = queryResult['extraResults']
        if (extraResults) {
            if (extraResults['facetSummary']) {
                visualiserTypes.push({
                    title: 'Facet summary',
                    value: VisualiserTypeType.FacetSummary
                })
            }
            if (extraResults['hierarchy']) {
                visualiserTypes.push({
                    title: 'Hierarchy',
                    value: VisualiserTypeType.Hierarchy
                })
            }
        }

        return visualiserTypes
    }

    findResultForVisualiser(queryResult: Result, visualiserType: string): Result | undefined {
        switch (visualiserType) {
            case VisualiserTypeType.FacetSummary:
                return queryResult?.['extraResults']?.['facetSummary']
            case VisualiserTypeType.Hierarchy:
                return queryResult?.['extraResults']?.['hierarchy']
            default:
                return undefined
        }
    }

    getFacetSummaryService(): FacetSummaryVisualiserService {
        if (!this.facetSummaryVisualiserService) {
            this.facetSummaryVisualiserService = new GraphQLFacetSummaryVisualiserService(this)
        }
        return this.facetSummaryVisualiserService
    }

    getHierarchyService(): HierarchyVisualiserService {
        if (!this.hierarchyVisualiserService) {
            this.hierarchyVisualiserService = new GraphQLHierarchyVisualiserService(this)
        }
        return this.hierarchyVisualiserService
    }
}

/**
 * {@link FacetSummaryVisualiserService} for GraphQL query language.
 */
export class GraphQLFacetSummaryVisualiserService implements FacetSummaryVisualiserService {
    private readonly visualiserService: GraphqlResultVisualiserService

    constructor(visualiserService: GraphqlResultVisualiserService) {
        this.visualiserService = visualiserService
    }

    findFacetGroupStatisticsByReferencesResults(facetSummaryResult: Result, entitySchema: EntitySchema): [ReferenceSchema, Result[]][] {
        const referencesWithGroups: [ReferenceSchema, Result[]][] = []
        for (const referenceName of Object.keys(facetSummaryResult)) {
            const referenceSchema: ReferenceSchema | undefined = Object.values(entitySchema.references)
                .find(reference => reference.nameVariants.camelCase === referenceName)
            if (referenceSchema == undefined) {
                throw new UnexpectedError(undefined, `Reference '${referenceName}' not found in entity '${entitySchema.name}'.`)
            }
            referencesWithGroups.push([referenceSchema, facetSummaryResult[referenceName]])
        }
        return referencesWithGroups
    }

    resolveFacetGroupStatistics(groupStatisticsResult: Result, groupRepresentativeAttributes: string[]): VisualisedFacetGroupStatistics {
        const count: number | undefined = groupStatisticsResult['count']

        const groupEntityResult: Result | undefined = groupStatisticsResult['groupEntity']
        if (!groupEntityResult) {
            return { count }
        }

        const primaryKey: number | undefined = groupEntityResult['primaryKey']

        const actualGroupRepresentativeAttributes: (string | undefined)[] = []
        const groupAttributes = groupEntityResult['attributes'] || {}
        for (const groupAttributeName in groupAttributes) {
            if (!groupRepresentativeAttributes.includes(groupAttributeName) && groupAttributeName !== 'title') {
                continue;
            }
            actualGroupRepresentativeAttributes.push(this.visualiserService.toPrintableAttributeValue(groupAttributes[groupAttributeName]))
        }

        let title: string | undefined = undefined
        if (actualGroupRepresentativeAttributes.length > 0) {
            title = actualGroupRepresentativeAttributes.filter(it => it != undefined).join(', ')
        }

        return { primaryKey, title, count }
    }

    findFacetStatisticsResults(groupStatisticsResult: Result): Result[] {
        return groupStatisticsResult['facetStatistics'] || []
    }

    resolveFacetStatistics(queryResult: Result, facetStatisticsResult: Result, facetRepresentativeAttributes: string[]): VisualisedFacetStatistics {
        const facetEntityResult: Result | undefined = facetStatisticsResult['facetEntity']

        const requested: boolean | undefined = facetStatisticsResult['requested']

        const primaryKey: number | undefined = facetEntityResult?.['primaryKey']

        let title : string | undefined = undefined
        if (facetEntityResult) {
            const actualFacetRepresentativeAttributes: (string | undefined)[] = []
            const facetAttributes = facetEntityResult['attributes'] || {}
            for (const facetAttributeName in facetAttributes) {
                if (!facetRepresentativeAttributes.includes(facetAttributeName) && facetAttributeName !== 'title') {
                    continue;
                }
                actualFacetRepresentativeAttributes.push(this.visualiserService.toPrintableAttributeValue(facetAttributes[facetAttributeName]))
            }

            if (actualFacetRepresentativeAttributes.length > 0) {
                title = actualFacetRepresentativeAttributes.filter(it => it != undefined).join(', ')
            }
        }

        const numberOfEntities: number | undefined = queryResult['recordPage']?.['totalRecordCount'] ?? queryResult['recordStrip']?.['totalRecordCount']

        const impactResult: Result | undefined = facetStatisticsResult['impact']
        const impactDifference: string | undefined = (() => {
            const difference: number | undefined = impactResult?.['difference']
            if (difference == undefined) {
                return undefined
            }

            return `${difference > 0 ? '+' : ''}${difference}`
        })()
        const impactMatchCount: number | undefined = impactResult?.['matchCount']
        const count: number | undefined = facetStatisticsResult['count']

        return { requested, primaryKey, title, numberOfEntities, impactDifference, impactMatchCount, count }
    }

}

/**
 * {@link HierarchyVisualiserService} for GraphQL query language.
 */
export class GraphQLHierarchyVisualiserService implements HierarchyVisualiserService {
    private readonly visualiserService: GraphqlResultVisualiserService

    constructor(visualiserService: GraphqlResultVisualiserService) {
        this.visualiserService = visualiserService
    }

    findNamedHierarchiesByReferencesResults(hierarchyResult: Result, entitySchema: EntitySchema): [(ReferenceSchema | undefined), Result][] {
        const referencesWithHierarchies: [ReferenceSchema | undefined, Result][] = []
        for (const referenceName of Object.keys(hierarchyResult)) {
            const namedHierarchiesResult: Result = hierarchyResult[referenceName]
            if (referenceName === 'self') {
                referencesWithHierarchies.push([undefined, namedHierarchiesResult])
            } else {
                const referenceSchema: ReferenceSchema | undefined = Object.values(entitySchema.references)
                    .find(reference => reference.nameVariants.camelCase === referenceName)
                if (referenceSchema == undefined) {
                    throw new UnexpectedError(undefined, `Reference '${referenceName}' not found in entity '${entitySchema.name}'.`)
                }
                referencesWithHierarchies.push([referenceSchema, namedHierarchiesResult])
            }
        }
        return referencesWithHierarchies
    }

    resolveNamedHierarchy(namedHierarchyResult: Result[], entityRepresentativeAttributes: string[]): VisualisedNamedHierarchy {
        const count: number | undefined = namedHierarchyResult.length
        const nodes: VisualisedHierarchyTreeNode[] = this.getHierarchyTrees(namedHierarchyResult, entityRepresentativeAttributes)
        return { count, trees: nodes }
    }

    private getHierarchyTrees(namedHierarchyResult: Result[], entityRepresentativeAttributes: string[]): VisualisedHierarchyTreeNode[] {
        const nodes: VisualisedHierarchyTreeNode[] = []

        let currentLevel: number = -1
        const nodesStack: VisualisedHierarchyTreeNode[] = []
        for (const nodeResult of namedHierarchyResult) {
            const level: number = nodeResult['level'] || 1

            const nodeEntity: Result | undefined = nodeResult['entity']
            const primaryKey: number | undefined = nodeEntity?.['primaryKey']
            // only root nodes should display parents, we know parents in nested nodes from the direct parent in the tree
            const parentPrimaryKey: number | undefined = level === 1 ? nodeEntity?.['parentPrimaryKey'] : undefined
            const title: string | undefined = this.resolveNodeTitle(nodeEntity, entityRepresentativeAttributes)
            const childrenCount: number | undefined = nodeResult['childrenCount']
            const queriedEntityCount: number | undefined = nodeResult['queriedEntityCount']

            if (level <= currentLevel) {
                // flush lower nodes as well as previous neighbour of the current node
                const levelDiff = currentLevel - level + 1
                for (let i = 0; i < levelDiff; i++) {
                    this.flushCurrentNodeToUpper(nodes, nodesStack)
                }
            }

            currentLevel = level
            // prepare current node into the stack
            // todo lho mark requested node, display requested node in header
            nodesStack.push(new VisualisedHierarchyTreeNode(primaryKey, parentPrimaryKey, title, childrenCount, queriedEntityCount, []))
        }

        // flush remaining nodes
        while (nodesStack.length > 0) {
            this.flushCurrentNodeToUpper(nodes, nodesStack)
        }

        return nodes
    }

    private flushCurrentNodeToUpper(nodes: VisualisedHierarchyTreeNode[], stack: VisualisedHierarchyTreeNode[]): void {
        const prevNode: VisualisedHierarchyTreeNode = stack.pop() as VisualisedHierarchyTreeNode;
        if (stack.length === 0) {
            // root node flush to final node collection
            nodes.push(prevNode);
        } else {
            // todo lho this should be needed
            // @ts-ignore
            stack.at(-1).children.push(prevNode);
        }
    }

    private resolveNodeTitle(nodeEntity: Result | undefined, entityRepresentativeAttributes: string[]): string | undefined {
        if (!nodeEntity) {
            return undefined
        }

        const actualEntityRepresentativeAttributes: (string | undefined)[] = []
        const entityAttributes = nodeEntity['attributes'] || {}
        for (const entityAttributeName in entityAttributes) {
            if (!entityRepresentativeAttributes.includes(entityAttributeName) && entityAttributeName !== 'title') {
                continue;
            }
            actualEntityRepresentativeAttributes.push(this.visualiserService.toPrintableAttributeValue(entityAttributes[entityAttributeName]))
        }

        if (actualEntityRepresentativeAttributes.length === 0) {
            return undefined
        }
        return actualEntityRepresentativeAttributes.filter(it => it != undefined).join(', ')
    }
}

export const useGraphqlResultVisualiserService = (): GraphqlResultVisualiserService => {
    return inject(key) as GraphqlResultVisualiserService
}
