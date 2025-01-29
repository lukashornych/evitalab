import { TrafficRecordVisualiser } from '@/modules/traffic-viewer/service/TrafficRecordVisualiser'
import { EntityFetchContainer } from '@/modules/connection/model/traffic/EntityFetchContainer'
import { TrafficRecord } from '@/modules/connection/model/traffic/TrafficRecord'
import { TrafficRecordVisualisationContext } from '../model/TrafficRecordVisualisationContext'
import {
    Action,
    MetadataGroup, MetadataItem,
    TrafficRecordVisualisationDefinition
} from '../model/TrafficRecordVisualisationDefinition'
import { i18n } from '@/vue-plugins/i18n'
import Immutable from 'immutable'
import { EvitaQLConsoleTabData } from '@/modules/evitaql-console/console/workspace/model/EvitaQLConsoleTabData'
import { WorkspaceService } from '@/modules/workspace/service/WorkspaceService'
import { EvitaQLConsoleTabFactory } from '@/modules/evitaql-console/console/workspace/service/EvitaQLConsoleTabFactory'

/**
 * Visualises entity fetch container.
 */
export class EntityFetchContainerVisualiser extends TrafficRecordVisualiser<EntityFetchContainer> {

    private readonly workspaceService: WorkspaceService
    private readonly evitaQLConsoleTabFactory: EvitaQLConsoleTabFactory

    constructor(workspaceService: WorkspaceService, evitaQLConsoleTabFactory: EvitaQLConsoleTabFactory) {
        super()
        this.workspaceService = workspaceService
        this.evitaQLConsoleTabFactory = evitaQLConsoleTabFactory
    }

    canVisualise(trafficRecord: TrafficRecord): boolean {
        return trafficRecord instanceof EntityFetchContainer
    }

    visualise(ctx: TrafficRecordVisualisationContext, trafficRecord: EntityFetchContainer): TrafficRecordVisualisationDefinition {
        return new TrafficRecordVisualisationDefinition(
            trafficRecord,
            i18n.global.t('trafficViewer.recordHistory.record.type.fetch.title', { primaryKey: trafficRecord.primaryKey }),
            undefined,
            this.constructMetadata(trafficRecord),
            this.constructActions(ctx, trafficRecord)
        )
    }

    private constructMetadata(trafficRecord: EntityFetchContainer): MetadataGroup[] {
        const defaultMetadata: MetadataItem[] = []

        defaultMetadata.push(MetadataItem.created(trafficRecord.created))
        defaultMetadata.push(MetadataItem.finishedStatus(trafficRecord.finishedWithError))
        defaultMetadata.push(MetadataItem.duration(trafficRecord.duration, [10, 20]))
        defaultMetadata.push(MetadataItem.ioFetchedSizeBytes(trafficRecord.ioFetchedSizeBytes))
        defaultMetadata.push(MetadataItem.ioFetchCount(trafficRecord.ioFetchCount))

        return [MetadataGroup.default(defaultMetadata)]
    }

    private constructActions(ctx: TrafficRecordVisualisationContext,
                             trafficRecord: EntityFetchContainer): Immutable.List<Action> {
        const actions: Action[] = []

        actions.push(new Action(
            i18n.global.t('trafficViewer.recordHistory.record.type.fetch.action.query'),
            'mdi-play',
            () => this.workspaceService.createTab(
                this.evitaQLConsoleTabFactory.createNew(
                    ctx.dataPointer.connection,
                    ctx.dataPointer.catalogName,
                    new EvitaQLConsoleTabData(trafficRecord.query)
                )
            )
        ))

        return Immutable.List(actions)
    }
}
