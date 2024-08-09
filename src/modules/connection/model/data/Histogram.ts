import { BigDecimal } from "../data-type/BigDecimal";
import { Value } from "../Value";
import { HistogramBuckets } from "./HistogramBucket";
import { List } from "immutable";

//TODO: Add documentation
export class Histogram {
    readonly min: Value<BigDecimal>
    readonly max: Value<BigDecimal>
    readonly overallCount: Value<number>
    readonly buckets: Value<List<HistogramBuckets>>

    constructor(overallCount: Value<number>, buckets: Value<List<HistogramBuckets>>, min: Value<BigDecimal>, max: Value<BigDecimal>){
        this.min = min
        this.max = max
        this.overallCount = overallCount
        this.buckets = buckets
    }
}