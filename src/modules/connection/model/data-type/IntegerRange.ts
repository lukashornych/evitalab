import { PerttyPrintable } from "./PrettyPrintable";
import { Range } from "./Range";

export class IntegerRange extends Range<number> implements PerttyPrintable {
    constructor(from?: number, to?: number){
        super(from, to);
    }
    getPrettyPrintableString(): string {
        return this.toString()
    }
     
    override toString(): string {
        return `${this.from ?? '∞'},${this.to ?? '∞'}`
    }
}