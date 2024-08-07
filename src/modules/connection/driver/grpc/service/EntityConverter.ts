import { GrpcLocalizedAttribute } from '@/modules/connection/driver/grpc/gen/GrpcAttribute_pb'
import {
    GrpcEntityReference,
    GrpcEntityReferenceWithParent,
    GrpcReference,
    GrpcSealedEntity,
} from '@/modules/connection/driver/grpc/gen/GrpcEntity_pb'
import {
    GrpcEvitaAssociatedDataValue,
    GrpcEvitaValue,
    GrpcLocale
} from '@/modules/connection/driver/grpc/gen/GrpcEvitaDataTypes_pb'
import { Entity } from '@/modules/connection/model/data/Entity'
import { EntityReferenceWithParent } from '@/modules/connection/model/data/EntityReferenceWithParent'
import { LocalizedAttribute } from '@/modules/connection/model/data/LocalizedAttribute'
import { Reference } from '@/modules/connection/model/data/Reference'
import { Value } from '@/modules/connection/model/Value'
import {
    GrpcCardinality,
    GrpcEvitaAssociatedDataDataType_GrpcEvitaDataType,
    GrpcPriceInnerRecordHandling,
} from '@/modules/connection/driver/grpc/gen/GrpcEnums_pb'
import { GrpcLocalizedAssociatedData } from '@/modules/connection/driver/grpc/gen/GrpcAssociatedData_pb'
import { LocalizedAssociatedData } from '@/modules/connection/model/data/LocalizedAssociatedData'
import { Locale } from '@/modules/connection/model/data-type/Locale'
import { GrpcPrice } from '@/modules/connection/driver/grpc/gen/GrpcPrice_pb'
import { Price } from '@/modules/connection/model/data/Price'
import { BigDecimal } from '@/modules/connection/model/data-type/BigDecimal'
import { DateTimeUtil as DateTimeUtil } from '@/modules/connection/driver/grpc/utils/DateTimeUtil'
import { PriceInnerRecordHandling } from '@/modules/connection/model/data-type/PriceInnerRecordHandling'
import { EntityReference } from '@/modules/connection/model/data/EntityReference'
import { Cardinality } from '@/modules/connection/model/schema/Cardinality'
import Immutable from 'immutable'
import { Currency } from '@/modules/connection/model/data/Currency'
import { EvitaValueConvert } from './EvitaValueConverter'

//TODO: Add documentation
export class EntityConverter {
    private readonly evitaValueConverter: EvitaValueConvert;

    constructor(evitaValueConverter: EvitaValueConvert){
        this.evitaValueConverter = evitaValueConverter
    }

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
            Value.of(new BigDecimal(price.priceWithoutTax?.valueString)),
            Value.of(new BigDecimal(price.taxRate?.valueString)),
            Value.of(new BigDecimal(price.priceWithTax?.valueString)),
            Value.of(
                price.validity
                    ? DateTimeUtil.convertToDateTimeRange(price.validity)
                    : undefined
            ),
            Value.of(price.sellable),
            Value.of(price.version),
            Value.of(new Currency(price.currency?.code!))
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
        for (const attributeName in grpcGlobalAttribtes) {
            const attr = grpcGlobalAttribtes[attributeName]
            if (attr.value.value) {
                newGlobalAttributes.set(
                    attributeName,
                    this.evitaValueConverter.convertEvitaValue(attr)
                )
            }
        }
        return Immutable.Map(newGlobalAttributes)
    }

    private convertLocalizedAttributes(localizedAttributes: {
        [key: string]: GrpcLocalizedAttribute
    }): Immutable.Map<string, LocalizedAttribute> {
        const newLocalizedAttributes: Map<string, LocalizedAttribute> = new Map<
            string,
            LocalizedAttribute
        >()
        for (const locale in localizedAttributes) {
            const attr = localizedAttributes[locale]
            const convertedAttributes = this.convertGlobalAttributes(
                attr.attributes
            )
            newLocalizedAttributes.set(
                locale,
                new LocalizedAttribute(Value.of(convertedAttributes))
            )
        }
        return Immutable.Map(newLocalizedAttributes)
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
                    Value.of(
                        reference.referencedEntityReference
                            ? this.convertReference(
                                  reference.referencedEntityReference
                              )
                            : undefined
                    ),
                    Value.of(
                        reference.referencedEntity
                            ? this.convert(reference.referencedEntity)
                            : undefined
                    ),
                    Value.of(
                        this.convertCardinality(reference.referenceCardinality)
                    ),
                    Value.of(
                        reference.groupReferenceType.value
                            ? this.convertGroupReference(
                                  reference.groupReferenceType.value
                              )
                            : undefined
                    ),
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
            return this.convert(groupReference as GrpcSealedEntity)
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
    }): Immutable.Map<string, any> {
        const evitaAssociatedValues: Map<string, any> = new Map<string, any>()
        for (const associatedValueName in associatedData) {
            const associatedValue = associatedData[associatedValueName]
            evitaAssociatedValues.set(
                associatedValueName,
                this.convertAssociatedDataValue(associatedValue)
            )
        }
        return Immutable.Map(evitaAssociatedValues)
    }

    private convertAssociatedDataValue(
        value: GrpcEvitaAssociatedDataValue
    ): object {
        if (
            value.type ===
            GrpcEvitaAssociatedDataDataType_GrpcEvitaDataType.COMPLEX_DATA_OBJECT
        ) {
            return JSON.parse(value.value.value as string)
        } else {
            return this.evitaValueConverter.convertEvitaValue(value.value.value)
        }
    }

    private convertLocalizedAssociatedData(localizedAssociatedData: {
        [key: string]: GrpcLocalizedAssociatedData
    }): Immutable.Map<string, LocalizedAssociatedData> {
        const newLocalizedAssociatedData: Map<string, LocalizedAssociatedData> =
            new Map<string, LocalizedAssociatedData>()
        for (const localizedAssociatedName in localizedAssociatedData) {
            const localizedAssocaitedValue =
                localizedAssociatedData[localizedAssociatedName]
            const evitaAssociatedValues: Map<string, any> = new Map<
                string,
                any
            >()
            for (const dataName in localizedAssocaitedValue.associatedData) {
                const associatedData =
                    localizedAssocaitedValue.associatedData[dataName]
                evitaAssociatedValues.set(
                    dataName,
                    this.convertAssociatedDataValue(associatedData)
                )
            }
            newLocalizedAssociatedData.set(
                localizedAssociatedName,
                new LocalizedAssociatedData(
                    Immutable.Map(evitaAssociatedValues)
                )
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
                    Value.of(
                        new BigDecimal(price.priceWithoutTax?.valueString)
                    ),
                    Value.of(new BigDecimal(price.taxRate?.valueString)),
                    Value.of(new BigDecimal(price.priceWithTax?.valueString)),
                    Value.of(
                        price.validity
                            ? DateTimeUtil.convertToDateTimeRange(
                                  price.validity
                              )
                            : undefined
                    ),
                    Value.of(price.sellable),
                    Value.of(price.version),
                    Value.of(new Currency(price.currency?.code!))
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
