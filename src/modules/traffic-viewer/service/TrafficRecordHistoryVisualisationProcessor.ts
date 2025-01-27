import { TrafficRecordVisualisationContext } from '@/modules/traffic-viewer/model/TrafficRecordVisualisationContext'
import Immutable from 'immutable'
import {
    TrafficRecordVisualisationControlFlag, TrafficRecordVisualisationDefinition
} from '@/modules/traffic-viewer/model/TrafficRecordVisualisationDefinition'
import { TrafficRecord } from '@/modules/connection/model/traffic/TrafficRecord'
import { TrafficRecordVisualiser } from '@/modules/traffic-viewer/service/TrafficRecordVisualiser'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'

/**
 * Takes raw flat traffic records from server and processes them into visualisable tree structure.
 */
export class TrafficRecordHistoryVisualisationProcessor {

    private readonly visualisers: Immutable.List<TrafficRecordVisualiser<any>>

    constructor(visualisers: Immutable.List<TrafficRecordVisualiser<any>>) {
        this.visualisers = visualisers
    }

    process(ctx: TrafficRecordVisualisationContext, records: TrafficRecord[]): Immutable.List<TrafficRecordVisualisationDefinition> {
        const processedRecords: TrafficRecordVisualisationDefinition[] = []

        const recordsToProcess: TrafficRecord[] = [...records]
        while (recordsToProcess.length > 0) {
            const processedRecord: TrafficRecordVisualisationDefinition | undefined = this.processRecord(ctx, recordsToProcess)
            if (processedRecord != undefined) {
                processedRecords.push(processedRecord)
            } else {
                console.warn('Traffic record skipped because it probably represents parent closing record but no matching parent found.')
            }
        }

        return Immutable.List(processedRecords)
    }

    private processRecord(ctx: TrafficRecordVisualisationContext,
                          records: TrafficRecord[],
                          parentProcessedRecord?: TrafficRecordVisualisationDefinition): TrafficRecordVisualisationDefinition | undefined {
        const record: TrafficRecord = records.shift()!
        const processedRecordVisualisationData: VisualisationData = this.createVisualisationDefinition(ctx, record)
        const processedRecord: TrafficRecordVisualisationDefinition = processedRecordVisualisationData.definition

        if (processedRecord.controlFlag === TrafficRecordVisualisationControlFlag.ParentStart) {
            while (records.length > 0) {
                const childRecord: TrafficRecordVisualisationDefinition | undefined = this.processRecord(ctx, records, processedRecord)
                if (childRecord == undefined) {
                    // no more children, closing parent
                    return processedRecord
                }
                processedRecord.addChild(childRecord)
            }
        } else if (processedRecord.controlFlag === TrafficRecordVisualisationControlFlag.ParentEnd) {
            // closing parent, add possible statistics to the parent
            this.mergeVisualisationDefinitions(ctx, processedRecordVisualisationData.visualiser, parentProcessedRecord, processedRecord)
            return undefined
        }

        return processedRecord
    }

    private createVisualisationDefinition(ctx: TrafficRecordVisualisationContext, record: TrafficRecord): VisualisationData {
        for (const visualiser of this.visualisers) {
            if (visualiser.canVisualise(record)) {
                return {
                    definition: visualiser.visualise(ctx, record),
                    visualiser
                };
            }
        }
        throw new UnexpectedError(`No visualiser was found for '${record.type}'.`);
    }

    private mergeVisualisationDefinitions(ctx: TrafficRecordVisualisationContext,
                                          visualiser: TrafficRecordVisualiser<any>,
                                          parentProcessedRecord: TrafficRecordVisualisationDefinition | undefined,
                                          processedRecord: TrafficRecordVisualisationDefinition): void {
        if (parentProcessedRecord != undefined) {
            visualiser.mergeDefinitions(ctx, parentProcessedRecord, processedRecord)
        }
    }
}

type VisualisationData = {
    readonly definition: TrafficRecordVisualisationDefinition
    readonly visualiser: TrafficRecordVisualiser<any>
}
