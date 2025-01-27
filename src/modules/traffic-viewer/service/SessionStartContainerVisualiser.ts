import { TrafficRecordVisualiser } from '@/modules/traffic-viewer/service/TrafficRecordVisualiser'
import { SessionStartContainer } from '@/modules/connection/model/traffic/SessionStartContainer'
import { TrafficRecord } from '@/modules/connection/model/traffic/TrafficRecord'
import { TrafficRecordVisualisationContext } from '../model/TrafficRecordVisualisationContext'
import {
    MetadataGroup,
    MetadataItem,
    MetadataItemSeverity,
    TrafficRecordVisualisationControlFlag,
    TrafficRecordVisualisationDefinition
} from '../model/TrafficRecordVisualisationDefinition'
import { i18n } from '@/vue-plugins/i18n'
import Immutable from 'immutable'

/**
 * Visualises start of session/transaction. It uses `SessionCloseContainer` record for more statistics.
 */
export class SessionStartContainerVisualiser extends TrafficRecordVisualiser<SessionStartContainer> {

    canVisualise(trafficRecord: TrafficRecord): boolean {
        return trafficRecord instanceof SessionStartContainer
    }

    visualise(ctx: TrafficRecordVisualisationContext, trafficRecord: SessionStartContainer): TrafficRecordVisualisationDefinition {
        return new TrafficRecordVisualisationDefinition(
            trafficRecord,
            i18n.global.t('trafficViewer.recordHistory.record.type.sessionStart.title'),
            undefined,
            this.constructMetadata(trafficRecord),
            Immutable.List(),
            TrafficRecordVisualisationControlFlag.ParentStart
        )
    }

    private constructMetadata(trafficRecord: SessionStartContainer): MetadataGroup[] {
        const defaultMetadata: MetadataItem[] = []

        defaultMetadata.push(MetadataItem.sessionId(trafficRecord.sessionId))
        defaultMetadata.push(MetadataItem.created(trafficRecord.created))
        defaultMetadata.push(new MetadataItem(
            'noStatistics',
            'mdi-alert-outline',
            i18n.global.t('trafficViewer.recordHistory.record.type.common.metadata.item.noStatistics.tooltip'),
            i18n.global.t('trafficViewer.recordHistory.record.type.common.metadata.item.noStatistics.title'),
            MetadataItemSeverity.Warning
        ))

        return [MetadataGroup.default(defaultMetadata)]
    }

}
