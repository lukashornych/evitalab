import { Range } from "./Range";
import { PerttyPrintable } from "./PrettyPrintable";

export class BigintRange extends Range<bigint> implements PerttyPrintable {
    constructor(from?: bigint, to?: bigint){
        super(from, to)
    }
    getPrettyPrintableString(): string {
        return this.toString()
    }

    override toString(): string {
        return `[${this.from ?? '∞'}, ${this.to ?? '∞'}]`
    }
}