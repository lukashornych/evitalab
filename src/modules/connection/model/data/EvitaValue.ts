import { Scalar } from '../data-type/Scalar'

//TODO: Add docs
export class EvitaValue {
    readonly value: object
    readonly valueType: Scalar

    constructor(value: object, valueType: Scalar) {
        this.value = value
        this.valueType = valueType
    }
}
