/**
 * evitaLab's representation of a single evitaDB entity independent of specific evitaDB version
 * Note: this is a temporary simple "implementation", in the future, we want full rich implementation
 * of the entity object.
 */

import { List } from 'immutable';
import { Value } from '../Value';
import { EntityReferenceWithParent } from './EntityReferenceWithParent';
import { LocalizedAttribute } from './LocalizedAttribute';
import { Price } from './Price';
import { PriceInnerRecordHandling } from '../data-type/PriceInnerRecordHandling';
import { Reference } from './Reference';
import { EvitaAssociatedDataValue } from './EvitaAssociatedDataValue';
import { LocalizedAssociatedData } from './LocalizedAssociatedData';
import { Locale } from '../data-type/Locale';

// todo implement full rich version
export class Entity{

    readonly entityType: Value<string>;

    readonly primaryKey: Value<number>;

    readonly version: Value<number>;

    readonly schemaVersion: Value<number>;

    readonly parent: Value<number | undefined>;

    readonly parentReference: Value<EntityReferenceWithParent | undefined>;
    readonly globalAttributes: Value<object[]>
    readonly localizedAttributes: Value<LocalizedAttribute[]>
    readonly prices: Value<Price[]>;
    readonly priceForSale?: Value<Price>;
    readonly priceInnerRecordHandling: Value<PriceInnerRecordHandling>;
    readonly references: Value<Reference[]>;
    readonly globalAssociatedData: Value<EvitaAssociatedDataValue[]>
    readonly localizedAssociatedData: Value<LocalizedAssociatedData[]>;
    readonly locales: Value<Locale[]>;

    constructor(entityType: Value<string>, 
    primaryKey: Value<number>, 
    version: Value<number>, 
    schemaVersion: Value<number>, 
    parent: Value<number | undefined>, 
    parentReference: Value<EntityReferenceWithParent | undefined>,
    globalAttribtes: Value<object[]>, 
    localizedAttribtes: Value<LocalizedAttribute[]>, 
    references: Value<Reference[]>,
    priceInnerRecordHandling: Value<PriceInnerRecordHandling>, 
    globalAssociatedData: Value<EvitaAssociatedDataValue[]>, 
    localizedAssociatedData: Value<LocalizedAssociatedData[]>, 
    locales: Value<Locale[]>, 
    prices: Value<Price[]>){
        this.entityType = entityType;
        this.primaryKey = primaryKey;
        this.version = version;
        this.schemaVersion = schemaVersion; 
        this.localizedAttributes = localizedAttribtes;
        this.priceInnerRecordHandling = priceInnerRecordHandling;
        this.globalAssociatedData = globalAssociatedData;
        this.localizedAssociatedData = localizedAssociatedData;
        this.parent = parent
        this.parentReference = parentReference;
        this.globalAttributes = globalAttribtes;
        this.prices = prices
        this.locales = locales;
        this.references = references;
    }

    getRepresentativeFlags(): List<string> {
        throw new Error('Method not implemented.');
    }
}


export type EntityOld = any;
