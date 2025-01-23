/**
 * Label associated with the query / source query.
 */
export class Label {
    readonly name: string
    readonly value?: string

    constructor(name: string, value: string | undefined) {
        this.name = name
        this.value = value
    }
}
