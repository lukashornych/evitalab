import { BigDecimal } from '@/model/evitadb'

/**
 * Single histogram bucket DTO ready for visualisation.
 */
export class VisualisedHistogramBucket {
    readonly threshold?: BigDecimal
    readonly occurrences?: number
    readonly requested?: boolean

    constructor(threshold: BigDecimal | undefined,
                occurrences: number | undefined,
                requested: boolean | undefined) {
        this.threshold = threshold
        this.occurrences = occurrences
        this.requested = requested
    }

    static fromJson(json: any): VisualisedHistogramBucket {
        return new VisualisedHistogramBucket(json.threshold, json.occurrences, json.requested)
    }
}
