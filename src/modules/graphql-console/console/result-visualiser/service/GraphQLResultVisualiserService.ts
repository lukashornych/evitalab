import { LabService } from '@/services/lab.service'
import { CatalogSchema, EntitySchema } from '@/model/evitadb'
import {
    GraphQLFacetSummaryVisualiserService
} from '@/modules/graphql-console/console/result-visualiser/service/GraphQLFacetSummaryVisualiserService'
import {
    GraphQLHierarchyVisualiserService
} from '@/modules/graphql-console/console/result-visualiser/service/GraphQLHierarchyVisualiserService'
import {
    GraphQLAttributeHistogramsVisualiserService
} from '@/modules/graphql-console/console/result-visualiser/service/GraphQLAttributeHistogramsVisualiserService'
import {
    GraphQLPriceHistogramVisualiserService
} from '@/modules/graphql-console/console/result-visualiser/service/GraphQLPriceHistogramVisualiserService'
import { inject, InjectionKey } from 'vue'
import { EvitaDBConnection } from '@/model/EvitaDBConnection'
import { UnexpectedError } from '@/model/UnexpectedError'

export const key: InjectionKey<GraphQLResultVisualiserService> = Symbol()

/**
 * {@link ResultVisualiserService} for GraphQL query language.
 */
export class GraphQLResultVisualiserService extends JsonResultVisualiserService {
    private readonly labService: LabService
    private facetSummaryVisualiserService: GraphQLFacetSummaryVisualiserService | undefined = undefined
    private hierarchyVisualiserService: GraphQLHierarchyVisualiserService | undefined = undefined
    private attributeHistogramsVisualiserService: GraphQLAttributeHistogramsVisualiserService | undefined = undefined
    private priceHistogramVisualiserService: GraphQLPriceHistogramVisualiserService | undefined = undefined

    constructor(labService: LabService) {
        super()
        this.labService = labService
    }

    supportsMultipleQueries(): boolean {
        return true
    }

    findQueries(inputQuery: string, result: Result): string[] {
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

    async getEntitySchemaForQuery(query: string, connection: EvitaDBConnection, catalogName: string): Promise<EntitySchema | undefined> {
        const entityType: string = (query).replace(/^(get|list|query)/, '')
        if (entityType.toLowerCase() === this.genericEntityType) {
            // generic query, no specific collection for all returned entities (each entity may be from a different collection)
            return undefined
        }
        const catalogSchema: CatalogSchema = await this.labService.getCatalogSchema(connection, catalogName)
        const entitySchema: EntitySchema | undefined = Object.values(catalogSchema.entitySchemas)
            .find(it => it.nameVariants.pascalCase === entityType)
        if (entitySchema == undefined) {
            throw new UnexpectedError(connection, `Entity schema '${entityType}' not found in catalog '${catalogName}'.`)
        }
        return entitySchema
    }

    resolveRepresentativeTitleForEntityResult(entityResult: Result | undefined, representativeAttributes: string[]): string | undefined {
        if (!entityResult) {
            return undefined
        }

        const possibleAttributes: [any, boolean][] = []
        const attributes = entityResult['attributes'] || {}
        for (const attributeName in attributes) {
            possibleAttributes.push([attributes[attributeName], representativeAttributes.includes(attributeName)])
        }

        if (possibleAttributes.length === 0) {
            return undefined
        } else if (possibleAttributes.length <= 3) {
            return possibleAttributes.map(it => this.toPrintableAttributeValue(it[0])).join(', ')
        } else {
            // if there are too many attributes, we only print the representative ones
            return possibleAttributes
                .filter(it => it[1])
                .map(it => this.toPrintableAttributeValue(it[0]))
                .join(', ')
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

    getAttributeHistogramsService(): AttributeHistogramsVisualiserService {
        if (!this.attributeHistogramsVisualiserService) {
            this.attributeHistogramsVisualiserService = new GraphQLAttributeHistogramsVisualiserService(this)
        }
        return this.attributeHistogramsVisualiserService
    }

    getPriceHistogramService(): PriceHistogramVisualiserService {
        if (!this.priceHistogramVisualiserService) {
            this.priceHistogramVisualiserService = new GraphQLPriceHistogramVisualiserService(this)
        }
        return this.priceHistogramVisualiserService
    }
}

export const useGraphQLResultVisualiserService = (): GraphQLResultVisualiserService => {
    return inject(key) as GraphQLResultVisualiserService
}
