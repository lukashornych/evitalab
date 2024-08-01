//TODO: Add documentation
export class BigDecimal {
    readonly value: string | undefined

    constructor(value: string | undefined){
        this.value = value
    }

    toString():string{
        return this.value ?? ''
    }
}