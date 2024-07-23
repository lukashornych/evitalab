import { GrpcLocalizedAttribute } from '@/gen/GrpcAttribute_pb'
import {
    GrpcEntityReference,
    GrpcEntityReferenceWithParent,
    GrpcReference,
    GrpcSealedEntity,
} from '@/gen/GrpcEntity_pb'
import {
    GrpcDateTimeRange,
    GrpcEvitaAssociatedDataValue,
    GrpcEvitaValue,
    GrpcLocale,
} from '@/gen/GrpcEvitaDataTypes_pb'
import { Entity } from '@/modules/connection/model/data/Entity'
import { EntityReferenceWithParent } from '@/modules/connection/model/data/EntityReferenceWithParent'
import { LocalizedAttribute } from '@/modules/connection/model/data/LocalizedAttribute'
import { Reference } from '@/modules/connection/model/data/Reference'
import { Value } from '@/modules/connection/model/Value'
import {
    GrpcCardinality,
    GrpcPriceInnerRecordHandling,
} from '@/gen/GrpcEnums_pb'
import { EvitaAssociatedDataValue } from '@/modules/connection/model/data/EvitaAssociatedDataValue'
import { GrpcLocalizedAssociatedData } from '@/gen/GrpcAssociatedData_pb'
import { LocalizedAssociatedData } from '@/modules/connection/model/data/LocalizedAssociatedData'
import { Locale } from '@/modules/connection/model/data-type/Locale'
import { GrpcPrice } from '@/gen/GrpcPrice_pb'
import { Price } from '@/modules/connection/model/data/Price'
import { BigDecimal } from '@/modules/connection/model/data-type/BigDecimal'
import { DateTimeRange } from '@/modules/connection/model/data-type/DateTimeRange'
import { OffsetDateTime } from '@/modules/connection/model/data-type/OffsetDateTime'
import { PriceInnerRecordHandling } from '@/modules/connection/model/data-type/PriceInnerRecordHandling'
import { EntityReference } from '@/modules/connection/model/data/EntityReference'
import { SealedEntity } from '@/modules/connection/model/data/SealedEntity'
import { EntityReferenceValue } from '@/modules/entity-viewer/viewer/model/entity-property-value/EntityReferenceValue'
import { Cardinality } from '@/modules/connection/model/schema/Cardinality'

export class EntityConverter {
    convert(entity: GrpcSealedEntity): Entity {
        return new Entity(
            Value.of(entity.entityType),
            Value.of(entity.primaryKey),
            Value.of(entity.version),
            Value.of(entity.schemaVersion),
            Value.of(entity.parent),
            Value.of(
                entity.parentReference
                    ? this.convertParentReference(entity.parentReference)
                    : undefined
            ),
            Value.of(this.convertGlobalAttributes(entity.globalAttributes)),
            Value.of(
                this.convertLocalizedAttributes(entity.localizedAttributes)
            ),
            Value.of(this.convertReferences(entity.references)),
            Value.of(
                this.convertPriceInnerHandling(entity.priceInnerRecordHandling)
            ),
            Value.of(
                this.convertEvitaAssociatedDataValue(
                    entity.globalAssociatedData
                )
            ),
            Value.of(
                this.convertLocalizedAssociatedData(
                    entity.localizedAssociatedData
                )
            ),
            Value.of(this.convertLocale(entity.locales)),
            Value.of(this.convertPrice(entity.prices))
        )
    }

    private convertParentReference(
        parentReference: GrpcEntityReferenceWithParent
    ): EntityReferenceWithParent {
        return new EntityReferenceWithParent(
            Value.of(parentReference.entityType),
            Value.of(parentReference.primaryKey),
            Value.of(parentReference.version),
            parentReference.parent
                ? Value.of(this.convertParentReference(parentReference.parent))
                : undefined
        )
    }

    private convertGlobalAttributes(grpcGlobalAttribtes: {
        [key: string]: GrpcEvitaValue
    }): object[] {
        const newGlobalAttributes: object[] = []
        for (const globalAttribute in grpcGlobalAttribtes) {
            const attr = grpcGlobalAttribtes[globalAttribute]
            newGlobalAttributes.push(attr.value.value as object)
        }
        return newGlobalAttributes
    }

