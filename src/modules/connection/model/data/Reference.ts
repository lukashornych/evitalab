import { Value } from '../Value'
import { EntityReference } from './EntityReference'
import { LocalizedAttribute } from './LocalizedAttribute'
import { Entity } from './Entity'
import { Cardinality } from '../schema/Cardinality'
import { Map } from 'immutable'

export class Reference {
    readonly referenceName: Value<string>
    readonly version: Value<number>
    readonly referencedEntityReference?: EntityReference | undefined
    readonly referencedEntity: Entity | undefined
    readonly groupReferenceType: | EntityReference | Entity | undefined
    readonly globalAttributes: Value<Map<string, object>>
    readonly localizedAttributes: Value<Map<string, LocalizedAttribute>>
    readonly referenceCardinality: Value<Cardinality>

    constructor(
        referenceName: Value<string>,
        version: Value<number>,
        referencedEntityReference: EntityReference| undefined,
        referencedEntity: Entity| undefined,
        referenceCardinality: Value<Cardinality>,
        groupReferenceType: EntityReference | Entity | undefined,
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
}
