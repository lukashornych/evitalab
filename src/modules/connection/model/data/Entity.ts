/**
 * evitaLab's representation of a single evitaDB entity independent of specific evitaDB version
 * Note: this is a temporary simple "implementation", in the future, we want full rich implementation
 * of the entity object.
 */

import { List, Map } from 'immutable';
import { Value } from '../Value';

// todo implement full rich version
export class Entity{

    readonly entityType: Value<string>;

    readonly primaryKey: Value<number>;

    readonly version: Value<number>;

    readonly schemaVersion: Value<number>;

    readonly parent: Value<number>;

    readonly parentReference: Value<Entity>;


    constructor(entityType: Value<string>, primaryKey: Value<number>, version: Value<number>, schemaVersion: Value<number>, parent: Value<number>, sealedEntity: Value<Entity>){
        this.entityType = entityType;
        this.primaryKey = primaryKey;
        this.version = version;
        this.schemaVersion = schemaVersion;
        this.parent = parent;
        this.parentReference = sealedEntity;
    }

    getRepresentativeFlags(): List<string> {
        throw new Error('Method not implemented.');
    }
}

export type EntityOld = any;
