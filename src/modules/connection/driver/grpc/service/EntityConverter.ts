import { GrpcLocalizedAttribute } from '@/modules/connection/driver/grpc/gen/GrpcAttribute_pb'
import {
    GrpcEntityReference,
    GrpcEntityReferenceWithParent,
    GrpcReference,
    GrpcSealedEntity,
} from '@/modules/connection/driver/grpc/gen/GrpcEntity_pb'
import {
    GrpcBigDecimal,
    GrpcBigDecimalArray,
    GrpcBigDecimalNumberRange,
    GrpcBigDecimalNumberRangeArray,
    GrpcBooleanArray,
    GrpcCurrency,
    GrpcCurrencyArray,
    GrpcDateTimeRange,
    GrpcDateTimeRangeArray,
    GrpcEvitaAssociatedDataValue,
    GrpcEvitaValue,
    GrpcIntegerArray,
    GrpcIntegerNumberRange,
    GrpcIntegerNumberRangeArray,
    GrpcLocale,
    GrpcLocaleArray,
    GrpcLongArray,
    GrpcLongNumberRange,
    GrpcLongNumberRangeArray,
    GrpcOffsetDateTime,
    GrpcOffsetDateTimeArray,
    GrpcPredecessor,
    GrpcStringArray,
    GrpcUuid,
    GrpcUuidArray,
} from '@/modules/connection/driver/grpc/gen/GrpcEvitaDataTypes_pb'
import { Entity } from '@/modules/connection/model/data/Entity'
import { EntityReferenceWithParent } from '@/modules/connection/model/data/EntityReferenceWithParent'
import { LocalizedAttribute } from '@/modules/connection/model/data/LocalizedAttribute'
import { Reference } from '@/modules/connection/model/data/Reference'
import { Value } from '@/modules/connection/model/Value'
import {
    GrpcCardinality,
    GrpcEvitaDataType,
    GrpcPriceInnerRecordHandling,
} from '@/modules/connection/driver/grpc/gen/GrpcEnums_pb'
import { EvitaAssociatedDataValue } from '@/modules/connection/model/data/EvitaAssociatedDataValue'
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
import { DateTimeRange } from '@/modules/connection/model/data-type/DateTimeRange'
import { OffsetDateTime } from '@/modules/connection/model/data-type/OffsetDateTime'
import { DateTime } from 'luxon'
import { LocalDate } from '@/modules/connection/model/data-type/LocalDate'
import { LocalTime } from '@/modules/connection/model/data-type/LocalTime'
import { Range } from '@/modules/connection/model/data-type/Range'
import { Uuid } from '@/modules/connection/model/data-type/Uuid'
import { Currency } from '@/modules/connection/model/data/Currency'
import { Predecessor } from '@/modules/connection/model/data-type/Predecessor'
import { EvitaValue } from '@/modules/connection/model/data/EvitaValue'
import { ScalarConverter } from './ScalarConverter'
import { LocalDateTime } from '@/modules/connection/model/data-type/LocalDateTime'

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
            Value.of(new BigDecimal(price.priceWithoutTax?.valueString)),
            Value.of(new BigDecimal(price.taxRate?.valueString)),
            Value.of(new BigDecimal(price.priceWithTax?.valueString)),
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
            if (attr.value.value) {
                newGlobalAttributes.set(
                    locale,
                    new EvitaValue(
                        this.convertAttributeValue(attr.type, attr.value.value),
                        ScalarConverter.convertScalar(attr.type)
                    )
                )
            }
        }
        return Immutable.Map(newGlobalAttributes)
    }

    private convertAttributeValue(
        type: GrpcEvitaDataType,
        value:
            | string
            | number
            | bigint
            | boolean
            | GrpcBigDecimal
            | GrpcDateTimeRange
            | GrpcIntegerNumberRange
            | GrpcLongNumberRange
            | GrpcBigDecimalNumberRange
            | GrpcOffsetDateTime
            | GrpcLocale
            | GrpcCurrency
            | GrpcUuid
            | GrpcPredecessor
            | GrpcStringArray
            | GrpcIntegerArray
            | GrpcLongArray
            | GrpcBooleanArray
            | GrpcBigDecimalArray
            | GrpcDateTimeRangeArray
            | GrpcIntegerNumberRangeArray
            | GrpcLongNumberRangeArray
            | GrpcBigDecimalNumberRangeArray
            | GrpcOffsetDateTimeArray
            | GrpcLocaleArray
            | GrpcCurrencyArray
            | GrpcUuidArray
            | GrpcOffsetDateTime
    ): any {
        switch (type) {
            case GrpcEvitaDataType.STRING:
            case GrpcEvitaDataType.BYTE:
            case GrpcEvitaDataType.SHORT:
            case GrpcEvitaDataType.INTEGER:
            case GrpcEvitaDataType.LONG:
            case GrpcEvitaDataType.BOOLEAN:
            case GrpcEvitaDataType.CHARACTER:
                return value
            case GrpcEvitaDataType.BIG_DECIMAL: {
                const grpcValue: GrpcBigDecimal = value as GrpcBigDecimal
                return new BigDecimal(grpcValue.valueString)
            }
            case GrpcEvitaDataType.LOCAL_DATE_TIME: {
                const offsetDateTime: GrpcOffsetDateTime =
                    value as GrpcOffsetDateTime
                return this.convertDateTime(offsetDateTime)
            }
            case GrpcEvitaDataType.OFFSET_DATE_TIME: {
                const offsetDateTime: GrpcOffsetDateTime =
                    value as GrpcOffsetDateTime
                return this.convertOffsetDateTime(offsetDateTime)
            }
            case GrpcEvitaDataType.LOCAL_DATE: {
                const offsetDateTime: GrpcOffsetDateTime =
                    value as GrpcOffsetDateTime
                return this.convertDate(offsetDateTime)
            }
            case GrpcEvitaDataType.LOCAL_TIME: {
                const grpcTime: GrpcOffsetDateTime = value as GrpcOffsetDateTime
                return this.convertTime(grpcTime)
            }
            case GrpcEvitaDataType.DATE_TIME_RANGE: {
                const datetimeRange: GrpcDateTimeRange =
                    value as GrpcDateTimeRange
                if (
                    this.checkDateTimeValidity(
                        datetimeRange.from,
                        datetimeRange.to,
                        false
                    )
                )
                    throw new Error(
                        'DateTimeRange has undefined prop from or to'
                    )
                else
                    return new DateTimeRange(
                        new OffsetDateTime(
                            datetimeRange.from?.timestamp,
                            datetimeRange.from?.offset
                        ),
                        new OffsetDateTime(
                            datetimeRange.to?.timestamp,
                            datetimeRange.to?.offset
                        )
                    )
            }
            case GrpcEvitaDataType.BIG_DECIMAL_NUMBER_RANGE: {
                const decimalRange: GrpcBigDecimalNumberRange =
                    value as GrpcBigDecimalNumberRange
                const range: Range<BigDecimal> = [
                    new BigDecimal(decimalRange.from?.valueString),
                    new BigDecimal(decimalRange.to?.valueString),
                ]
                return range
            }
            case GrpcEvitaDataType.LONG_NUMBER_RANGE: {
                const longRange: GrpcLongNumberRange =
                    value as GrpcLongNumberRange
                if (this.checkNumberRangeValidity(longRange.from, longRange.to))
                    throw new Error(
                        'LongRangeNumber has undefined prop from and to'
                    )
                const range: Range<bigint> = [longRange.from, longRange.to]
                return range
            }
            case GrpcEvitaDataType.INTEGER_NUMBER_RANGE: {
                const integerRange: GrpcIntegerNumberRange =
                    value as GrpcIntegerNumberRange
                if (
                    this.checkNumberRangeValidity(
                        integerRange.from,
                        integerRange.to
                    )
                )
                    throw new Error(
                        'IntegerRangeNumber has undefined prop from and to'
                    )
                const range: Range<number> = [
                    integerRange.from,
                    integerRange.to,
                ]
                return range
            }
            case GrpcEvitaDataType.SHORT_NUMBER_RANGE: {
                const shortRange: GrpcIntegerNumberRange =
                    value as GrpcIntegerNumberRange
                if (
                    this.checkNumberRangeValidity(
                        shortRange.from,
                        shortRange.to
                    )
                )
                    throw new Error(
                        'ShortRangeNumber has undefined prop from and to'
                    )
                const range: Range<number> = [shortRange.from, shortRange.to]
                return range
            }
            case GrpcEvitaDataType.BYTE_NUMBER_RANGE: {
                const byteRange: GrpcIntegerNumberRange =
                    value as GrpcIntegerNumberRange
                if (this.checkNumberRangeValidity(byteRange.from, byteRange.to))
                    throw new Error(
                        'ByteRangeNumber has undefined prop from and to'
                    )
                const range: Range<number> = [byteRange.from, byteRange.to]
                return range
            }
            case GrpcEvitaDataType.LOCALE: {
                const grpcLocale: GrpcLocale = value as GrpcLocale
                return new Locale(grpcLocale.languageTag)
            }
            case GrpcEvitaDataType.CURRENCY: {
                const grpcCurrency: GrpcCurrency = value as GrpcCurrency
                return new Currency(grpcCurrency.code)
            }
            case GrpcEvitaDataType.UUID: {
                const grpcUuid: GrpcUuid = value as GrpcUuid
                const uuid: Uuid = {
                    code: grpcUuid.toJsonString(),
                }
                return uuid
            }
            case GrpcEvitaDataType.PREDECESSOR: {
                const grpcPredecessor: GrpcPredecessor =
                    value as GrpcPredecessor
                const predecessor: Predecessor = {
                    head: grpcPredecessor.head,
                    predecessorId: grpcPredecessor.predecessorId,
                }
                return predecessor
            }
            case GrpcEvitaDataType.STRING_ARRAY: {
                const grpcStringArray: GrpcStringArray =
                    value as GrpcStringArray
                return Immutable.List(grpcStringArray.value)
            }
            case GrpcEvitaDataType.BYTE_ARRAY: {
                const grpcByteArray: GrpcIntegerArray =
                    value as GrpcIntegerArray
                return Immutable.List(grpcByteArray.value)
            }
            case GrpcEvitaDataType.SHORT_ARRAY: {
                const grpcShortArray: GrpcIntegerArray =
                    value as GrpcIntegerArray
                return Immutable.List(grpcShortArray.value)
            }
            case GrpcEvitaDataType.INTEGER_ARRAY: {
                const grpcIntegerArray: GrpcIntegerArray =
                    value as GrpcIntegerArray
                return Immutable.List(grpcIntegerArray.value)
            }
            case GrpcEvitaDataType.LONG_ARRAY: {
                const grpcLongArray: GrpcLongArray = value as GrpcLongArray
                return Immutable.List(grpcLongArray.value)
            }
            case GrpcEvitaDataType.BOOLEAN_ARRAY: {
                const grpcBooleanArray: GrpcBooleanArray =
                    value as GrpcBooleanArray
                return Immutable.List(grpcBooleanArray.value)
            }
            case GrpcEvitaDataType.CHARACTER_ARRAY: {
                const grpcCharacterArray: GrpcIntegerArray =
                    value as GrpcIntegerArray
                return Immutable.List(grpcCharacterArray.value)
            }
            case GrpcEvitaDataType.BIG_DECIMAL_ARRAY: {
                const grpcDecimalArray: GrpcBigDecimalArray =
                    value as GrpcBigDecimalArray
                const newBigDecimalArray: BigDecimal[] = []
                for (const grpcDecimal of grpcDecimalArray.value) {
                    newBigDecimalArray.push(
                        new BigDecimal(grpcDecimal.valueString)
                    )
                }
                return Immutable.List(newBigDecimalArray)
            }
            case GrpcEvitaDataType.OFFSET_DATE_TIME_ARRAY: {
                const grpcDateTimeArray: GrpcOffsetDateTimeArray =
                    value as GrpcOffsetDateTimeArray
                const offsetDateTimeArray: LocalDateTime[] = []
                for (const grpcDateTime of grpcDateTimeArray.value) {
                    offsetDateTimeArray.push(this.convertDateTime(grpcDateTime))
                }
                return Immutable.List(offsetDateTimeArray)
            }
            case GrpcEvitaDataType.LOCAL_DATE_TIME_ARRAY: {
                const grpcDateTimeArray: GrpcOffsetDateTimeArray =
                    value as GrpcOffsetDateTimeArray
                const localeDateTimeArray: LocalDateTime[] = []
                for (const grpcDateTime of grpcDateTimeArray.value) {
                    localeDateTimeArray.push(this.convertDateTime(grpcDateTime))
                }
                return Immutable.List(localeDateTimeArray)
            }
            case GrpcEvitaDataType.LOCAL_DATE_ARRAY: {
                const grpcLocalDateArray: GrpcOffsetDateTimeArray =
                    value as GrpcOffsetDateTimeArray
                const localDateArray: LocalDate[] = []
                for (const localDate of grpcLocalDateArray.value) {
                    localDateArray.push(this.convertDate(localDate))
                }
                return Immutable.List(localDateArray)
            }
            case GrpcEvitaDataType.LOCAL_TIME_ARRAY: {
                const grpcLocalTimeArray: GrpcOffsetDateTimeArray =
                    value as GrpcOffsetDateTimeArray
                const localTimeArray: LocalTime[] = []
                for (const localTime of grpcLocalTimeArray.value) {
                    localTimeArray.push(this.convertTime(localTime))
                }
                return Immutable.List(localTimeArray)
            }
            case GrpcEvitaDataType.DATE_TIME_RANGE_ARRAY: {
                const grpcDateTimeRangeArray: GrpcDateTimeRangeArray =
                    value as GrpcDateTimeRangeArray
                const dateTimeRange: DateTimeRange[] = []
                for (const grpcDateTimeRange of grpcDateTimeRangeArray.value) {
                    if (
                        this.checkDateTimeValidity(
                            grpcDateTimeRange.from,
                            grpcDateTimeRange.to,
                            false
                        )
                    ) {
                        dateTimeRange.push(
                            new DateTimeRange(
                                new OffsetDateTime(
                                    grpcDateTimeRange.from?.timestamp,
                                    grpcDateTimeRange.from?.offset
                                ),
                                new OffsetDateTime(
                                    grpcDateTimeRange.to?.timestamp,
                                    grpcDateTimeRange.to?.offset
                                )
                            )
                        )
                    }
                }
                return Immutable.List(dateTimeRange)
            }
            case GrpcEvitaDataType.BIG_DECIMAL_NUMBER_RANGE_ARRAY: {
                const grpcBigDecimalNumberRangeArray: GrpcBigDecimalNumberRangeArray =
                    value as GrpcBigDecimalNumberRangeArray
                const bigDecimalRange: Range<BigDecimal>[] = []
                for (const grpcBigDecimalRange of grpcBigDecimalNumberRangeArray.value) {
                    bigDecimalRange.push([
                        new BigDecimal(grpcBigDecimalRange.from?.valueString),
                        new BigDecimal(grpcBigDecimalRange.to?.valueString),
                    ])
                }
                return Immutable.List(bigDecimalRange)
            }
            case GrpcEvitaDataType.LONG_NUMBER_RANGE_ARRAY: {
                const grpcLongNumberRangeArray: GrpcLongNumberRangeArray =
                    value as GrpcLongNumberRangeArray
                const longNumberRangeArray: Range<bigint>[] = []
                for (const grpcLongRange of grpcLongNumberRangeArray.value) {
                    longNumberRangeArray.push([
                        grpcLongRange.from,
                        grpcLongRange.to,
                    ])
                }
                return Immutable.List(longNumberRangeArray)
            }
            case GrpcEvitaDataType.INTEGER_NUMBER_RANGE_ARRAY: {
                const grpcIntegerNumberRangeArray: GrpcIntegerNumberRangeArray =
                    value as GrpcIntegerNumberRangeArray
                const integerNumberRangeArray: Range<number>[] = []
                for (const grpcIntegerNumber of grpcIntegerNumberRangeArray.value) {
                    integerNumberRangeArray.push([
                        grpcIntegerNumber.from,
                        grpcIntegerNumber.to,
                    ])
                }
                return Immutable.List(integerNumberRangeArray)
            }
            case GrpcEvitaDataType.SHORT_NUMBER_RANGE_ARRAY: {
                const grpcShortNumberRangeArray: GrpcIntegerNumberRangeArray =
                    value as GrpcIntegerNumberRangeArray
                const shortNumberRangeArray: Range<number>[] = []
                for (const grpcShortNumberRange of grpcShortNumberRangeArray.value) {
                    shortNumberRangeArray.push([
                        grpcShortNumberRange.from,
                        grpcShortNumberRange.to,
                    ])
                }
                return Immutable.List(shortNumberRangeArray)
            }
            case GrpcEvitaDataType.BYTE_NUMBER_RANGE_ARRAY: {
                const grpcByteNumberRangeArray: GrpcIntegerNumberRangeArray =
                    value as GrpcIntegerNumberRangeArray
                const byteNumberRangeArray: Range<number>[] = []
                for (const grpcIntegerNumber of grpcByteNumberRangeArray.value) {
                    byteNumberRangeArray.push([
                        grpcIntegerNumber.from,
                        grpcIntegerNumber.to,
                    ])
                }
                return Immutable.List(byteNumberRangeArray)
            }
            case GrpcEvitaDataType.LOCALE_ARRAY: {
                const grpcLocaleArray: GrpcLocaleArray =
                    value as GrpcLocaleArray
                const localeArray: Locale[] = []
                for (const locale of grpcLocaleArray.value) {
                    localeArray.push(new Locale(locale.languageTag))
                }
                return Immutable.List(localeArray)
            }
            case GrpcEvitaDataType.CURRENCY_ARRAY: {
                const grpcCurrencyArray: GrpcCurrencyArray =
                    value as GrpcCurrencyArray
                const currencyArray: Currency[] = []
                for (const currency of grpcCurrencyArray.value) {
                    currencyArray.push(new Currency(currency.code))
                }
                return Immutable.List(currencyArray)
            }
            case GrpcEvitaDataType.UUID_ARRAY: {
                const grpcUuidArray: GrpcUuidArray = value as GrpcUuidArray
                const uuidArray: Uuid[] = []
                for (const uuid of grpcUuidArray.value) {
                    uuidArray.push({ code: uuid.toJsonString() })
                }
                return Immutable.List(uuidArray)
            }
            default:
                throw new Error('Not accepted type')
        }
    }

    private convertDate(offsetDateTime: OffsetDateTime): LocalDate {
        if (!offsetDateTime.timestamp) {
            throw new Error('Missing prop timestamp')
        }
        const localDate: LocalDate = {
            isoDate: DateTime.fromSeconds(
                Number(offsetDateTime.timestamp.seconds)
            ).toISODate(),
        }
        return localDate
    }

    private convertDateTime(offsetDateTime: GrpcOffsetDateTime): LocalDateTime {
        if (!offsetDateTime.timestamp) {
            throw new Error('Missing prop timestamp')
        }
        return new LocalDateTime(
            DateTime.fromSeconds(
                Number(offsetDateTime.timestamp.seconds)
            ).toISO()
        )
    }

    private checkDateTimeValidity(
        from: GrpcOffsetDateTime | undefined,
        to: GrpcOffsetDateTime | undefined,
        hasOffset: boolean
    ): boolean {
        if (!from && !to) return false
        else if (from && to && !from.timestamp && !to.timestamp) return false
        else if (
            hasOffset &&
            ((from && from.timestamp && !from.offset) ||
                (to && to.timestamp && !to.offset))
        )
            return false
        else return true
    }

    private convertOffsetDateTime(
        offsetDateTime: GrpcOffsetDateTime
    ): OffsetDateTime {
        if (!offsetDateTime.timestamp) {
            throw new Error('Missing prop timestamp')
        }
        return new OffsetDateTime(
            offsetDateTime.timestamp,
            offsetDateTime.offset
        )
    }
    private checkNumberRangeValidity(
        from: number | bigint | undefined,
        to: number | bigint | undefined
    ): boolean {
        if (!from && !to) {
            return false
        } else {
            return true
        }
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

    private convertTime(grpcTime: GrpcOffsetDateTime): LocalTime {
        if (!grpcTime.timestamp) {
            throw new Error('Missing prop timestamp')
        }
        const localTime: LocalTime = {
            isoTime: DateTime.fromSeconds(
                Number(grpcTime.timestamp.seconds)
            ).toISOTime(),
        }
        return localTime
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
                        ? this.convert(reference.referencedEntity)
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
