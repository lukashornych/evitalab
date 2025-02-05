import { TrafficRecordVisualisationContext } from '@/modules/traffic-viewer/model/TrafficRecordVisualisationContext'
import Immutable from 'immutable'
import { TrafficRecord } from '@/modules/connection/model/traffic/TrafficRecord'
import { TrafficRecordVisualiser } from '@/modules/traffic-viewer/service/TrafficRecordVisualiser'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { TrafficRecordHistoryDataPointer } from '@/modules/traffic-viewer/model/TrafficRecordHistoryDataPointer'
import { TrafficRecordHistoryCriteria } from '@/modules/traffic-viewer/model/TrafficRecordHistoryCriteria'
import {
    RequestedSourceQueryRecord,
    TrafficRecordPreparationContext
} from '@/modules/traffic-viewer/model/TrafficRecordPreparationContext'
import {
    TrafficRecordVisualisationDefinition
} from '@/modules/traffic-viewer/model/TrafficRecordVisualisationDefinition'
import { UserTrafficRecordType } from '@/modules/traffic-viewer/model/UserTrafficRecordType'
import { TrafficRecordingCaptureRequest } from '@/modules/connection/model/traffic/TrafficRecordingCaptureRequest'
import { TrafficRecordContent } from '@/modules/connection/model/traffic/TrafficRecordContent'
import { TrafficRecordType } from '@/modules/connection/model/traffic/TrafficRecordType'
import { Label, labelSourceQuery } from '@/modules/connection/model/traffic/Label'
import { ConnectionService } from '@/modules/connection/service/ConnectionService'
import { EvitaDBDriver } from '@/modules/connection/driver/EvitaDBDriver'
import { SourceQueryContainer } from '@/modules/connection/model/traffic/SourceQueryContainer'

/**
 * Takes raw flat traffic records from server and processes them into visualisable tree structure.
 */
export class TrafficRecordHistoryVisualisationProcessor {

    private readonly connectionService: ConnectionService
    private readonly visualisers: Immutable.List<TrafficRecordVisualiser<any>>

    constructor(connectionService: ConnectionService, visualisers: Immutable.List<TrafficRecordVisualiser<any>>) {
        this.connectionService = connectionService
        this.visualisers = visualisers
    }

    async process(dataPointer: TrafficRecordHistoryDataPointer,
                  historyCriteria: TrafficRecordHistoryCriteria,
                  records: TrafficRecord[]): Promise<Immutable.List<TrafficRecordVisualisationDefinition>> {
        const preparationContext: TrafficRecordPreparationContext = new TrafficRecordPreparationContext()
        for (const record of records) {
            this.prepareRecord(preparationContext, record)
        }

        const recordsToVisualise: TrafficRecord[] = await this.processPreparedData(
            preparationContext,
            dataPointer,
            historyCriteria,
            records
        )

        const visualisationContext: TrafficRecordVisualisationContext = new TrafficRecordVisualisationContext(dataPointer)
        for (const record of recordsToVisualise) {
            this.visualiseRecord(visualisationContext, record)
        }
        return visualisationContext.getVisualisedRecords()
    }

    private async processPreparedData(preparationContext: TrafficRecordPreparationContext,
                                      dataPointer: TrafficRecordHistoryDataPointer,
                                      historyCriteria: TrafficRecordHistoryCriteria,
                                      records: TrafficRecord[]): Promise<TrafficRecord[]> {
        const recordsToVisualise: TrafficRecord[] = [...records]

        const requestedAdditionalSourceQueryRecords: Immutable.Map<string, RequestedSourceQueryRecord> =
            preparationContext.getRequestedAdditionalSourceQueryRecords()
        if (!requestedAdditionalSourceQueryRecords.isEmpty() && historyCriteria.types?.includes(UserTrafficRecordType.SourceQuery)) {
            const sourceQueryFetchRequest: TrafficRecordingCaptureRequest = this.createAdditionalSourceQueryFetchRequest(requestedAdditionalSourceQueryRecords)
            const sourceQueryRecords: Immutable.List<TrafficRecord> = await this.fetchAdditionalSourceQueryRecords(dataPointer, sourceQueryFetchRequest, recordsToVisualise)
            this.insertFetchedSourceQueryRecords(sourceQueryRecords, requestedAdditionalSourceQueryRecords, recordsToVisualise)
        }

        return recordsToVisualise
    }

