import { OffsetDateTime } from './OffsetDateTime'

export class DateTimeRange {
    readonly from?: OffsetDateTime
    readonly to?: OffsetDateTime

    constructor(from?: OffsetDateTime, to?: OffsetDateTime) {
        this.from = from
        this.to = to
    }

    static until(to: OffsetDateTime): DateTimeRange {
        return new DateTimeRange(undefined, to)
    }

    static since(from: OffsetDateTime): DateTimeRange {
        return new DateTimeRange(from, undefined)
    }

    static between(from: OffsetDateTime, to: OffsetDateTime): DateTimeRange {
        return new DateTimeRange(from, to)
    }
}
