import { AttributeSchemaUnion, EntitySchema } from '@/model/evitadb'

/**
 * Service for visualising raw JSON attribute histograms.
 */
export interface AttributeHistogramsVisualiserService {

    /**
     * Resolves attribute histograms from the attribute histograms result.
     */
    resolveAttributeHistogramsByAttributes(attributeHistogramsResult: Result, entitySchema: EntitySchema): [AttributeSchemaUnion, VisualisedHistogram][]
}
