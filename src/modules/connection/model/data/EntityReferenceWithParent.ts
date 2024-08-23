import { Value } from "../Value";
import { EntityReference } from "./EntityReference";

//TODO: Add documentation
export class EntityReferenceWithParent extends EntityReference
{
    readonly parentEntity: EntityReferenceWithParent | undefined

    constructor(entityType: Value<string>, primaryKey: Value<number>, version: Value<number>, parentEntity: EntityReferenceWithParent | undefined){
        super(entityType, primaryKey, version);
        this.parentEntity = parentEntity;
    }
}
