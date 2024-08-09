import { EvitaQLResultVisualiserService } from '@/modules/evitaql-console/console/result-visualiser/service/EvitaQLResultVisualiserService'
import { AttributeHistogramsVisualiserService } from '@/modules/console/result-visualiser/service/AttributeHistogramsVisualiserService'
import { AttributeSchema } from '@/modules/connection/model/schema/AttributeSchema'
import { EntitySchema } from '@/modules/connection/model/schema/EntitySchema'
import { VisualisedHistogram } from '@/modules/console/result-visualiser/model/histogram/VisualisedHistogram'
import { Result } from '@/modules/console/result-visualiser/model/Result'
import { Histogram } from '@/modules/connection/model/data/Histogram'
import { Value } from '@/modules/connection/model/Value'
import { HistogramBuckets } from '@/modules/connection/model/data/HistogramBucket'
import { VisualisedHistogramBucket } from '@/modules/console/result-visualiser/model/histogram/VisualisedHistogramBucket'

/**
 * {@link AttributeHistogramsVisualiserService} for EvitaQL query language.
 */
export class EvitaQLAttributeHistogramsVisualiserService
    implements AttributeHistogramsVisualiserService
{
    constructor(visualiserService: EvitaQLResultVisualiserService) {}
    resolveAttributeHistogramsByAttributes(
        attributeHistogramsResult: Result,
        entitySchema: EntitySchema
    ): [AttributeSchema, VisualisedHistogram][] {
        const histogramsValue: Value<Immutable.Map<string, Histogram>> =
            attributeHistogramsResult.value as Value<
                Immutable.Map<string, Histogram>
            >
        const histograms = histogramsValue.getOrThrow()
        const newHistograms: [AttributeSchema, VisualisedHistogram][] = []

        for (const [key, attribute] of entitySchema.attributes.getOrThrow()) {
            const attributeSchema: AttributeSchema = new AttributeSchema(
                entitySchema.name,
                entitySchema.nameVariants,
                entitySchema.description,
                entitySchema.deprecationNotice,
                attribute?.type,
                attribute?.uniquenessType,
                attribute.filterable,
                attribute.sortable,
                attribute.nullable,
                attribute.defaultValue,
                attribute.localized,
                attribute.indexedDecimalPlaces
            )
            for (const [_, histogram] of histograms) {
                newHistograms.push([
                    attributeSchema,
                    new VisualisedHistogram(
                        histogram.min.getOrThrow(),
                        histogram.max.getOrThrow(),
                        histogram.overallCount.getOrThrow(),
                        this.convertBuckets(histogram.buckets)
                    ),
                ])
            }
        }
        return newHistograms
    }
    private convertBuckets(
        buckets: Value<Immutable.List<HistogramBuckets>>
    ): VisualisedHistogramBucket[] {
        const newBuckets: VisualisedHistogramBucket[] = []

        for (const bucket of buckets.getOrThrow()) {
            newBuckets.push(
                new VisualisedHistogramBucket(
                    bucket.threshold?.getIfSupported(),
                    bucket.occurrences.getIfSupported(),
                    bucket.requested.getIfSupported()
                )
            )
        }

        return newBuckets
    }
}
