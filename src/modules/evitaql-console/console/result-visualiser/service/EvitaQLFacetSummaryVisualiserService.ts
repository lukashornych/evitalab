import { EvitaQLResultVisualiserService } from '@/modules/evitaql-console/console/result-visualiser/service/EvitaQLResultVisualiserService'
import { FacetSummaryVisualiserService } from '@/modules/console/result-visualiser/service/FacetSummaryVisualiserService'
import { EntitySchema } from '@/modules/connection/model/schema/EntitySchema'
import { ReferenceSchema } from '@/modules/connection/model/schema/ReferenceSchema'
import { VisualisedFacetGroupStatistics } from '@/modules/console/result-visualiser/model/facet-summary/VisualisedFacetGroupStatistics'
import { VisualisedFacetStatistics } from '@/modules/console/result-visualiser/model/facet-summary/VisualisedFacetStatistics'
import { Result } from '@/modules/console/result-visualiser/model/Result'
import { Value } from '@/modules/connection/model/Value'
import { FacetGroupStatistics } from '@/modules/connection/model/data/FacetGroupStatistics'
import { Entity } from '@/modules/connection/model/data/Entity'

/**
 * {@link FacetSummaryVisualiserService} for EvitaQL query language.
 */
export class EvitaQLFacetSummaryVisualiserService
    implements FacetSummaryVisualiserService
{
    private readonly visualiserService: EvitaQLResultVisualiserService
    constructor(visualiserService: EvitaQLResultVisualiserService) {
        this.visualiserService = visualiserService
    }

    findFacetGroupStatisticsByReferencesResults(
        facetSummaryResult: Result,
        entitySchema: EntitySchema
    ): [ReferenceSchema, Result[]][] {
        const facetSummary: Value<Immutable.List<FacetGroupStatistics>> =
            facetSummaryResult as Value<
                Immutable.List<FacetGroupStatistics>
            >
        const summaryList: Immutable.List<FacetGroupStatistics> | undefined =
            facetSummary.getIfSupported()

        const newSchemas: [ReferenceSchema, Result[]][] = []
        if(summaryList) {

            for (const [_, attribute] of entitySchema.references.getOrThrow()) {
                const attr = attribute.attributes.getOrThrow().valueSeq().toArray()
                const sorotableAttr = attribute.sortableAttributeCompounds.getOrThrow().valueSeq().toArray()
                const referenceSchema = new ReferenceSchema(entitySchema.name, entitySchema.nameVariants, entitySchema.description, entitySchema.deprecationNotice, attribute.entityType, attribute.referencedEntityTypeManaged, attribute.entityTypeNameVariants, attribute.referencedGroupType, attribute.referencedEntityTypeManaged, attribute.groupTypeNameVariants, attribute.indexed, attribute.faceted, attribute.cardinality, Value.of(attr), Value.of(sorotableAttr));
                newSchemas.push([referenceSchema, summaryList.toArray()])
            }
        }
        return newSchemas

    }
    resolveFacetGroupStatistics(
        groupStatisticsResult: Result,
        groupRepresentativeAttributes: string[]
    ): VisualisedFacetGroupStatistics {
        const countVal: Value<number> = groupStatisticsResult['count']
        const count = countVal.getOrThrow()

        const groupEntityResult: Entity = groupStatisticsResult['groupEntity']
        if (!groupEntityResult) {
            return { count }
        }
        const primaryKey: number | undefined = groupEntityResult.primaryKey.getIfSupported()
        const title: string | undefined = this.visualiserService.resolveRepresentativeTitleForEntityResult(
            groupEntityResult,
            groupRepresentativeAttributes
        )

        return { primaryKey, title, count }
    }
    findFacetStatisticsResults(groupStatisticsResult: Result): Result[] {
        const results: Result[] = []
        if(groupStatisticsResult) {
            const facetGroupStatistics: FacetGroupStatistics = groupStatisticsResult as FacetGroupStatistics

            for (const facetGroupStatistic of facetGroupStatistics.facetStatistics.getOrThrow()) {
                results.push(facetGroupStatistic)
            }
        }
        return results
    }
    resolveFacetStatistics(
        queryResult: Result,
        facetStatisticsResult: Result,
        facetRepresentativeAttributes: string[]
    ): VisualisedFacetStatistics {
        //TODO
        return new VisualisedFacetStatistics()
    }
}
