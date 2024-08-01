import { PrettyPrintable } from "./PrettyPrintable";
import { Range } from "./Range";

//TODO: Add documentation
export class IntegerRange extends Range<number> implements PrettyPrintable {
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