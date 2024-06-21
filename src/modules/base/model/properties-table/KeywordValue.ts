/**
 * Actual specific value of a property representing a keyword (e.g., data type, enum item,...)
 */
export class KeywordValue {
    /**
     * String representation of the value
     */
    readonly value: string

    constructor(value: string) {
        this.value = value
    }

    toString() {
        return this.value
    }
}