    private createAdditionalSourceQueryFetchRequest(requestedSourceQueryRecords: Immutable.Map<string, RequestedSourceQueryRecord>): TrafficRecordingCaptureRequest {
        const types: TrafficRecordType[] = [TrafficRecordType.SourceQuery] // this is workaround because Immutable.List for some reason thinks enum is string
        return new TrafficRecordingCaptureRequest(
            TrafficRecordContent.Body,
            undefined,
            undefined,
            undefined,
            Immutable.List(types),
            undefined,
            undefined,
            undefined,
            requestedSourceQueryRecords
                .map(it => new Label(
                    labelSourceQuery,
                    `'${it.sourceQueryId.toString()}'`
                ))
                .toList()
        )
    }

    private async fetchAdditionalSourceQueryRecords(dataPointer: TrafficRecordHistoryDataPointer,
                                                    sourceQueryFetchRequest: TrafficRecordingCaptureRequest,
                                                    records: TrafficRecord[]): Promise<Immutable.List<TrafficRecord>> {
        const driver: EvitaDBDriver = await this.connectionService.getDriver(dataPointer.connection)
        return await driver.getTrafficRecordHistoryList(
            dataPointer.connection,
            dataPointer.catalogName,
            sourceQueryFetchRequest,
            records.length // this is not ideal, but don't have better solution right now
        )
    }

    private insertFetchedSourceQueryRecords(additionalSourceQueryRecords: Immutable.List<TrafficRecord>,
                                            requests: Immutable.Map<string, RequestedSourceQueryRecord>,
                                            records: TrafficRecord[]): void {
        let startVisitingRecordsAt: number = 0
        for (const sourceQueryRecord of additionalSourceQueryRecords) {
            if (!(sourceQueryRecord instanceof SourceQueryContainer)) {
                throw new UnexpectedError(`Traffic record should be source query record.`)
            }
            const request: RequestedSourceQueryRecord | undefined = requests.get(sourceQueryRecord.sourceQueryId.toString())
            if (request == undefined) {
                throw new UnexpectedError(`There is unexpected source query record for ID '${sourceQueryRecord.sourceQueryId.toString()}'`)
            }
            if (startVisitingRecordsAt > records.length - 1) {
                throw new UnexpectedError('There are unmatched source query records. This is weird.')
            }

            for (let i = startVisitingRecordsAt; i < records.length; i++) {
                const record: TrafficRecord = records[i]
                if (record == request.beforeRecord) {
                    records.splice(i, 0, sourceQueryRecord)
                    startVisitingRecordsAt = i + 2 // we need to get pass the newly inserted record as well as the "beforeRecord"
                    break
                }
            }
        }
    }

    private prepareRecord(ctx: TrafficRecordPreparationContext, record: TrafficRecord): void {
        for (const visualiser of this.visualisers) {
            if (visualiser.canVisualise(record)) {
                visualiser.prepare(ctx, record)
                return
            }
        }
        throw new UnexpectedError(`No visualiser was found for '${record.type}'.`);
    }

    private visualiseRecord(ctx: TrafficRecordVisualisationContext, record: TrafficRecord): void {
        for (const visualiser of this.visualisers) {
            if (visualiser.canVisualise(record)) {
                visualiser.visualise(ctx, record)
                return
            }
        }
        throw new UnexpectedError(`No visualiser was found for '${record.type}'.`);
    }
}
