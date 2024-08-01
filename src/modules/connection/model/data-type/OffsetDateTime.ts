import { Timestamp } from '@bufbuild/protobuf'
import { DateTime } from 'luxon'
import { PerttyPrintable } from './PrettyPrintable'

//TODO add doc
export class OffsetDateTime implements PerttyPrintable {
    readonly timestamp?: Timestamp
    readonly offset?: string

    constructor(timestamp?: Timestamp, offset?: string) {
        this.timestamp = timestamp
        this.offset = offset
    }
    getPrettyPrintableString(): string {
        const offsetDateTimeFormatter = new Intl.DateTimeFormat([], {
            dateStyle: 'medium',
            timeStyle: 'long',
        })
        return `${offsetDateTimeFormatter.format(this.timestamp?.toDate())}`
    }
    static ofInstant(instant: bigint, offset: string): OffsetDateTime {
        const timestamp = new Timestamp()
        timestamp.seconds = instant
        return new OffsetDateTime(timestamp, offset)
    }

    toString():string{
        return DateTime.fromSeconds(Number(this.timestamp?.seconds), {zone: this.offset }).toISO({includeOffset: true})
    }
}
