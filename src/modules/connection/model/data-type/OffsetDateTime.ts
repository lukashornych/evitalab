import { Timestamp } from '@bufbuild/protobuf'

//TODO add doc
export class OffsetDateTime {
    readonly timestamp?: Timestamp
    readonly offset?: string

    constructor(timestamp?: Timestamp, offset?: string) {
        this.timestamp = timestamp
        this.offset = offset
    }
    static ofInstant(instant: bigint, offset: string): OffsetDateTime {
        const timestamp = new Timestamp()
        timestamp.seconds = instant
        return new OffsetDateTime(timestamp, offset)
    }
}
