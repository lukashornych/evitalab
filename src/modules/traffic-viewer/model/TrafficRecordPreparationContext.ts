import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import Immutable from 'immutable'
import { TrafficRecord } from '@/modules/connection/model/traffic/TrafficRecord'

/**
 * Generic context for record preparation before visualisation
 */
export class TrafficRecordPreparationContext {

    private visitedSourceQueryRecordsIndex: Map<string, TrafficRecord> = new Map()
    private requestedAdditionalSourceQueryRecords: Map<string, RequestedSourceQueryRecord> = new Map()

    isSourceQueryRecordVisitedOrRequested(sourceQueryId: string): boolean {
        return this.visitedSourceQueryRecordsIndex.has(sourceQueryId) ||
            this.requestedAdditionalSourceQueryRecords.has(sourceQueryId)
    }

    sourceQueryRecordVisited(sourceQueryId: string, record: TrafficRecord): void {
        if (this.visitedSourceQueryRecordsIndex.has(sourceQueryId)) {
            throw new UnexpectedError(`Source query record with ID '${sourceQueryId}' already visited. This is weird.`)
        }
        this.visitedSourceQueryRecordsIndex.set(sourceQueryId, record)
    }

    requestAdditionalSourceQueryRecord(sourceQueryId: string, before: TrafficRecord): void {
        if (!this.requestedAdditionalSourceQueryRecords.has(sourceQueryId)) {
            this.requestedAdditionalSourceQueryRecords.set(
                sourceQueryId,
                new RequestedSourceQueryRecord(sourceQueryId, before)
            )
        }
    }

    getRequestedAdditionalSourceQueryRecords(): Immutable.Map<string, RequestedSourceQueryRecord> {
        return Immutable.Map(this.requestedAdditionalSourceQueryRecords)
    }
}

export class RequestedSourceQueryRecord {
    readonly sourceQueryId: string
    readonly beforeRecord: TrafficRecord

    constructor(sourceQueryId: string, beforeRecord: TrafficRecord) {
        this.sourceQueryId = sourceQueryId
        this.beforeRecord = beforeRecord
    }
}
