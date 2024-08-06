import { InjectionKey } from 'vue'
import {
    JsonResultVisualiserService
} from '@/modules/console/result-visualiser/service/json/JsonResultVisualiserService'
import { ConnectionService } from '@/modules/connection/service/ConnectionService'
import {
    EvitaQLFacetSummaryVisualiserService
} from './EvitaQLFacetSummaryVisualiserService'
import {
    EvitaQLHierarchyVisualiserService
} from '@/modules/evitaql-console/console/result-visualiser/service/EvitaQLHierarchyVisualiserService'
import {
    EvitaQLAttributeHistogramsVisualiserService
} from '@/modules/evitaql-console/console/result-visualiser/service/EvitaQLAttributeHistogramsVisualiserService'
import {
    EvitaQLPriceHistogramVisualiserService
} from '@/modules/evitaql-console/console/result-visualiser/service/EvitaQLPriceHistogramVisualiserService'
import { Result } from '@/modules/console/result-visualiser/model/Result'
import { Connection } from '@/modules/connection/model/Connection'
import { EntitySchema } from '@/modules/connection/model/schema/EntitySchema'
import { CatalogSchema } from '@/modules/connection/model/schema/CatalogSchema'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import {
    FacetSummaryVisualiserService
} from '@/modules/console/result-visualiser/service/FacetSummaryVisualiserService'
import { HierarchyVisualiserService } from '@/modules/console/result-visualiser/service/HierarchyVisualiserService'
import {
    AttributeHistogramsVisualiserService
} from '@/modules/console/result-visualiser/service/AttributeHistogramsVisualiserService'
import {
    PriceHistogramVisualiserService
} from '@/modules/console/result-visualiser/service/PriceHistogramVisualiserService'
import { mandatoryInject } from '@/utils/reactivity'
import { NamingConvention } from '@/modules/connection/model/NamingConvetion'


export const evitaQLResultVisualiserServiceInjectionKey: InjectionKey<EvitaQLResultVisualiserService> = Symbol('evitaQLResultViewerService')

/**
 * {@link ResultVisualiserService} for evitaQL query language.
 */
export class EvitaQLResultVisualiserService extends JsonResultVisualiserService {

    private readonly collectionConstraintPattern: RegExp = /collection\(\s*['"]([A-Za-z0-9_.\-~]*)['"]\s*\)/

    private readonly connectionService: ConnectionService
    private facetSummaryVisualiserService: EvitaQLFacetSummaryVisualiserService | undefined = undefined
    private hierarchyVisualiserService: EvitaQLHierarchyVisualiserService | undefined = undefined
    private attributeHistogramsVisualiserService: EvitaQLAttributeHistogramsVisualiserService | undefined = undefined
    private priceHistogramVisualiserService: EvitaQLPriceHistogramVisualiserService | undefined = undefined

    constructor(connectionService: ConnectionService) {
        super()
        this.connectionService = connectionService
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

    async getEntitySchemaForQuery(query: string, connection: Connection, catalogName: string): Promise<EntitySchema | undefined> {
        const entityType: string = query
        if (entityType.toLowerCase() === this.genericEntityType) {
            return undefined
        }
        const catalogSchema: CatalogSchema = await this.connectionService.getCatalogSchema(connection, catalogName)
        const entitySchema: EntitySchema | undefined = catalogSchema.entitySchemas
            .getIfSupported()
            ?.find(it => it.nameVariants
                .getIfSupported()
                ?.get(NamingConvention.PascalCase) === entityType)
        if (entitySchema == undefined) {
            throw new UnexpectedError(`Entity schema '${entityType}' not found in catalog '${catalogName}'.`)
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
    return mandatoryInject(evitaQLResultVisualiserServiceInjectionKey) as EvitaQLResultVisualiserService
}
