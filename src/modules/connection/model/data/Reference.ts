import { Value } from '../Value'
import { EntityReference } from './EntityReference'
import { LocalizedAttribute } from './LocalizedAttribute'
import { Entity } from './Entity'
import { Cardinality } from '../schema/Cardinality'
import { Map } from 'immutable'

//TODO: Add documentation
export class Reference {
    readonly referenceName: Value<string>
    readonly version: Value<number>
    readonly referencedEntityReference: Value<EntityReference | undefined>
    readonly referencedEntity: Value<Entity | undefined>
    readonly groupReferenceType: Value<EntityReference | Entity | undefined>
    readonly globalAttributes: Value<Map<string, object>>
    readonly localizedAttributes: Value<Map<string, LocalizedAttribute>>
    readonly referenceCardinality: Value<Cardinality>

    constructor(
        referenceName: Value<string>,
        version: Value<number>,
        referencedEntityReference: Value<EntityReference | undefined>,
        referencedEntity: Value<Entity | undefined>,
        referenceCardinality: Value<Cardinality>,
        groupReferenceType: Value<EntityReference | Entity | undefined>,
        globalAttributes: Value<Map<string, object>>,
        localizedAttributes: Value<Map<string, LocalizedAttribute>>
    ) {
        this.referenceName = referenceName
        this.version = version
        this.referencedEntityReference = referencedEntityReference
        this.referencedEntity = referencedEntity
        this.groupReferenceType = groupReferenceType
        this.globalAttributes = globalAttributes
        this.localizedAttributes = localizedAttributes
        this.referenceCardinality = referenceCardinality
    }

    getReferencedPrimaryKey(): number {
        const referencedEntity = this.referencedEntity.getIfSupported()
        const referencedEntityReference =
            this.referencedEntityReference.getIfSupported()
        if (referencedEntity) {
            return referencedEntity.primaryKey.getOrThrow()
        } else if (referencedEntityReference) {
            return referencedEntityReference.primaryKey.getOrThrow()
        } else {
            throw new Error('Both references are null or undefined')
        }
    }

    getReferencedType(): string {
        const referencedEntity = this.referencedEntity.getIfSupported()
        const referencedEntityReference =
            this.referencedEntityReference.getIfSupported()
        if(referencedEntity){
            return referencedEntity.entityType.getOrThrow();
        } else if(referencedEntityReference){
            return referencedEntityReference.entityType.getOrThrow()
        } else {
            throw new Error('Both references are null or undefined')
        }
    }
}
