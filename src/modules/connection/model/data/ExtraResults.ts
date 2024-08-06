import { List, Map } from "immutable"
import { Histogram } from "./Histogram"
import { FacetGroupStatistics } from "./FacetGroupStatistics"
import { Hierarchy } from "./Hierarchy"
import { Value } from "../Value"

//TODO: Add documentation
export class ExtraResults {
    readonly attributeHistogram: Value<Map<string, Histogram>>
    readonly priceHistogram: Value<Histogram | undefined>
    readonly facetGroupStatistics: Value<List<FacetGroupStatistics>>
    readonly selfHierarchy: Value<Hierarchy | undefined>
    readonly hierarchy: Value<Map<string, Hierarchy>>

    constructor(attributeHistogram: Value<Map<string, Histogram>>, facetGroupStatistics: Value<List<FacetGroupStatistics>>, hierarchy: Value<Map<string, Hierarchy>>, priceHistogram: Value<Histogram | undefined>, selfHierarchy: Value<Hierarchy | undefined>){
        this.attributeHistogram = attributeHistogram
        this.facetGroupStatistics = facetGroupStatistics
        this.hierarchy = hierarchy
        this.priceHistogram = priceHistogram
        this.selfHierarchy = selfHierarchy
    }
}