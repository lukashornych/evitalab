import { BigDecimal } from '@/modules/connection/model/data-type/BigDecimal'
import {
    VisualisedHistogramBucket
} from '@/modules/console/result-visualiser/model/histogram/VisualisedHistogramBucket'

/**
 * Single returned histogram DTO ready for visualisation.
 */
export class VisualisedHistogram {
    readonly min?: BigDecimal
    readonly max?: BigDecimal
    readonly overallCount?: number
    readonly buckets: VisualisedHistogramBucket[]

    constructor(min: BigDecimal | undefined,
                max: BigDecimal | undefined,
                overallCount: number | undefined,
                buckets: VisualisedHistogramBucket[]) {
        this.min = min
        this.max = max
        this.overallCount = overallCount
        this.buckets = buckets
    }

    static fromJson(json: any): VisualisedHistogram {
        const buckets = json.buckets.map((bucket: any) => VisualisedHistogramBucket.fromJson(bucket))
        return new VisualisedHistogram(json.min, json.max, json.overallCount, buckets)
    }
}