    private convertLocalizedAttributes(localizedAttribtes: {
        [key: string]: GrpcLocalizedAttribute
    }): LocalizedAttribute[] {
        const newlocalizedAttributes: LocalizedAttribute[] = []
        for (const localizedAttribute in localizedAttribtes) {
            const attr = localizedAttribtes[localizedAttribute]
            newlocalizedAttributes.push(
                new LocalizedAttribute(
                    Value.of(this.convertGlobalAttributes(attr.attributes))
                )
            )
        }
        return newlocalizedAttributes
    }

    private convertReferences(references: GrpcReference[]): Reference[] {
        const newReferences: Reference[] = []
        for (const reference of references) {
            newReferences.push(
                new Reference(
                    Value.of(reference.referenceName),
                    Value.of(reference.version),
                    Value.of(
                        reference.referencedEntityReference
                            ? this.convertReference(
                                  reference.referencedEntityReference
                              )
                            : undefined
                    ),
                    Value.of(
                        reference.referencedEntity ? this.convertReferencedEntity(reference.referencedEntity) : undefined
                    ),
                    Value.of(
                        this.convertCardinality(reference.referenceCardinality)
                    ),
                    reference.groupReferenceType.value ? this.convertGroupReference(reference.groupReferenceType.value) : undefined,
                    Value.of(
                        this.convertGlobalAttributes(reference.globalAttributes)
                    ),
                    Value.of(
                        this.convertLocalizedAttributes(
                            reference.localizedAttributes
                        )
                    )
                )
            )
        }
        return newReferences
    }

    private convertGroupReference(
        groupReference: GrpcEntityReference | GrpcSealedEntity | undefined
    ): EntityReference | SealedEntity {
        if (groupReference instanceof GrpcSealedEntity) {
            return this.convertReferencedEntity(groupReference as GrpcSealedEntity)
        } else {
            return this.convertReference(groupReference as GrpcEntityReference)
        }
    }

    private convertCardinality(cardinality: GrpcCardinality): Cardinality {
        switch (cardinality) {
            case GrpcCardinality.EXACTLY_ONE:
                return Cardinality.ExactlyOne
            case GrpcCardinality.NOT_SPECIFIED:
                return Cardinality.ExactlyOne
            case GrpcCardinality.ONE_OR_MORE:
                return Cardinality.OneOrMore
            case GrpcCardinality.ZERO_OR_MORE:
                return Cardinality.ZeroOrMore
            case GrpcCardinality.ZERO_OR_ONE:
                return Cardinality.ZeroOrOne
        }
    }

    private convertReferencedEntity(referencedEntity: GrpcSealedEntity): Entity {
        return new Entity(
            Value.of(referencedEntity.entityType),
            Value.of(referencedEntity.primaryKey),
            Value.of(referencedEntity.version),
            Value.of(referencedEntity.schemaVersion),
            Value.of(referencedEntity.parent),
            Value.of(
                referencedEntity.parentReference
                    ? this.convertParentReference(referencedEntity.parentReference)
                    : undefined
            ),
            Value.of(
                this.convertGlobalAttributes(referencedEntity.globalAttributes)
            ),
            Value.of(
                this.convertLocalizedAttributes(
                    referencedEntity.localizedAttributes
                )
            ),
            Value.of(this.convertReferences(referencedEntity.references)),
            Value.of(
                this.convertPriceInnerHandling(
                    referencedEntity.priceInnerRecordHandling
                )
            ),
            Value.of(
                this.convertEvitaAssociatedDataValue(
                    referencedEntity.globalAssociatedData
                )
            ),
            Value.of(
                this.convertLocalizedAssociatedData(
                    referencedEntity.localizedAssociatedData
                )
            ),
            Value.of(this.convertLocale(referencedEntity.locales)),
            Value.of(this.convertPrice(referencedEntity.prices))
        )
    }

