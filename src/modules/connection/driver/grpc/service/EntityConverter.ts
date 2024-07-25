import { GrpcLocalizedAttribute } from '@/gen/GrpcAttribute_pb'
import {
    GrpcEntityReference,
    GrpcEntityReferenceWithParent,
    GrpcReference,
    GrpcSealedEntity,
} from '@/gen/GrpcEntity_pb'
import {
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
import { datetime as DateTimeUtil } from '@/utils/datetime'
import { PriceInnerRecordHandling } from '@/modules/connection/model/data-type/PriceInnerRecordHandling'
import { EntityReference } from '@/modules/connection/model/data/EntityReference'
import { Cardinality } from '@/modules/connection/model/schema/Cardinality'
import Immutable from 'immutable'

//TODO: Add documentation
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
            Value.of(this.convertPrice(entity.prices)),
            Value.of(
                entity.priceForSale
                    ? this.convertPriceForSale(entity.priceForSale)
                    : undefined
            )
        )
    }

    private convertPriceForSale(price: GrpcPrice): Price {
        return new Price(
            Value.of(price.priceId),
            Value.of(price.priceList),
            Value.of(price.innerRecordId),
            Value.of(price.priceWithoutTax?.valueString as BigDecimal),
            Value.of(price.taxRate?.valueString as BigDecimal),
            Value.of(price.priceWithTax?.valueString as BigDecimal),
            Value.of(
                price.validity
                    ? DateTimeUtil.convertToDateTimeRange(price.validity)
                    : undefined
            ),
            Value.of(price.sellable),
            Value.of(price.version)
        )
    }

    private convertParentReference(
        parentReference: GrpcEntityReferenceWithParent
    ): EntityReferenceWithParent {
        return new EntityReferenceWithParent(
            Value.of(parentReference.entityType),
            Value.of(parentReference.primaryKey),
            Value.of(parentReference.version),
            Value.of(
                parentReference.parent
                    ? this.convertParentReference(parentReference.parent)
                    : undefined
            )
        )
    }

    private convertGlobalAttributes(grpcGlobalAttribtes: {
        [key: string]: GrpcEvitaValue
    }): Immutable.Map<string, object> {
        const newGlobalAttributes: Map<string, object> = new Map<
            string,
            object
        >()
        for (const locale in grpcGlobalAttribtes) {
            const attr = grpcGlobalAttribtes[locale]
            newGlobalAttributes.set(locale, attr.value.value as object)
        }
        return Immutable.Map(newGlobalAttributes)
    }

    private convertLocalizedAttributes(localizedAttribtes: {
        [key: string]: GrpcLocalizedAttribute
    }): Immutable.Map<string, LocalizedAttribute> {
        const newlocalizedAttributes: Map<string, LocalizedAttribute> = new Map<
            string,
            LocalizedAttribute
        >()
        for (const locale in localizedAttribtes) {
            const attr = localizedAttribtes[locale]
            newlocalizedAttributes.set(
                locale,
                new LocalizedAttribute(
                    Value.of(this.convertGlobalAttributes(attr.attributes))
                )
            )
        }
        return Immutable.Map(newlocalizedAttributes)
    }

    private convertReferences(
        references: GrpcReference[]
    ): Immutable.List<Reference> {
        const newReferences: Reference[] = []
        for (const reference of references) {
            newReferences.push(
                new Reference(
                    Value.of(reference.referenceName),
                    Value.of(reference.version),
                    reference.referencedEntityReference
                        ? this.convertReference(
                              reference.referencedEntityReference
                          )
                        : undefined,
                    reference.referencedEntity
                        ? this.convertReferencedEntity(
                              reference.referencedEntity
                          )
                        : undefined,
                    Value.of(
                        this.convertCardinality(reference.referenceCardinality)
                    ),
                    reference.groupReferenceType.value
                        ? this.convertGroupReference(
                              reference.groupReferenceType.value
                          )
                        : undefined,
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
        return Immutable.List(newReferences)
    }

    private convertGroupReference(
        groupReference: GrpcEntityReference | GrpcSealedEntity | undefined
    ): EntityReference | Entity {
        if (groupReference instanceof GrpcSealedEntity) {
            return this.convertReferencedEntity(
                groupReference as GrpcSealedEntity
            )
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

    private convertReferencedEntity(
        referencedEntity: GrpcSealedEntity
    ): Entity {
        return new Entity(
            Value.of(referencedEntity.entityType),
            Value.of(referencedEntity.primaryKey),
            Value.of(referencedEntity.version),
            Value.of(referencedEntity.schemaVersion),
            Value.of(referencedEntity.parent),
            Value.of(
                referencedEntity.parentReference
                    ? this.convertParentReference(
                          referencedEntity.parentReference
                      )
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
            Value.of(this.convertPrice(referencedEntity.prices)),
            Value.of(
                referencedEntity.priceForSale
                    ? this.convertPriceForSale(referencedEntity.priceForSale)
                    : undefined
            )
        )
    }

    private convertPriceInnerHandling(
        price: GrpcPriceInnerRecordHandling
    ): PriceInnerRecordHandling {
        switch (price) {
            case GrpcPriceInnerRecordHandling.LOWEST_PRICE:
                return PriceInnerRecordHandling.LowestPrice
            case GrpcPriceInnerRecordHandling.NONE:
                return PriceInnerRecordHandling.None
            case GrpcPriceInnerRecordHandling.SUM:
                return PriceInnerRecordHandling.Sum
            case GrpcPriceInnerRecordHandling.UNKNOWN:
                return PriceInnerRecordHandling.Unknown
        }
    }

    private convertEvitaAssociatedDataValue(associatedData: {
        [key: string]: GrpcEvitaAssociatedDataValue
    }): Immutable.Map<string, EvitaAssociatedDataValue> {
        const evitaAssociatedValues: Map<string, EvitaAssociatedDataValue> =
            new Map<string, EvitaAssociatedDataValue>()
        for (const associatedValueName in associatedData) {
            const associatedValue = associatedData[associatedValueName]
            evitaAssociatedValues.set(
                associatedValueName,
                new EvitaAssociatedDataValue(
                    associatedValue.value,
                    associatedValue.version
                )
            )
        }
        return Immutable.Map(evitaAssociatedValues)
    }

    private convertLocalizedAssociatedData(localizedAssociatedData: {
        [key: string]: GrpcLocalizedAssociatedData
    }): Immutable.Map<string, LocalizedAssociatedData> {
        const newLocalizedAssociatedData: Map<string, LocalizedAssociatedData> =
            new Map<string, LocalizedAssociatedData>()
        for (const localizedAssociatedName in localizedAssociatedData) {
            const localizedAssocaitedValue =
                localizedAssociatedData[localizedAssociatedName]
            const evitaAssociatedValues: Map<string, EvitaAssociatedDataValue> =
                new Map<string, EvitaAssociatedDataValue>()
            for (const dataName in localizedAssocaitedValue.associatedData) {
                const associatedData =
                    localizedAssocaitedValue.associatedData[dataName]
                evitaAssociatedValues.set(
                    dataName,
                    new EvitaAssociatedDataValue(
                        associatedData.value.value as object,
                        associatedData.version
                    )
                )
            }
            newLocalizedAssociatedData.set(
                localizedAssociatedName,
                new LocalizedAssociatedData(Immutable.Map(evitaAssociatedValues))
            )
        }
        return Immutable.Map(newLocalizedAssociatedData)
    }

    private convertLocale(locales: GrpcLocale[]): Immutable.List<Locale> {
        const newLocales: Locale[] = []
        for (const locale of locales) {
            newLocales.push(new Locale(locale.languageTag))
        }
        return Immutable.List(newLocales)
    }

    private convertPrice(prices: GrpcPrice[]): Immutable.List<Price> {
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
                            ? DateTimeUtil.convertToDateTimeRange(
                                  price.validity
                              )
                            : undefined
                    ),
                    Value.of(price.sellable),
                    Value.of(price.version)
                )
            )
        }
        return Immutable.List(newPrices)
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
