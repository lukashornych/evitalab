import { Value } from "../Value";
import { EntityReferenceWithParent } from "./EntityReferenceWithParent";
import { EvitaAssociatedDataValue } from "./EvitaAssociatedDataValue";
import { LocalizedAssociatedData } from "./LocalizedAssociatedData";
import { LocalizedAttribute } from "./LocalizedAttribute";
import { Price } from "./Price";
import { PriceInnerRecordHandling } from "../data-type/PriceInnerRecordHandling";
import { Reference } from "./Reference";

export class SealedEntity{
    readonly entityType: Value<string>
    readonly primaryKey: Value<number>
    readonly version: Value<number>
    readonly schemaVersion: Value<number>
    readonly parent: Value<number>
    readonly parentReference: Value<EntityReferenceWithParent>
    readonly parentEntity: Value<SealedEntity>
    readonly globalAttributes: Value<object[]>
    readonly localizedAttributes: Value<LocalizedAttribute>
    readonly prices: Value<Price[]>
    readonly priceForSale: Value<Price>
    readonly priceInnerRecordHandling: Value<PriceInnerRecordHandling>
    readonly references: Value<Reference>
    readonly globalAssociatedData: Value<EvitaAssociatedDataValue[]>
    readonly localizedAssociatedData: Value<LocalizedAssociatedData[]>
    readonly locales: Value<Locale>

    constructor(entityType: Value<string>, 
        primaryKey: Value<number>, 
        version: Value<number>, 
        schemaVersion: Value<number>, 
        parent: Value<number>, 
        parentReference: Value<EntityReferenceWithParent>, 
        parentEntity: Value<SealedEntity>, 
        globalAttributes: Value<object[]>,
        localizedAttributes: Value<LocalizedAttribute>,
        prices: Value<Price[]>,
        priceForSale: Value<Price>,
        priceInnerRecordHandling: Value<PriceInnerRecordHandling>,
        references: Value<Reference>,
        globalAssociatedData: Value<EvitaAssociatedDataValue[]>,
        localizedAssociatedData: Value<LocalizedAssociatedData[]>,
        locales: Value<Locale>
    ) {
        this.entityType = entityType
        this.primaryKey = primaryKey;
        this.version = version;
        this.schemaVersion = schemaVersion;
        this.parent = parent;
        this.parentReference = parentReference
        this.parentEntity = parentEntity;
        this.globalAttributes = globalAttributes;
        this.localizedAttributes = localizedAttributes;
        this.prices = prices;
        this.priceForSale = priceForSale;
        this.priceInnerRecordHandling = priceInnerRecordHandling;
        this.references = references;
        this.globalAssociatedData = globalAssociatedData;
        this.localizedAssociatedData = localizedAssociatedData;
        this.locales = locales; 
    }
}