    private convertPriceInnerHandling(
        price: GrpcPriceInnerRecordHandling
    ): PriceInnerRecordHandling {
        switch (price) {
            case GrpcPriceInnerRecordHandling.LOWEST_PRICE:
                return PriceInnerRecordHandling.LOWEST_PRICE
            case GrpcPriceInnerRecordHandling.NONE:
                return PriceInnerRecordHandling.NONE
            case GrpcPriceInnerRecordHandling.SUM:
                return PriceInnerRecordHandling.SUM
            case GrpcPriceInnerRecordHandling.UNKNOWN:
                return PriceInnerRecordHandling.UNKNOWN
        }
    }

    private convertEvitaAssociatedDataValue(associatedData: {
        [key: string]: GrpcEvitaAssociatedDataValue
    }): EvitaAssociatedDataValue[] {
        const evitaAssociatedValues: EvitaAssociatedDataValue[] = []
        for (const associatedValueName in associatedData) {
            const associatedValue = associatedData[associatedValueName]
            evitaAssociatedValues.push(
                new EvitaAssociatedDataValue(
                    associatedValue.value,
                    associatedValue.version
                )
            )
        }
        return evitaAssociatedValues
    }

    private convertLocalizedAssociatedData(localizedAssociatedData: {
        [key: string]: GrpcLocalizedAssociatedData
    }): LocalizedAssociatedData[] {
        const newLocalizedAssociatedData: LocalizedAssociatedData[] = []
        for (const localizedAssociatedName in localizedAssociatedData) {
            const localizedAssocaitedValue =
                localizedAssociatedData[localizedAssociatedName]
            const evitaAssociatedValues: EvitaAssociatedDataValue[] = []
            for (const dataName in localizedAssocaitedValue.associatedData) {
                const associatedData =
                    localizedAssocaitedValue.associatedData[dataName]
                evitaAssociatedValues.push(
                    new EvitaAssociatedDataValue(
                        associatedData.value.value as object,
                        associatedData.version
                    )
                )
            }
            newLocalizedAssociatedData.push(
                new LocalizedAssociatedData(evitaAssociatedValues)
            )
        }
        return newLocalizedAssociatedData
    }

    private convertLocale(locales: GrpcLocale[]): Locale[] {
        const newLocales: Locale[] = []
        for (const locale of locales) {
            newLocales.push(new Locale(locale.languageTag))
        }
        return newLocales
    }

    private convertPrice(prices: GrpcPrice[]): Price[] {
        const newPrices: Price[] = []
        for (const price of prices) {
            newPrices.push(
                new Price(
                    Value.of(price.priceId),
                    Value.of(price.priceList),
                    Value.of(price.innerRecordId),
                    Value.of(price.priceWithoutTax?.valueString as BigDecimal),
                    Value.of(price.taxRate?.valueString as BigDecimal),
                    Value.of(price.priceWithTax?.valueString as BigDecimal),
                    Value.of(
                        price.validity
                            ? this.convertToDateTimeRange(price.validity)
                            : undefined
                    ),
                    Value.of(price.sellable),
                    Value.of(price.version)
                )
            )
        }
        return newPrices
    }

    private convertToDateTimeRange(
        dateTimeRange: GrpcDateTimeRange
    ): DateTimeRange {
        const defaultZoneOffset: string = 'UTC'
        const fromSet = !!dateTimeRange.from
        const toSet = !!dateTimeRange.to
        const fromTimestamp = dateTimeRange.from?.timestamp?.seconds ?? 0
        const toTimestamp = dateTimeRange.to?.timestamp?.seconds ?? 0

        const from = OffsetDateTime.ofInstant(
            fromTimestamp as bigint,
            fromSet
                ? dateTimeRange.from?.offset ?? defaultZoneOffset
                : defaultZoneOffset
        )
        const to = OffsetDateTime.ofInstant(
            toTimestamp as bigint,
            toSet
                ? dateTimeRange.to?.offset ?? defaultZoneOffset
                : defaultZoneOffset
        )

        if (!fromSet && toSet) {
            return DateTimeRange.until(to)
        } else if (fromSet && !toSet) {
            return DateTimeRange.since(from)
        }
        return DateTimeRange.between(from, to)
    }

    private convertReference(
        referencedEntity: GrpcEntityReference
    ): EntityReference {
        return new EntityReference(
            Value.of(referencedEntity.entityType),
            Value.of(referencedEntity.primaryKey),
            Value.of(referencedEntity.version)
        )
    }
}
