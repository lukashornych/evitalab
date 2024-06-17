import { EntityPropertyValue } from '@/modules/entity-viewer/viewer/workspace/EntityPropertyValue'
import {
    EntityPropertyValuePreviewStringContext
} from '@/modules/entity-viewer/viewer/workspace/EntityPropertyValuePreviewStringContext'
import { BigDecimal, QueryPriceMode } from '@/model/evitadb'

import { EntityPrice } from '@/modules/entity-viewer/viewer/workspace/EntityPrice'

/**
 * Holder for entity prices displayable data grid.
 */
export class EntityPrices extends EntityPropertyValue {
    readonly priceForSale?: EntityPrice
    readonly prices: EntityPrice[]

    constructor(priceForSale: EntityPrice | undefined, prices: EntityPrice[]) {
        super()
        this.priceForSale = priceForSale
        this.prices = prices
    }

    count(): number {
        return this.prices.length
    }

    value(): any {
        return this
    }

    isEmpty(): boolean {
        return false
    }

    toPreviewString(context?: EntityPropertyValuePreviewStringContext): string {
        let previewString: string = ''

        if (this.priceForSale != undefined) {
            const priceFormatter = new Intl.NumberFormat(
                navigator.language,
                { style: 'currency', currency: this.priceForSale.currency, maximumFractionDigits: 2 }
            )
            const actualPriceType: QueryPriceMode = context?.priceType != undefined ? context.priceType : QueryPriceMode.WithTax
            const price: BigDecimal = actualPriceType === QueryPriceMode.WithTax ? this.priceForSale.priceWithTax : this.priceForSale.priceWithoutTax
            const formattedPrice: string = priceFormatter.format(parseFloat(price))

            previewString += `${formattedPrice} with `
        }

        const allPricesCount = this.count()
        previewString += (allPricesCount === 1 ? `${allPricesCount} price` : `${allPricesCount} prices`)

        return previewString
    }
}
