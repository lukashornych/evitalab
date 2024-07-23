import { Value } from "../Value";

export class EntityReferenceWithParent
{
    readonly entityType: Value<string>;

    readonly primaryKey: Value<number>;

    readonly version: Value<number>;

    readonly parent: Value<EntityReferenceWithParent> | undefined;

    constructor(entityType: Value<string>, primaryKey: Value<number>, version: Value<number>, parent: Value<EntityReferenceWithParent> | undefined){
        this.entityType = entityType;
        this.primaryKey = primaryKey;
        this.version = version;
        this.parent = parent;
    }
}
