/**
 * evitaLab's representation of a single evitaDB entity independent of specific evitaDB version
 * Note: this is a temporary simple "implementation", in the future, we want full rich implementation
 * of the entity object.
 */
import { Value } from '../Value'
import { EntityReferenceWithParent } from './EntityReferenceWithParent'
import { LocalizedAttribute } from './LocalizedAttribute'
import { Price } from './Price'
import { PriceInnerRecordHandling } from '../data-type/PriceInnerRecordHandling'
import { Reference } from './Reference'
import { LocalizedAssociatedData } from './LocalizedAssociatedData'
import { Locale } from '../data-type/Locale'
import { Map, List } from 'immutable'

export class Entity extends EntityReferenceWithParent {

    readonly schemaVersion: Value<number>
    readonly globalAttributes: Value<Map<string, object>>
    readonly localizedAttributes: Value<Map<string, LocalizedAttribute>>
    readonly prices: Value<List<Price>>
    readonly priceForSale: Value<Price | undefined>
    readonly priceInnerRecordHandling: Value<PriceInnerRecordHandling>
    readonly references: Value<List<Reference>>
    readonly globalAssociatedData: Value<Map<string, any>>
    readonly localizedAssociatedData: Value<Map<string, LocalizedAssociatedData>>
    readonly locales: Value<List<Locale>>

    constructor(
        entityType: Value<string>,
        primaryKey: Value<number>,
        version: Value<number>,
        schemaVersion: Value<number>,
        parentEntity: EntityReferenceWithParent | undefined,
        globalAttribtes: Value<Map<string,object>>,
        localizedAttribtes: Value<Map<string, LocalizedAttribute>>,
        references: Value<List<Reference>>,
        priceInnerRecordHandling: Value<PriceInnerRecordHandling>,
        globalAssociatedData: Value<Map<string, any>>,
        localizedAssociatedData: Value<Map<string, LocalizedAssociatedData>>,
        locales: Value<List<Locale>>,
        prices: Value<List<Price>>,
        priceForSale: Value<Price | undefined>
    ) {
        super(entityType, primaryKey, version, parentEntity)
        this.schemaVersion = schemaVersion
        this.localizedAttributes = localizedAttribtes
        this.priceInnerRecordHandling = priceInnerRecordHandling
        this.globalAssociatedData = globalAssociatedData
        this.localizedAssociatedData = localizedAssociatedData
        this.globalAttributes = globalAttribtes
        this.prices = prices
        this.locales = locales
        this.references = references
        this.priceForSale = priceForSale
    }
}
