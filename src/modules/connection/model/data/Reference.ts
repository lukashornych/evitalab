import { Value } from '../Value'
import { EntityReference } from './EntityReference'
import { LocalizedAttribute } from './LocalizedAttribute'
import { Entity } from './Entity'
import { Cardinality } from '../schema/Cardinality'

export class Reference {
    readonly referenceName: Value<string>
    readonly version: Value<number>
    readonly referencedEntityReference?: Value<EntityReference | undefined>
    readonly referencedEntity?: Value<Entity | undefined>
    readonly groupReferenceType: | EntityReference | Entity | undefined
    readonly globalAttributes: Value<object[]>
    readonly localizedAttributes: Value<LocalizedAttribute[]>
    readonly referenceCardinality: Value<Cardinality>

    constructor(
        referenceName: Value<string>,
        version: Value<number>,
        referencedEntityReference: Value<EntityReference| undefined>,
        referencedEntity: Value<Entity| undefined>,
        referenceCardinality: Value<Cardinality>,
        groupReferenceType: EntityReference | Entity | undefined,
        globalAttributes: Value<object[]>,
        localizedAttributes: Value<LocalizedAttribute[]>
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
}
