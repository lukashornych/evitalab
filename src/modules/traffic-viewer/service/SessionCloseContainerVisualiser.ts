import { TrafficRecord } from '@/modules/connection/model/traffic/TrafficRecord'
import { TrafficRecordVisualiser } from '@/modules/traffic-viewer/service/TrafficRecordVisualiser'
import { TrafficRecordVisualisationContext } from '../model/TrafficRecordVisualisationContext'
import {
    MetadataGroup,
    MetadataItem,
    TrafficRecordVisualisationControlFlag,
    TrafficRecordVisualisationDefinition
} from '../model/TrafficRecordVisualisationDefinition'
import { SessionCloseContainer } from '@/modules/connection/model/traffic/SessionCloseContainer'
import { SessionStartContainer } from '@/modules/connection/model/traffic/SessionStartContainer'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import Immutable from 'immutable'
import { i18n } from '@/vue-plugins/i18n'

/**
 * Session close container isn't visualised but controls the flow of rendered UI.
 * The statistics are rendered using the `SessionStartContainerVisualiser`
 */
export class SessionCloseContainerVisualiser extends TrafficRecordVisualiser<SessionCloseContainer> {

    canVisualise(trafficRecord: TrafficRecord): boolean {
        return trafficRecord instanceof SessionCloseContainer
    }

    visualise(ctx: TrafficRecordVisualisationContext,
              trafficRecord: SessionCloseContainer): TrafficRecordVisualisationDefinition {
        return new TrafficRecordVisualisationDefinition(
            trafficRecord,
            'SessionCloseContainer', // will not be displayed anywhere
            undefined,
            this.constructMetadata(trafficRecord),
            Immutable.List(),
            TrafficRecordVisualisationControlFlag.ParentEnd
        )
    }

    mergeDefinitions(ctx: TrafficRecordVisualisationContext,
                     targetVisualisationDefinition: TrafficRecordVisualisationDefinition,
                     visualisationDefinitionToMerge: TrafficRecordVisualisationDefinition): void {
        if (!(targetVisualisationDefinition.source instanceof SessionStartContainer) ||
            !(visualisationDefinitionToMerge.source instanceof SessionCloseContainer)) {
            throw new UnexpectedError(
                `Only 'SessionStartContainer' target traffic record is supported for merge with 'SessionCloseContainer'` +
                ` but target was '${targetVisualisationDefinition.source.type}' and source was '${visualisationDefinitionToMerge.source.type}'.`
            )
        }

        const defaultMetadata: MetadataGroup = targetVisualisationDefinition.defaultMetadata!
        const newMergedDefaultMetadata: MetadataItem[] = defaultMetadata.items.filter(flag => flag.identifier !== 'noStatistics')
        newMergedDefaultMetadata.push(...visualisationDefinitionToMerge.defaultMetadata!.items)

        defaultMetadata.items = newMergedDefaultMetadata
    }

    private constructMetadata(trafficRecord: SessionCloseContainer): MetadataGroup[] {
        const defaultMetadata: MetadataItem[] = []

        defaultMetadata.push(MetadataItem.finishedStatus(trafficRecord.finishedWithError))
        defaultMetadata.push(MetadataItem.duration(trafficRecord.duration, [5000, 60000]))
        defaultMetadata.push(MetadataItem.ioFetchedSizeBytes(trafficRecord.ioFetchedSizeBytes))
        defaultMetadata.push(MetadataItem.ioFetchCount(trafficRecord.ioFetchCount))
        defaultMetadata.push(new MetadataItem(
            undefined,
            'mdi-update',
            i18n.global.t('trafficViewer.recordHistory.record.type.sessionClose.metadata.item.catalogVersion'),
            String(trafficRecord.catalogVersion)
        ))
        defaultMetadata.push(new MetadataItem(
            undefined,
            'mdi-counter',
            i18n.global.t('trafficViewer.recordHistory.record.type.sessionClose.metadata.item.trafficRecordCount.tooltip'),
            // @ts-ignore
            i18n.global.t('trafficViewer.recordHistory.record.type.sessionClose.metadata.item.trafficRecordCount.value', trafficRecord.trafficRecordCount, { count: trafficRecord.trafficRecordCount }),
        ))
        defaultMetadata.push(new MetadataItem(
            undefined,
            'mdi-counter',
            i18n.global.t('trafficViewer.recordHistory.record.type.sessionClose.metadata.item.queryCount.tooltip'),
            // @ts-ignore
            i18n.global.t('trafficViewer.recordHistory.record.type.sessionClose.metadata.item.queryCount.value', trafficRecord.queryCount, { count: trafficRecord.queryCount }),
        ))
        defaultMetadata.push(new MetadataItem(
            undefined,
            'mdi-counter',
            i18n.global.t('trafficViewer.recordHistory.record.type.sessionClose.metadata.item.entityFetchCount.tooltip'),
            // @ts-ignore
            i18n.global.t('trafficViewer.recordHistory.record.type.sessionClose.metadata.item.entityFetchCount.value', trafficRecord.entityFetchCount, { count: trafficRecord.entityFetchCount }),
        ))
        defaultMetadata.push(new MetadataItem(
            undefined,
            'mdi-counter',
            i18n.global.t('trafficViewer.recordHistory.record.type.sessionClose.metadata.item.mutationCount.tooltip'),
            // @ts-ignore
            i18n.global.t('trafficViewer.recordHistory.record.type.sessionClose.metadata.item.mutationCount.value', trafficRecord.mutationCount, { count: trafficRecord.mutationCount }),
        ))

        return [MetadataGroup.default(defaultMetadata)]
    }
}
