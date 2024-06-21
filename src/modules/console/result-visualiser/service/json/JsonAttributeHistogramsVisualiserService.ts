import { JsonResultVisualiserService } from '@/modules/console/result-visualiser/service/JsonResultVisualiserService'
import { AttributeSchemaUnion, EntitySchema } from '@/model/evitadb'

import { UnexpectedError } from '@/model/UnexpectedError'

/**
 * Common abstract for all JSON-based attribute histogram visualiser services.
 */
export abstract class JsonAttributeHistogramsVisualiserService<VS extends JsonResultVisualiserService> implements AttributeHistogramsVisualiserService {
    protected readonly visualiserService: VS

    protected constructor(visualiserService: VS) {
        this.visualiserService = visualiserService
    }

    resolveAttributeHistogramsByAttributes(attributeHistogramsResult: Result, entitySchema: EntitySchema): [AttributeSchemaUnion, VisualisedHistogram][] {
        const attributeHistograms: [AttributeSchemaUnion, VisualisedHistogram][] = []
        for (const attributeName of Object.keys(attributeHistogramsResult)) {
            const attributeSchema: AttributeSchemaUnion | undefined = Object.values(entitySchema.attributes)
                .find(attribute => attribute.nameVariants.camelCase === attributeName)
            if (attributeSchema == undefined) {
                throw new UnexpectedError(undefined, `Attribute '${attributeName}' not found in entity '${entitySchema.name}'.`)
            }
            const histogramResult: Result = attributeHistogramsResult[attributeName]
            attributeHistograms.push([attributeSchema, VisualisedHistogram.fromJson(histogramResult)])
        }
        return attributeHistograms
    }
}
