import { BigDecimal } from '@/modules/connection/model/data-type/BigDecimal'
import { BigDecimalRange } from '@/modules/connection/model/data-type/BigDecimalRange'
import { BigintRange } from '@/modules/connection/model/data-type/BigintRange'
import { DateTimeRange } from '@/modules/connection/model/data-type/DateTimeRange'
import { IntegerRange } from '@/modules/connection/model/data-type/IntegerRange'
import { LocalDate } from '@/modules/connection/model/data-type/LocalDate'
import { LocalDateTime } from '@/modules/connection/model/data-type/LocalDateTime'
import { Locale } from '@/modules/connection/model/data-type/Locale'
import { LocalTime } from '@/modules/connection/model/data-type/LocalTime'
import { OffsetDateTime } from '@/modules/connection/model/data-type/OffsetDateTime'
import { Predecessor } from '@/modules/connection/model/data-type/Predecessor'
import { Uuid } from '@/modules/connection/model/data-type/Uuid'
import { Currency } from '@/modules/connection/model/data/Currency'
import Immutable from 'immutable'
import {
    GrpcBigDecimal,
    GrpcOffsetDateTime,
    GrpcDateTimeRange,
    GrpcBigDecimalNumberRange,
    GrpcLongNumberRange,
    GrpcIntegerNumberRange,
    GrpcLocale,
    GrpcCurrency,
    GrpcUuid,
    GrpcPredecessor,
    GrpcStringArray,
    GrpcIntegerArray,
    GrpcLongArray,
    GrpcBooleanArray,
    GrpcBigDecimalArray,
    GrpcOffsetDateTimeArray,
    GrpcDateTimeRangeArray,
    GrpcBigDecimalNumberRangeArray,
    GrpcLongNumberRangeArray,
    GrpcIntegerNumberRangeArray,
    GrpcLocaleArray,
    GrpcCurrencyArray,
    GrpcUuidArray,
    GrpcEvitaValue,
} from '../gen/GrpcEvitaDataTypes_pb'
import { DateTime } from 'luxon'
import { Range } from '@/modules/connection/model/data-type/Range'
import { GrpcEvitaDataType } from '../gen/GrpcEnums_pb'

export class EvitaValueConvert {
    convertEvitaValue(value: string | GrpcEvitaValue | undefined): any {
        if (typeof value === 'string') {
            return value
        } else if (value == undefined) {
            return undefined
        } else {
            const val = value as GrpcEvitaValue
            const objectValue = val.value.value
            switch (val.type) {
                case GrpcEvitaDataType.BYTE:
                case GrpcEvitaDataType.BOOLEAN:
                case GrpcEvitaDataType.INTEGER:
                case GrpcEvitaDataType.LONG:
                case GrpcEvitaDataType.STRING:
                case GrpcEvitaDataType.SHORT:
                case GrpcEvitaDataType.CHARACTER:
                    return objectValue as object
                case GrpcEvitaDataType.BIG_DECIMAL:
                    return this.handleBigDecimal(objectValue as GrpcBigDecimal)
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
                    return this.handleLocalDateTime(
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
            new BigDecimal(value.to?.valueString)
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
            longNumberRangeArray.push(
                new BigintRange(grpcLongRange.from, grpcLongRange.to)
            )
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

    private convertDate(offsetDateTime: GrpcOffsetDateTime): LocalDate {
        if (!offsetDateTime.timestamp) {
            throw new Error('Missing prop timestamp')
        }
        const localDate: LocalDate = new LocalDate(
            DateTime.fromSeconds(
                Number(offsetDateTime.timestamp.seconds)
            ).toISODate()
        )
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

    private convertTime(grpcTime: GrpcOffsetDateTime): LocalTime {
        if (!grpcTime.timestamp) {
            throw new Error('Missing prop timestamp')
        }
        const localTime: LocalTime = new LocalTime(
            DateTime.fromSeconds(Number(grpcTime.timestamp.seconds)).toISOTime()
        )
        return localTime
    }
}
