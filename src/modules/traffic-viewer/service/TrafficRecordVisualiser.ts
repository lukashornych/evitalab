import { TrafficRecord } from '@/modules/connection/model/traffic/TrafficRecord'
import { TrafficRecordVisualisationContext } from '@/modules/traffic-viewer/model/TrafficRecordVisualisationContext'

/**
 * Provides definition about how to visualise traffic record to user
 */
export abstract class TrafficRecordVisualiser<R extends TrafficRecord> {

    /**
     * Determines if this visualiser can visualise this record
     */
    abstract canVisualise(trafficRecord: TrafficRecord): boolean

    /**
     * Creates visualisation definition for this traffic record. Can return `null` if particular record shouldn't be visualised
     */
    abstract visualise(ctx: TrafficRecordVisualisationContext, trafficRecord: R): void
}
