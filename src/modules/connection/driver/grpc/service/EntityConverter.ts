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
import { LocalDateTime } from '@/modules/connection/model/data-type/LocalDateTime'
import { BigDecimalRange } from '@/modules/connection/model/data-type/BigDecimalRange'
import { IntegerRange } from '@/modules/connection/model/data-type/IntegerRange'
import { BigintRange } from '@/modules/connection/model/data-type/BigintRange'

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
                    this.convertAttributeValue(attr.type, attr.value.value)
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

            case GrpcEvitaDataType.BIG_DECIMAL:
                return this.handleBigDecimal(value as GrpcBigDecimal)

            case GrpcEvitaDataType.LOCAL_DATE_TIME:
                return this.handleLocalDateTime(value as GrpcOffsetDateTime)

            case GrpcEvitaDataType.OFFSET_DATE_TIME:
                return this.handleOffsetDateTime(value as GrpcOffsetDateTime)

            case GrpcEvitaDataType.LOCAL_DATE:
                return this.handleLocalDate(value as GrpcOffsetDateTime)

            case GrpcEvitaDataType.LOCAL_TIME:
                return this.handleLocalTime(value as GrpcOffsetDateTime)

            case GrpcEvitaDataType.DATE_TIME_RANGE:
                return this.handleDateTimeRange(value as GrpcDateTimeRange)

            case GrpcEvitaDataType.BIG_DECIMAL_NUMBER_RANGE:
                return this.handleBigDecimalNumberRange(
                    value as GrpcBigDecimalNumberRange
                )

            case GrpcEvitaDataType.LONG_NUMBER_RANGE:
                return this.handleLongNumberRange(value as GrpcLongNumberRange)

            case GrpcEvitaDataType.INTEGER_NUMBER_RANGE:
                return this.handleIntegerNumberRange(
                    value as GrpcIntegerNumberRange
                )

            case GrpcEvitaDataType.SHORT_NUMBER_RANGE:
                return this.handleShortNumberRange(
                    value as GrpcIntegerNumberRange
                )

            case GrpcEvitaDataType.BYTE_NUMBER_RANGE:
                return this.handleByteNumberRange(
                    value as GrpcIntegerNumberRange
                )

            case GrpcEvitaDataType.LOCALE:
                return this.handleLocale(value as GrpcLocale)

            case GrpcEvitaDataType.CURRENCY:
                return this.handleCurrency(value as GrpcCurrency)

            case GrpcEvitaDataType.UUID:
                return this.handleUUID(value as GrpcUuid)

            case GrpcEvitaDataType.PREDECESSOR:
                return this.handlePredecessor(value as GrpcPredecessor)

            case GrpcEvitaDataType.STRING_ARRAY:
                return this.handleStringArray(value as GrpcStringArray)

            case GrpcEvitaDataType.BYTE_ARRAY:
                return this.handleIntegerArray(value as GrpcIntegerArray)

            case GrpcEvitaDataType.SHORT_ARRAY:
                return this.handleIntegerArray(value as GrpcIntegerArray)

            case GrpcEvitaDataType.INTEGER_ARRAY:
                return this.handleIntegerArray(value as GrpcIntegerArray)

            case GrpcEvitaDataType.LONG_ARRAY:
                return this.handleLongArray(value as GrpcLongArray)

            case GrpcEvitaDataType.BOOLEAN_ARRAY:
                return this.handleBooleanArray(value as GrpcBooleanArray)

            case GrpcEvitaDataType.CHARACTER_ARRAY:
                return this.handleIntegerArray(value as GrpcIntegerArray)

            case GrpcEvitaDataType.BIG_DECIMAL_ARRAY:
                return this.handleBigDecimalArray(value as GrpcBigDecimalArray)

            case GrpcEvitaDataType.OFFSET_DATE_TIME_ARRAY:
                return this.handleOffsetDateTimeArray(
                    value as GrpcOffsetDateTimeArray
                )

            case GrpcEvitaDataType.LOCAL_DATE_TIME_ARRAY:
                return this.handleLocalDateTimeArray(
                    value as GrpcOffsetDateTimeArray
                )

            case GrpcEvitaDataType.LOCAL_DATE_ARRAY:
                return this.handleLocalDateArray(
                    value as GrpcOffsetDateTimeArray
                )

            case GrpcEvitaDataType.LOCAL_TIME_ARRAY:
                return this.handleLocalTimeArray(
                    value as GrpcOffsetDateTimeArray
                )

            case GrpcEvitaDataType.DATE_TIME_RANGE_ARRAY:
                return this.handleDateTimeRangeArray(
                    value as GrpcDateTimeRangeArray
                )

            case GrpcEvitaDataType.BIG_DECIMAL_NUMBER_RANGE_ARRAY:
                return this.handleBigDecimalNumberRangeArray(
                    value as GrpcBigDecimalNumberRangeArray
                )

            case GrpcEvitaDataType.LONG_NUMBER_RANGE_ARRAY:
                return this.handleLongNumberRangeArray(
                    value as GrpcLongNumberRangeArray
                )

            case GrpcEvitaDataType.INTEGER_NUMBER_RANGE_ARRAY:
                return this.handleIntegerNumberRangeArray(
                    value as GrpcIntegerNumberRangeArray
                )

            case GrpcEvitaDataType.SHORT_NUMBER_RANGE_ARRAY:
                return this.handleShortNumberRangeArray(
                    value as GrpcIntegerNumberRangeArray
                )

            case GrpcEvitaDataType.BYTE_NUMBER_RANGE_ARRAY:
                return this.handleByteNumberRangeArray(
                    value as GrpcIntegerNumberRangeArray
                )

            case GrpcEvitaDataType.LOCALE_ARRAY:
                return this.handleLocaleArray(value as GrpcLocaleArray)

            case GrpcEvitaDataType.CURRENCY_ARRAY:
                return this.handleCurrencyArray(value as GrpcCurrencyArray)

            case GrpcEvitaDataType.UUID_ARRAY:
                return this.handleUUIDArray(value as GrpcUuidArray)

            default:
                throw new Error('Not accepted type')
        }
    }

    private handleBigDecimal(value: GrpcBigDecimal): BigDecimal {
        return new BigDecimal(value.valueString)
    }

    private handleLocalDateTime(value: GrpcOffsetDateTime): LocalDateTime {
        return this.convertDateTime(value)
    }

    private handleOffsetDateTime(value: GrpcOffsetDateTime): OffsetDateTime {
        return this.convertOffsetDateTime(value)
    }

    private handleLocalDate(value: GrpcOffsetDateTime): LocalDate {
        return this.convertDate(value)
    }

    private handleLocalTime(value: GrpcOffsetDateTime): LocalTime {
        return this.convertTime(value)
    }

    private handleDateTimeRange(value: GrpcDateTimeRange): DateTimeRange {
        if (!this.checkDateTimeValidity(value.from, value.to, false))
            throw new Error('DateTimeRange has undefined prop from and to')
        else
            return new DateTimeRange(
                new OffsetDateTime(value.from?.timestamp, value.from?.offset),
                new OffsetDateTime(value.to?.timestamp, value.to?.offset)
            )
    }

    private handleBigDecimalNumberRange(
        value: GrpcBigDecimalNumberRange
    ): Range<BigDecimal> {
        return new BigDecimalRange(
            new BigDecimal(value.from?.valueString),
            new BigDecimal(value.to?.valueString),
        )
    }

    private handleLongNumberRange(value: GrpcLongNumberRange): Range<bigint> {
        if (this.checkNumberRangeValidity(value.from, value.to))
            throw new Error('LongRangeNumber has undefined prop from and to')
        return new BigintRange(value.from, value.to)
    }

    private handleIntegerNumberRange(
        value: GrpcIntegerNumberRange
    ): Range<number> {
        if (this.checkNumberRangeValidity(value.from, value.to))
            throw new Error('IntegerRangeNumber has undefined prop from and to')
        return new IntegerRange(value.from, value.to)
    }

    private handleShortNumberRange(
        value: GrpcIntegerNumberRange
    ): Range<number> {
        if (this.checkNumberRangeValidity(value.from, value.to))
            throw new Error('ShortRangeNumber has undefined prop from and to')
        return new IntegerRange(value.from, value.to)
    }

    private handleByteNumberRange(
        value: GrpcIntegerNumberRange
    ): Range<number> {
        if (this.checkNumberRangeValidity(value.from, value.to))
            throw new Error('ByteRangeNumber has undefined prop from and to')
        return new IntegerRange(value.from, value.to)
    }

    private handleLocale(value: GrpcLocale): Locale {
        return new Locale(value.languageTag)
    }

    private handleCurrency(value: GrpcCurrency): Currency {
        return new Currency(value.code)
    }

    private handleUUID(value: GrpcUuid): Uuid {
        return { code: value.toJsonString() }
    }

    private handlePredecessor(value: GrpcPredecessor): Predecessor {
        return new Predecessor(
            value.head,
            value.head ? -1 : value.predecessorId
        )
    }

    private handleStringArray(value: GrpcStringArray): Immutable.List<string> {
        return Immutable.List(value.value)
    }

    private handleIntegerArray(
        value: GrpcIntegerArray
    ): Immutable.List<number> {
        return Immutable.List(value.value)
    }

    private handleLongArray(value: GrpcLongArray): Immutable.List<bigint> {
        return Immutable.List(value.value)
    }

    private handleBooleanArray(
        value: GrpcBooleanArray
    ): Immutable.List<boolean> {
        return Immutable.List(value.value)
    }

    private handleBigDecimalArray(
        value: GrpcBigDecimalArray
    ): Immutable.List<BigDecimal> {
        const newBigDecimalArray: BigDecimal[] = []
        for (const grpcDecimal of value.value) {
            newBigDecimalArray.push(new BigDecimal(grpcDecimal.valueString))
        }

        return Immutable.List(newBigDecimalArray)
    }

    private handleOffsetDateTimeArray(
        value: GrpcOffsetDateTimeArray
    ): Immutable.List<OffsetDateTime> {
        const offsetDateTimeArray: OffsetDateTime[] = []
        for (const grpcDateTime of value.value) {
            offsetDateTimeArray.push(this.convertDateTime(grpcDateTime))
        }
        return Immutable.List(offsetDateTimeArray)
    }

    private handleLocalDateTimeArray(
        value: GrpcOffsetDateTimeArray
    ): Immutable.List<LocalDateTime> {
        const localeDateTimeArray: LocalDateTime[] = []
        for (const grpcDateTime of value.value) {
            localeDateTimeArray.push(this.convertDateTime(grpcDateTime))
        }
        return Immutable.List(localeDateTimeArray)
    }

    private handleLocalDateArray(
        value: GrpcOffsetDateTimeArray
    ): Immutable.List<LocalDate> {
        const localDateArray: LocalDate[] = []
        for (const localDate of value.value) {
            localDateArray.push(this.convertDate(localDate))
        }
        return Immutable.List(localDateArray)
    }

    private handleLocalTimeArray(
        value: GrpcOffsetDateTimeArray
    ): Immutable.List<LocalTime> {
        const localTimeArray: LocalTime[] = []
        for (const localTime of value.value) {
            localTimeArray.push(this.convertTime(localTime))
        }
        return Immutable.List(localTimeArray)
    }

    private handleDateTimeRangeArray(
        value: GrpcDateTimeRangeArray
    ): Immutable.List<DateTimeRange> {
        const dateTimeRange: DateTimeRange[] = []
        for (const grpcDateTimeRange of value.value) {
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

    private handleBigDecimalNumberRangeArray(
        value: GrpcBigDecimalNumberRangeArray
    ): Immutable.List<Range<BigDecimal>> {
        const bigDecimalRange: Range<BigDecimal>[] = []
        for (const grpcBigDecimalRange of value.value) {
            bigDecimalRange.push(
                new BigDecimalRange(
                    new BigDecimal(grpcBigDecimalRange.from?.valueString),
                    new BigDecimal(grpcBigDecimalRange.to?.valueString)
                )
            )
        }
        return Immutable.List(bigDecimalRange)
    }

    private handleLongNumberRangeArray(
        value: GrpcLongNumberRangeArray
    ): Immutable.List<Range<bigint>> {
        const longNumberRangeArray: Range<bigint>[] = []
        for (const grpcLongRange of value.value) {
            longNumberRangeArray.push(new BigintRange(grpcLongRange.from, grpcLongRange.to))
        }
        return Immutable.List(longNumberRangeArray)
    }

    private handleIntegerNumberRangeArray(
        value: GrpcIntegerNumberRangeArray
    ): Immutable.List<Range<number>> {
        const integerNumberRangeArray: Range<number>[] = []
        for (const grpcIntegerNumber of value.value) {
            integerNumberRangeArray.push(
                new IntegerRange(grpcIntegerNumber.from, grpcIntegerNumber.to)
            )
        }
        return Immutable.List(integerNumberRangeArray)
    }

    private handleShortNumberRangeArray(
        value: GrpcIntegerNumberRangeArray
    ): Immutable.List<Range<number>> {
        const shortNumberRangeArray: Range<number>[] = []
        for (const grpcShortNumberRange of value.value) {
            shortNumberRangeArray.push(
                new IntegerRange(
                    grpcShortNumberRange.from,
                    grpcShortNumberRange.to
                )
            )
        }
        return Immutable.List(shortNumberRangeArray)
    }

    private handleByteNumberRangeArray(
        value: GrpcIntegerNumberRangeArray
    ): Immutable.List<Range<number>> {
        const byteNumberRangeArray: Range<number>[] = []
        for (const grpcIntegerNumber of value.value) {
            byteNumberRangeArray.push(
                new IntegerRange(grpcIntegerNumber.from, grpcIntegerNumber.to)
            )
        }
        return Immutable.List(byteNumberRangeArray)
    }

    private handleLocaleArray(value: GrpcLocaleArray): Immutable.List<Locale> {
        const localeArray: Locale[] = []
        for (const locale of value.value) {
            localeArray.push(new Locale(locale.languageTag))
        }
        return Immutable.List(localeArray)
    }

    private handleCurrencyArray(
        value: GrpcCurrencyArray
    ): Immutable.List<Currency> {
        const currencyArray: Currency[] = []
        for (const currency of value.value) {
            currencyArray.push(new Currency(currency.code))
        }
        return Immutable.List(currencyArray)
    }

    private handleUUIDArray(value: GrpcUuidArray): Immutable.List<Uuid> {
        const uuidArray: Uuid[] = []
        for (const uuid of value.value) {
            uuidArray.push({ code: uuid.toJsonString() })
        }
        return Immutable.List(uuidArray)
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
                this.convertEvitaValue(associatedValue.value.value)
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
            const evitaAssociatedValues: Map<string, any> = new Map<
                string,
                any
            >()
            for (const dataName in localizedAssocaitedValue.associatedData) {
                const associatedData =
                    localizedAssocaitedValue.associatedData[dataName]
                evitaAssociatedValues.set(
                    dataName,
                    this.convertEvitaValue(associatedData.value.value)
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

    private convertEvitaValue(value: string | GrpcEvitaValue | undefined): any {
        if (typeof value === 'string') {
            return value
        } else {
            const val = value as GrpcEvitaValue
            const objectValue = val.value.value
            switch (val.type) {
                case GrpcEvitaDataType.BYTE:
                case GrpcEvitaDataType.BOOLEAN:
                case GrpcEvitaDataType.BIG_DECIMAL:
                case GrpcEvitaDataType.INTEGER:
                case GrpcEvitaDataType.LONG:
                case GrpcEvitaDataType.STRING:
                case GrpcEvitaDataType.SHORT:
                case GrpcEvitaDataType.CHARACTER:
                    return objectValue as object
                case GrpcEvitaDataType.BIG_DECIMAL_ARRAY:
                    return this.handleBigDecimalArray(
                        objectValue as GrpcBigDecimalArray
                    )
                case GrpcEvitaDataType.BIG_DECIMAL_NUMBER_RANGE:
                    return this.handleBigDecimalNumberRange(
                        objectValue as GrpcBigDecimalNumberRange
                    )
                case GrpcEvitaDataType.BIG_DECIMAL_NUMBER_RANGE_ARRAY:
                    return this.handleBigDecimalNumberRangeArray(
                        objectValue as GrpcBigDecimalNumberRangeArray
                    )
                case GrpcEvitaDataType.BOOLEAN_ARRAY:
                    return this.handleBooleanArray(
                        objectValue as GrpcBooleanArray
                    )
                case GrpcEvitaDataType.BYTE_ARRAY:
                    return this.handleIntegerArray(
                        objectValue as GrpcIntegerArray
                    )
                case GrpcEvitaDataType.BYTE_NUMBER_RANGE:
                    return this.handleByteNumberRange(
                        objectValue as GrpcIntegerNumberRange
                    )
                case GrpcEvitaDataType.LONG_ARRAY:
                    return this.handleLongArray(objectValue as GrpcLongArray)
                case GrpcEvitaDataType.LONG_NUMBER_RANGE_ARRAY:
                    return this.handleLongNumberRangeArray(
                        objectValue as GrpcLongNumberRangeArray
                    )
                case GrpcEvitaDataType.SHORT_NUMBER_RANGE:
                    return this.handleShortNumberRangeArray(
                        objectValue as GrpcIntegerNumberRangeArray
                    )
                case GrpcEvitaDataType.SHORT_ARRAY:
                    return this.handleShortNumberRange(
                        objectValue as GrpcIntegerNumberRange
                    )
                case GrpcEvitaDataType.LOCALE:
                    return this.handleLocale(objectValue as GrpcLocale)
                case GrpcEvitaDataType.CURRENCY:
                    return this.handleCurrency(objectValue as GrpcCurrency)
                case GrpcEvitaDataType.BYTE_NUMBER_RANGE_ARRAY:
                    return this.handleByteNumberRangeArray(
                        objectValue as GrpcIntegerNumberRangeArray
                    )
                case GrpcEvitaDataType.CHARACTER_ARRAY:
                    return this.handleIntegerArray(
                        objectValue as GrpcIntegerArray
                    )
                case GrpcEvitaDataType.CURRENCY_ARRAY:
                    return this.handleCurrencyArray(
                        objectValue as GrpcCurrencyArray
                    )
                case GrpcEvitaDataType.DATE_TIME_RANGE_ARRAY:
                    return this.handleDateTimeRangeArray(
                        objectValue as GrpcDateTimeRangeArray
                    )
                case GrpcEvitaDataType.INTEGER_ARRAY:
                    return this.handleIntegerArray(
                        objectValue as GrpcIntegerArray
                    )
                case GrpcEvitaDataType.INTEGER_NUMBER_RANGE:
                    return this.handleIntegerNumberRange(
                        objectValue as GrpcIntegerNumberRange
                    )
                case GrpcEvitaDataType.INTEGER_NUMBER_RANGE_ARRAY:
                    return this.handleIntegerNumberRangeArray(
                        objectValue as GrpcIntegerNumberRangeArray
                    )
                case GrpcEvitaDataType.PREDECESSOR:
                    return this.handlePredecessor(
                        objectValue as GrpcPredecessor
                    )
                case GrpcEvitaDataType.SHORT_NUMBER_RANGE_ARRAY:
                    return this.handleIntegerNumberRangeArray(
                        objectValue as GrpcIntegerNumberRangeArray
                    )
                case GrpcEvitaDataType.STRING_ARRAY:
                    return this.handleStringArray(
                        objectValue as GrpcStringArray
                    )
                case GrpcEvitaDataType.UUID:
                    return this.handleUUID(objectValue as GrpcUuid)
                case GrpcEvitaDataType.UUID_ARRAY:
                    return this.handleUUIDArray(objectValue as GrpcUuidArray)
                case GrpcEvitaDataType.OFFSET_DATE_TIME_ARRAY:
                    return this.handleOffsetDateTimeArray(
                        objectValue as GrpcOffsetDateTimeArray
                    )
                case GrpcEvitaDataType.DATE_TIME_RANGE:
                    return this.handleDateTimeRange(
                        objectValue as GrpcDateTimeRange
                    )
                case GrpcEvitaDataType.LOCALE_ARRAY:
                    return this.handleLocaleArray(
                        objectValue as GrpcLocaleArray
                    )
                case GrpcEvitaDataType.LOCAL_DATE:
                    return this.handleLocalDate(
                        objectValue as GrpcOffsetDateTime
                    )
                case GrpcEvitaDataType.LOCAL_DATE_ARRAY:
                    return this.handleLocalDateArray(
                        objectValue as GrpcOffsetDateTimeArray
                    )
                case GrpcEvitaDataType.LOCAL_DATE_TIME:
                    return this.handleLocalTime(
                        objectValue as GrpcOffsetDateTime
                    )
                case GrpcEvitaDataType.LOCAL_DATE_TIME_ARRAY:
                    return this.handleLocalDateTimeArray(
                        objectValue as GrpcOffsetDateTimeArray
                    )
                case GrpcEvitaDataType.LOCAL_TIME:
                    return this.handleLocalTime(
                        objectValue as GrpcOffsetDateTime
                    )
                case GrpcEvitaDataType.LOCAL_TIME_ARRAY:
                    return this.handleLocalTimeArray(
                        objectValue as GrpcOffsetDateTimeArray
                    )
                case GrpcEvitaDataType.LONG_NUMBER_RANGE:
                    return this.handleLongNumberRange(
                        objectValue as GrpcLongNumberRange
                    )
                case GrpcEvitaDataType.OFFSET_DATE_TIME:
                    return (
                        this,
                        this.handleOffsetDateTime(
                            objectValue as GrpcOffsetDateTime
                        )
                    )
            }
        }
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
