import { BigDecimal } from "../data-type/BigDecimal";
import { DateTimeRange } from "../data-type/DateTimeRange";
import { Value } from "../Value";

export class Price {
    readonly priceId: Value<number>
    readonly priceList: Value<string>
    readonly innerRecordId: Value<number | undefined>;
    readonly priceWithoutTax: Value<BigDecimal | undefined>
    readonly taxRate: Value<BigDecimal>
    readonly priceWithTax: Value<BigDecimal | undefined>
    readonly validity: Value<DateTimeRange | undefined>
    readonly sellable: Value<boolean>
    readonly version: Value<number>

    constructor(priceId: Value<number>, priceList: Value<string>, innerRecordId: Value<number | undefined>, priceWithoutTax: Value<BigDecimal | undefined>, taxRate: Value<BigDecimal>, priceWithTax: Value<BigDecimal | undefined>, validity: Value<DateTimeRange  | undefined>, sellable: Value<boolean>, version: Value<number>){
        this.priceId = priceId;
        this.priceList = priceList;
        this.innerRecordId = innerRecordId;
        this.priceWithoutTax = priceWithoutTax;
        this.taxRate = taxRate;
        this.priceWithTax = priceWithTax;
        this.validity = validity;
        this.sellable = sellable;
        this.version = version;
    }
}