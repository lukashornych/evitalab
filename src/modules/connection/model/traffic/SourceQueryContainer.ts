import { Uuid } from '@/modules/connection/model/data-type/Uuid'
import { OffsetDateTime } from '@/modules/connection/model/data-type/OffsetDateTime'
import { Duration } from 'luxon'
import { TrafficRecord } from '@/modules/connection/model/traffic/TrafficRecord'
import { TrafficRecordType } from '@/modules/connection/model/traffic/TrafficRecordType'

/**
 * This container holds information about the source query.
 */
export class SourceQueryContainer extends TrafficRecord {

    readonly sourceQueryId: Uuid
    readonly sourceQuery: string
    readonly queryType: string

    constructor(sessionSequenceOrder: bigint | undefined,
                sessionId: Uuid,
                recordSessionOffset: number,
                type: TrafficRecordType,
                created: OffsetDateTime,
                duration: Duration,
                ioFetchedSizeBytes: number,
                ioFetchCount: number,
                sourceQueryId: Uuid,
                sourceQuery: string,
                queryType: string) {
        super(
            sessionSequenceOrder,
            sessionId,
            recordSessionOffset,
            type,
            created,
            duration,
            ioFetchedSizeBytes,
            ioFetchCount
        )
        this.sourceQueryId = sourceQueryId
        this.sourceQuery = sourceQuery
        this.queryType = queryType
    }
}
