import {
    JsonAttributeHistogramsVisualiserService
} from '@/modules/console/result-visualiser/service/json/JsonAttributeHistogramsVisualiserService'
import {
    EvitaQLResultVisualiserService
} from '@/modules/evitaql-console/console/result-visualiser/service/EvitaQLResultVisualiserService'

/**
 * {@link AttributeHistogramsVisualiserService} for EvitaQL query language.
 */
export class EvitaQLAttributeHistogramsVisualiserService extends JsonAttributeHistogramsVisualiserService<EvitaQLResultVisualiserService> {
    constructor(visualiserService: EvitaQLResultVisualiserService) {
        super(visualiserService)
    }
}
