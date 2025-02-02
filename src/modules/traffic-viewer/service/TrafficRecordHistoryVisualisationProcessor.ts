import { TrafficRecordVisualisationContext } from '@/modules/traffic-viewer/model/TrafficRecordVisualisationContext'
import Immutable from 'immutable'
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

    process(ctx: TrafficRecordVisualisationContext, records: TrafficRecord[]): void {
        for (const record of records) {
            this.visualiseRecord(ctx, record)
        }
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
