import { Uuid } from '@/modules/connection/model/data-type/Uuid'
import { OffsetDateTime } from '@/modules/connection/model/data-type/OffsetDateTime'
import { Duration } from 'luxon'
import { TrafficRecord } from '@/modules/connection/model/traffic/TrafficRecord'
import { TrafficRecordType } from '@/modules/connection/model/traffic/TrafficRecordType'

/**
 * This container holds information about single entity fetch.
 */
export class EntityFetchContainer extends TrafficRecord {

    /**
     * The query operation associated with entity fetch.
     */
    readonly query: string
    /**
     * The primary key of the fetched record
     */
    readonly primaryKey: number

    constructor(sessionSequenceOrder: bigint | undefined,
                sessionId: Uuid,
                recordSessionOffset: number,
                type: TrafficRecordType,
                created: OffsetDateTime,
                duration: Duration,
                ioFetchedSizeBytes: number,
                ioFetchCount: number,
                query: string,
                primaryKey: number) {
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
        this.query = query
        this.primaryKey = primaryKey
    }
}
