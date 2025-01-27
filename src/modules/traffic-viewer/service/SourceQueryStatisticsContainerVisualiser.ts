import { TrafficRecord } from '@/modules/connection/model/traffic/TrafficRecord'
import { TrafficRecordVisualiser } from '@/modules/traffic-viewer/service/TrafficRecordVisualiser'
import { TrafficRecordVisualisationContext } from '../model/TrafficRecordVisualisationContext'
import {
    MetadataGroup,
    MetadataItem,
    TrafficRecordVisualisationControlFlag,
    TrafficRecordVisualisationDefinition
} from '../model/TrafficRecordVisualisationDefinition'
import { SourceQueryStatisticsContainer } from '@/modules/connection/model/traffic/SourceQueryStatisticsContainer'
import { i18n } from '@/vue-plugins/i18n'
import Immutable from 'immutable'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { SourceQueryContainer } from '@/modules/connection/model/traffic/SourceQueryContainer'

/**
 * Source query statistics container isn't visualised but controls the flow of rendered UI.
 * The statistics are rendered using the `SourceQueryContainerVisualiser`
 */
export class SourceQueryStatisticsContainerVisualiser extends TrafficRecordVisualiser<SourceQueryStatisticsContainer> {

    canVisualise(trafficRecord: TrafficRecord): boolean {
        return trafficRecord instanceof SourceQueryStatisticsContainer
    }

    visualise(ctx: TrafficRecordVisualisationContext,
              trafficRecord: SourceQueryStatisticsContainer): TrafficRecordVisualisationDefinition {
        return new TrafficRecordVisualisationDefinition(
            trafficRecord,
            'SourceQueryStatisticsContainer', // will not be visible
            undefined,
            this.constructMetadata(trafficRecord),
            Immutable.List(),
            TrafficRecordVisualisationControlFlag.ParentEnd
        )
    }

    mergeDefinitions(ctx: TrafficRecordVisualisationContext,
                     targetVisualisationDefinition: TrafficRecordVisualisationDefinition,
                     visualisationDefinitionToMerge: TrafficRecordVisualisationDefinition): void {
        if (!(targetVisualisationDefinition.source instanceof SourceQueryContainer) ||
            !(visualisationDefinitionToMerge.source instanceof SourceQueryStatisticsContainer)) {
            throw new UnexpectedError(
                `Only 'SourceQueryContainer' target traffic record is supported for merge with 'SourceQueryStatisticsContainer'` +
                ` but target was '${targetVisualisationDefinition.source.type}' and source was '${visualisationDefinitionToMerge.source.type}'.`
            )
        }

        const defaultMetadata: MetadataGroup = targetVisualisationDefinition.defaultMetadata!
        const newMergedDefaultMetadata: MetadataItem[] = defaultMetadata.items.filter(flag => flag.identifier !== 'noStatistics')
        newMergedDefaultMetadata.push(...visualisationDefinitionToMerge.defaultMetadata!.items)

        defaultMetadata.items = newMergedDefaultMetadata
    }

    private constructMetadata(trafficRecord: SourceQueryStatisticsContainer): MetadataGroup[] {
        const defaultMetadata: MetadataItem[] = []

        defaultMetadata.push(MetadataItem.finishedStatus(trafficRecord.finishedWithError))
        defaultMetadata.push(MetadataItem.duration(trafficRecord.duration))
        defaultMetadata.push(MetadataItem.ioFetchedSizeBytes(trafficRecord.ioFetchedSizeBytes))
        defaultMetadata.push(MetadataItem.ioFetchCount(trafficRecord.ioFetchCount))

        defaultMetadata.push(new MetadataItem(
            undefined, // don't need to reference it
            'mdi-counter',
            i18n.global.t('trafficViewer.recordHistory.record.type.sourceQueryStatistics.metadata.item.returnedRecordCount'),
            String(trafficRecord.totalRecordCount)
        ))
        defaultMetadata.push(new MetadataItem(
            undefined, // don't need to reference it
            'mdi-counter',
            i18n.global.t('trafficViewer.recordHistory.record.type.sourceQueryStatistics.metadata.item.totalRecordCount'),
            String(trafficRecord.totalRecordCount)
        ))

        return [MetadataGroup.default(defaultMetadata)]
    }

}
