import {
    EvitaQLResultVisualiserService
} from '@/modules/console/result-visualiser/service/EvitaQLResultVisualiserService'

/**
 * {@link PriceHistogramVisualiserService} for EvitaQL query language.
 */
export class EvitaQLPriceHistogramVisualiserService extends JsonPriceHistogramVisualiserService<EvitaQLResultVisualiserService> {
    constructor(visualiserService: EvitaQLResultVisualiserService) {
        super(visualiserService)
    }
}
