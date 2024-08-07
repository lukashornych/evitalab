import { BigDecimal } from "../data-type/BigDecimal";
import { DateTimeRange } from "../data-type/DateTimeRange";
import { Value } from "../Value";
import { Currency } from "./Currency";

//TODO: Add documentation
export class Price {
    readonly priceId: Value<number>
    readonly priceList: Value<string>
    readonly innerRecordId: Value<number | undefined>;
    readonly priceWithoutTax: Value<BigDecimal>
    readonly taxRate: Value<BigDecimal>
    readonly priceWithTax: Value<BigDecimal>
    readonly validity: Value<DateTimeRange | undefined>
    readonly sellable: Value<boolean>
    readonly version: Value<number>
    readonly currency: Value<Currency>

    constructor(priceId: Value<number>, priceList: Value<string>, innerRecordId: Value<number | undefined>, priceWithoutTax: Value<BigDecimal>, taxRate: Value<BigDecimal>, priceWithTax: Value<BigDecimal>, validity: Value<DateTimeRange  | undefined>, sellable: Value<boolean>, version: Value<number>, currency: Value<Currency>){
        this.priceId = priceId;
        this.priceList = priceList;
        this.innerRecordId = innerRecordId;
        this.priceWithoutTax = priceWithoutTax;
        this.taxRate = taxRate;
        this.priceWithTax = priceWithTax;
        this.validity = validity;
        this.sellable = sellable;
        this.version = version;
        this.currency = currency
    }
}