import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { Histogram } from '@/modules/connection/model/data/Histogram'
import { HistogramBuckets } from '@/modules/connection/model/data/HistogramBucket'
import { Value } from '@/modules/connection/model/Value'
import { VisualisedHistogram } from '@/modules/console/result-visualiser/model/histogram/VisualisedHistogram'
import { VisualisedHistogramBucket } from '@/modules/console/result-visualiser/model/histogram/VisualisedHistogramBucket'
import { Result } from '@/modules/console/result-visualiser/model/Result'
import { PriceHistogramVisualiserService } from '@/modules/console/result-visualiser/service/PriceHistogramVisualiserService'
import {
    EvitaQLResultVisualiserService
} from '@/modules/evitaql-console/console/result-visualiser/service/EvitaQLResultVisualiserService'

/**
 * {@link PriceHistogramVisualiserService} for EvitaQL query language.
 */
export class EvitaQLPriceHistogramVisualiserService implements PriceHistogramVisualiserService {
    constructor(visualiserService: EvitaQLResultVisualiserService) {

    }
    resolvePriceHistogram(priceHistogramResult: Result): VisualisedHistogram {
        const histogramValue:  Value<Histogram | undefined> = priceHistogramResult.value as  Value<Histogram | undefined>
        const histogram = histogramValue.getIfSupported();
        if(histogram){
            return new VisualisedHistogram(histogram.min.getOrThrow(), histogram.max.getOrThrow(), histogram.overallCount.getOrThrow(), this.convertBuckets(histogram.buckets))
        } else {
            throw new UnexpectedError('Price histogram is undefined')
        }
    }

    private convertBuckets(buckets: Value<Immutable.List<HistogramBuckets>>):VisualisedHistogramBucket[]{
        const newBuckets: VisualisedHistogramBucket[] = []

        for(const bucket of buckets.getOrThrow()){
            newBuckets.push(new VisualisedHistogramBucket(bucket.threshold?.getIfSupported(), bucket.occurrences.getIfSupported(), bucket.requested.getIfSupported()))
        }

        return newBuckets
    }
}
