import { TrafficRecordHistoryDataPointer } from '@/modules/traffic-viewer/model/TrafficRecordHistoryDataPointer'

/**
 * Generic context for record visualisation
 */
export class TrafficRecordVisualisationContext {

    readonly dataPointer: TrafficRecordHistoryDataPointer

    constructor(dataPointer: TrafficRecordHistoryDataPointer) {
        this.dataPointer = dataPointer
    }
}
