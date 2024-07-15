import { EntityPropertyValue } from '@/modules/entity-viewer/viewer/model/EntityPropertyValue'
import { BigDecimal } from '@/modules/connection/model/data-type/BigDecimal'
import { DateTime } from '@/modules/connection/model/data-type/DateTime'
import { Long } from '@/modules/connection/model/data-type/Long'
import { Range } from '@/modules/connection/model/data-type/Range'

/**
 * Represents a single entity property value that is a scalar (native to JavaScript). Cannot be an array, each array item
 * must be wrapped in a separate {@link NativeValue} instance.
 */
export class NativeValue extends EntityPropertyValue {
    readonly delegate: string | DateTime | BigDecimal | Long | number | object | boolean | undefined | Range<any>

    constructor(delegate: string | DateTime | BigDecimal | Long | number | object | boolean | undefined | Range<any>) {
        super()
        this.delegate = delegate
    }

    value(): string | DateTime | BigDecimal | Long | number | object | boolean | undefined | Range<any> {
        return this.delegate
    }

    isEmpty(): boolean {
        return this.delegate == undefined
    }

    toPreviewString(): string {
        if (this.delegate === undefined) {
            return super.emptyEntityPropertyValuePlaceholder
        } else if (this.delegate instanceof Array) {
            return JSON.stringify(this.delegate)
        } else if (this.delegate instanceof Object) {
            return JSON.stringify(this.delegate)
        } else {
            return this.delegate.toString()
        }
    }
}
