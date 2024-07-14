import {
    JsonPriceHistogramVisualiserService
} from '@/modules/console/result-visualiser/service/json/JsonPriceHistogramVisualiserService'
import {
    EvitaQLResultVisualiserService
} from '@/modules/evitaql-console/console/result-visualiser/service/EvitaQLResultVisualiserService'

/**
 * {@link PriceHistogramVisualiserService} for EvitaQL query language.
 */
export class EvitaQLPriceHistogramVisualiserService extends JsonPriceHistogramVisualiserService<EvitaQLResultVisualiserService> {
    constructor(visualiserService: EvitaQLResultVisualiserService) {
        super(visualiserService)
    }
}
