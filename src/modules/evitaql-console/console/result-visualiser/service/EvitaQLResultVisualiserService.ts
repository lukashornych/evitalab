import { LabService } from '@/services/lab.service'
import { EvitaDBConnection, UnexpectedError } from '@/model/lab'
import { CatalogSchema, EntitySchema } from '@/model/evitadb'
import {
    EvitaQLFacetSummaryVisualiserService
} from '@/modules/console/result-visualiser/service/EvitaQLFacetSummaryVisualiser.service'
import {
    EvitaQLHierarchyVisualiserService
} from '@/modules/console/result-visualiser/service/EvitaQLHierarchyVisualiserService'
import {
    EvitaQLAttributeHistogramsVisualiserService
} from '@/modules/console/result-visualiser/service/EvitaQLAttributeHistogramsVisualiserService'
import {
    EvitaQLPriceHistogramVisualiserService
} from '@/modules/console/result-visualiser/service/EvitaQLPriceHistogramVisualiserService'
import { inject, InjectionKey } from 'vue'
import { key } from '@/modules/console/result-visualiser/service/evitaql-result-visualiser.service'

export const key: InjectionKey<EvitaQLResultVisualiserService> = Symbol()

/**
 * {@link ResultVisualiserService} for evitaQL query language.
 */
export class EvitaQLResultVisualiserService extends JsonResultVisualiserService {

    private readonly collectionConstraintPattern: RegExp = /collection\(\s*['"]([A-Za-z0-9_.\-~]*)['"]\s*\)/

    private readonly labService: LabService
    private facetSummaryVisualiserService: EvitaQLFacetSummaryVisualiserService | undefined = undefined
    private hierarchyVisualiserService: EvitaQLHierarchyVisualiserService | undefined = undefined
    private attributeHistogramsVisualiserService: EvitaQLAttributeHistogramsVisualiserService | undefined = undefined
    private priceHistogramVisualiserService: EvitaQLPriceHistogramVisualiserService | undefined = undefined

    constructor(labService: LabService) {
        super()
        this.labService = labService
    }

    supportsMultipleQueries(): boolean {
        return false
    }

    findQueries(inputQuery: string, result: Result): string[] {
        const entityType: string | undefined = this.collectionConstraintPattern.exec(inputQuery)?.[1]
        if (entityType == undefined) {
            // generic query, no specific collection for all returned entities (each entity may be from a different collection)
            return [this.genericEntityType]
        } else {
            return [entityType]
        }
    }

    findQueryResult(result: Result, query: string): Result | undefined {
        return result
    }

    async getEntitySchemaForQuery(query: string, connection: EvitaDBConnection, catalogName: string): Promise<EntitySchema | undefined> {
        const entityType: string = query
        if (entityType.toLowerCase() === this.genericEntityType) {
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

        const globalAttributes: Result = entityResult['attributes']?.['global'] || {}
        for (const attributeName in globalAttributes) {
            possibleAttributes.push([globalAttributes[attributeName], representativeAttributes.includes(attributeName)])
        }

        const localizedAttributes: Result = entityResult['attributes']?.['localized'] || {}
        const localizedAttributesLocales: string[] = Object.keys(localizedAttributes)
        if (localizedAttributesLocales.length > 0) {
            // todo lho there can be legitimately more locales, we need to look for the entityLocaleEquals if there are multiple locales
            const locale: string = localizedAttributesLocales[0]
            const attributesInLocale: Result = localizedAttributes[locale]
            for (const attributeName in attributesInLocale) {
                possibleAttributes.push([attributesInLocale[attributeName], representativeAttributes.includes(attributeName)])
            }
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
            this.facetSummaryVisualiserService = new EvitaQLFacetSummaryVisualiserService(this)
        }
        return this.facetSummaryVisualiserService
    }

    getHierarchyService(): HierarchyVisualiserService {
        if (!this.hierarchyVisualiserService) {
            this.hierarchyVisualiserService = new EvitaQLHierarchyVisualiserService(this)
        }
        return this.hierarchyVisualiserService
    }

    getAttributeHistogramsService(): AttributeHistogramsVisualiserService {
        if (!this.attributeHistogramsVisualiserService) {
            this.attributeHistogramsVisualiserService = new EvitaQLAttributeHistogramsVisualiserService(this)
        }
        return this.attributeHistogramsVisualiserService
    }

    getPriceHistogramService(): PriceHistogramVisualiserService {
        if (!this.priceHistogramVisualiserService) {
            this.priceHistogramVisualiserService = new EvitaQLPriceHistogramVisualiserService(this)
        }
        return this.priceHistogramVisualiserService
    }
}

export const useEvitaQLResultVisualiserService = (): EvitaQLResultVisualiserService => {
    return inject(key) as EvitaQLResultVisualiserService
}
