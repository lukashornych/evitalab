import {
    JsonFacetSummaryVisualiserService
} from '@/modules/console/result-visualiser/service/json/JsonFacetSummaryVisualiserService'
import {
    EvitaQLResultVisualiserService
} from '@/modules/evitaql-console/console/result-visualiser/service/EvitaQLResultVisualiserService'

/**
 * {@link FacetSummaryVisualiserService} for EvitaQL query language.
 */
export class EvitaQLFacetSummaryVisualiserService extends JsonFacetSummaryVisualiserService<EvitaQLResultVisualiserService> {
    constructor(visualiserService: EvitaQLResultVisualiserService) {
        super(visualiserService)
    }
}
