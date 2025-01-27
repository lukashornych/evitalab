import { TrafficRecord } from '@/modules/connection/model/traffic/TrafficRecord'
import {
    TrafficRecordVisualisationDefinition
} from '@/modules/traffic-viewer/model/TrafficRecordVisualisationDefinition'
import { TrafficRecordVisualisationContext } from '@/modules/traffic-viewer/model/TrafficRecordVisualisationContext'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'

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
    abstract visualise(ctx: TrafficRecordVisualisationContext, trafficRecord: R): TrafficRecordVisualisationDefinition

    /**
     * Merges traffic record into target one of different type. Usually used to merge statistics of closing record to the
     * parent record.
     *
     * By default, visualiser cannot merge two definitions, and it is up to specific visualiser to decide which combinations
     * can be merged.
     */
    mergeDefinitions(ctx: TrafficRecordVisualisationContext,
                     targetVisualisationDefinition: TrafficRecordVisualisationDefinition,
                     visualisationDefinitionToMerge: TrafficRecordVisualisationDefinition): void {
        throw new UnexpectedError(`This visualiser doesn't support merging definitions.`)
    }
}
