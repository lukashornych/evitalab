import { Value } from "../Value";
import { EntityReference } from "./EntityReference";

//TODO: Add documentation
export class EntityReferenceWithParent extends EntityReference
{
    readonly primaryKey: Value<number>;

    readonly version: Value<number>;

    readonly parent: Value<EntityReferenceWithParent | undefined>;

    constructor(entityType: Value<string>, primaryKey: Value<number>, version: Value<number>, parent: Value<EntityReferenceWithParent | undefined>){
        super(entityType, primaryKey, version);
        this.primaryKey = primaryKey;
        this.version = version;
        this.parent = parent;
    }
}
