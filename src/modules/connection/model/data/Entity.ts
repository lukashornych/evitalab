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
import { EvitaAssociatedDataValue } from './EvitaAssociatedDataValue'
import { LocalizedAssociatedData } from './LocalizedAssociatedData'
import { Locale } from '../data-type/Locale'
import { Map, List } from 'immutable'

// todo implement full rich version
export class Entity {
    readonly entityType: Value<string>

    readonly primaryKey: Value<number>

    readonly version: Value<number>

    readonly schemaVersion: Value<number>

    readonly parent: Value<number | undefined>

    readonly parentReference: Value<EntityReferenceWithParent | undefined>
    readonly globalAttributes: Value<Map<string, object>>
    readonly localizedAttributes: Value<Map<string, LocalizedAttribute>>
    readonly prices: Value<List<Price>>
    readonly priceForSale: Value<Price | undefined>
    readonly priceInnerRecordHandling: Value<PriceInnerRecordHandling>
    readonly references: Value<List<Reference>>
    readonly globalAssociatedData: Value<Map<string, EvitaAssociatedDataValue>>
    readonly localizedAssociatedData: Value<Map<string, LocalizedAssociatedData>>
    readonly locales: Value<List<Locale>>

    constructor(
        entityType: Value<string>,
        primaryKey: Value<number>,
        version: Value<number>,
        schemaVersion: Value<number>,
        parent: Value<number | undefined>,
        parentReference: Value<EntityReferenceWithParent | undefined>,
        globalAttribtes: Value<Map<string,object>>,
        localizedAttribtes: Value<Map<string, LocalizedAttribute>>,
        references: Value<List<Reference>>,
        priceInnerRecordHandling: Value<PriceInnerRecordHandling>,
        globalAssociatedData: Value<Map<string, EvitaAssociatedDataValue>>,
        localizedAssociatedData: Value<Map<string, LocalizedAssociatedData>>,
        locales: Value<List<Locale>>,
        prices: Value<List<Price>>,
        priceForSale: Value<Price | undefined>
    ) {
        this.entityType = entityType
        this.primaryKey = primaryKey
        this.version = version
        this.schemaVersion = schemaVersion
        this.localizedAttributes = localizedAttribtes
        this.priceInnerRecordHandling = priceInnerRecordHandling
        this.globalAssociatedData = globalAssociatedData
        this.localizedAssociatedData = localizedAssociatedData
        this.parent = parent
        this.parentReference = parentReference
        this.globalAttributes = globalAttribtes
        this.prices = prices
        this.locales = locales
        this.references = references
        this.priceForSale = priceForSale
    }

    getRepresentativeFlags(): List<string> {
        throw new Error('Method not implemented.')
    }
}

//TODO: Remove
export type EntityOld = any
