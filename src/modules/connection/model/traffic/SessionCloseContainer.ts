import { Uuid } from '@/modules/connection/model/data-type/Uuid'
import { OffsetDateTime } from '@/modules/connection/model/data-type/OffsetDateTime'
import { Duration } from 'luxon'
import { TrafficRecord } from '@/modules/connection/model/traffic/TrafficRecord'
import { TrafficRecordType } from '@/modules/connection/model/traffic/TrafficRecordType'

/**
 * This container holds information about the session close.
 */
export class SessionCloseContainer extends TrafficRecord {

    readonly catalogVersion: bigint
    readonly trafficRecordCount: number
    readonly trafficRecordsMissedOut: number
    readonly queryCount: number
    readonly entityFetchCount: number
    readonly mutationCount: number

    constructor(sessionSequenceOrder: bigint | undefined,
                sessionId: Uuid,
                recordSessionOffset: number,
                type: TrafficRecordType,
                created: OffsetDateTime,
                duration: Duration,
                ioFetchedSizeBytes: number,
                ioFetchCount: number,
                catalogVersion: bigint,
                trafficRecordCount: number,
                trafficRecordsMissedOut: number,
                queryCount: number,
                entityFetchCount: number,
                mutationCount: number) {
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
        this.catalogVersion = catalogVersion
        this.trafficRecordCount = trafficRecordCount
        this.trafficRecordsMissedOut = trafficRecordsMissedOut
        this.queryCount = queryCount
        this.entityFetchCount = entityFetchCount
        this.mutationCount = mutationCount
    }
}
