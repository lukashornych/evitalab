import { Value } from "../Value";

export class EntityReference {
    readonly entityType: Value<string>
    readonly primaryKey: Value<number>
    readonly version: Value<number>

    constructor(entityType: Value<string>, primaryKey: Value<number>, version: Value<number>){
        this.entityType = entityType;
        this.primaryKey = primaryKey;
        this.version = version;
    }
}