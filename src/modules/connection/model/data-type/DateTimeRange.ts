//TODO: Add documentation
import { OffsetDateTime } from "./OffsetDateTime"
import { PerttyPrintable } from "./PrettyPrintable"
import { Range } from "./Range"

export class DateTimeRange extends Range<OffsetDateTime> implements PerttyPrintable {

    constructor(from?: OffsetDateTime, to?: OffsetDateTime) {
        super(from, to)
    }

    getPrettyPrintableString(): string {
        const offsetDateTimeFormatter = new Intl.DateTimeFormat([], {
            dateStyle: 'medium',
            timeStyle: 'long',
        })
        return `[${offsetDateTimeFormatter.format(this.from?.timestamp?.toDate()) ?? '∞'},${offsetDateTimeFormatter.format(this.to?.timestamp?.toDate()) ?? '∞'}]`
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

    override toString():string{
        return `[${this.from ?? '∞'},${this.to ?? '∞'}]`
    }
}
