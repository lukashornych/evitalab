import { Uuid } from '@/modules/connection/model/data-type/Uuid'
import { TrafficRecordType } from '@/modules/connection/model/traffic/TrafficRecordType'
import { OffsetDateTime } from '@/modules/connection/model/data-type/OffsetDateTime'
import { Duration } from 'luxon'

/**
 * Represents a single record of traffic recording
 */
export abstract class TrafficRecord {

    readonly sessionSequenceOrder?: bigint
    readonly sessionId: Uuid
    readonly recordSessionOffset: number
    readonly type: TrafficRecordType
    readonly created: OffsetDateTime
    readonly duration: Duration
    readonly ioFetchedSizeBytes: number
    readonly ioFetchCount: number

    protected constructor(sessionSequenceOrder: bigint | undefined,
                          sessionId: Uuid,
                          recordSessionOffset: number,
                          type: TrafficRecordType,
                          created: OffsetDateTime,
                          duration: Duration,
                          ioFetchedSizeBytes: number,
                          ioFetchCount: number) {
        this.sessionSequenceOrder = sessionSequenceOrder
        this.sessionId = sessionId
        this.recordSessionOffset = recordSessionOffset
        this.type = type
        this.created = created
        this.duration = duration
        this.ioFetchedSizeBytes = ioFetchedSizeBytes
        this.ioFetchCount = ioFetchCount
    }
}
