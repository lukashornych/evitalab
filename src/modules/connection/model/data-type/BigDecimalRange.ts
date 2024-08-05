import { BigDecimal } from "./BigDecimal";
import { PrettyPrintable } from "./PrettyPrintable";
import { Range } from "./Range";

//TODO: Add documentation
export class BigDecimalRange extends Range<BigDecimal> implements PrettyPrintable{
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