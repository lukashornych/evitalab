import { DateTime } from '@/modules/connection/model/data-type/DateTime'
import { BigDecimal } from '@/modules/connection/model/data-type/BigDecimal'
import { Long } from '@/modules/connection/model/data-type/Long'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'

/**
 * Actual specific value of a property representing a range of values (e.g., date range, number range)
 */
export class RangeValue {
    readonly offsetDateTimeFormatter = new Intl.DateTimeFormat([], { dateStyle: 'medium', timeStyle: 'long' })

    readonly range?: (DateTime | BigDecimal | Long | number | undefined)[]
    private serializedRange?: string[]

    constructor(range: (DateTime | BigDecimal | Long | number | undefined)[] | undefined) {
        if (range != undefined && range.length != 2) {
            throw new UnexpectedError('Range must have two items.')
        }
        this.range = range
    }

    toSerializable(): string[] {
        if (this.serializedRange == undefined) {
            if (this.range == undefined) {
                this.serializedRange = ['∞', '∞']
            } else {
                this.serializedRange = [this.formatPart(this.range[0]), this.formatPart(this.range[1])]
            }
        }
        return this.serializedRange
    }

    toString() {
        if (this.range == undefined) {
            return '∞ - ∞'
        }
        return `${this.formatPart(this.range[0])} - ${this.formatPart(this.range[1])}`
    }

    private formatPart(part: DateTime | BigDecimal | Long | number | undefined): string {
        if (part == undefined) {
            return '∞'
        }
        if (typeof part == 'number') {
            return part.toString()
        }
        try {
            return this.offsetDateTimeFormatter.format(new Date(part))
        } catch (e) {
            // not date time but long or BigDecimal
            return part.toString()
        }
    }
}
