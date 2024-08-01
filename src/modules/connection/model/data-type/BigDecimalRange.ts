import { BigDecimal } from "./BigDecimal";
import { PerttyPrintable } from "./PrettyPrintable";
import { Range } from "./Range";

export class BigDecimalRange extends Range<BigDecimal> implements PerttyPrintable{
    constructor(from: BigDecimal, to: BigDecimal){
        super(from, to)
    }
    getPrettyPrintableString(): string {
        return this.toString()
    }

    override toString(): string {
        return `[${this.from?.value ?? '∞'},${this.to?.value?? '∞'}]`
    }
}