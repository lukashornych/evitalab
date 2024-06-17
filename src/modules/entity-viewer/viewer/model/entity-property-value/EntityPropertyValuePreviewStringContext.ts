import { QueryPriceMode } from '@/model/evitadb'

/**
 * Passes context arguments to {@link EntityPropertyValue.toPreviewString} method to possibly influence the output.
 */
export type EntityPropertyValuePreviewStringContext = {
    priceType?: QueryPriceMode
}
