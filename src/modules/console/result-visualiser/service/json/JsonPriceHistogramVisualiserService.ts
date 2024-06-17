import { JsonResultVisualiserService } from '@/modules/console/result-visualiser/service/JsonResultVisualiserService'

export abstract class JsonPriceHistogramVisualiserService<VS extends JsonResultVisualiserService> implements PriceHistogramVisualiserService {
    protected readonly visualiserService: VS

    protected constructor(visualiserService: VS) {
        this.visualiserService = visualiserService
    }

    resolvePriceHistogram(priceHistogramResult: Result): VisualisedHistogram {
        return VisualisedHistogram.fromJson(priceHistogramResult)
    }
}
