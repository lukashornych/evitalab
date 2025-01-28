import { TrafficRecordVisualiser } from '@/modules/traffic-viewer/service/TrafficRecordVisualiser'
import { QueryContainer } from '@/modules/connection/model/traffic/QueryContainer'
import { TrafficRecord } from '@/modules/connection/model/traffic/TrafficRecord'
import { TrafficRecordVisualisationContext } from '../model/TrafficRecordVisualisationContext'
import {
    Action, MetadataGroup,
    MetadataItem,
    MetadataItemSeverity,
    TrafficRecordVisualisationDefinition
} from '../model/TrafficRecordVisualisationDefinition'
import { EvitaQLConsoleTabFactory } from '@/modules/evitaql-console/console/workspace/service/EvitaQLConsoleTabFactory'
import { WorkspaceService } from '@/modules/workspace/service/WorkspaceService'
import { i18n } from '@/vue-plugins/i18n'
import Immutable from 'immutable'
import { EvitaQLConsoleTabData } from '@/modules/evitaql-console/console/workspace/model/EvitaQLConsoleTabData'
import { TrafficRecordMetadataItemContext } from '@/modules/traffic-viewer/model/TrafficRecordMetadataItemContext'
import { Label } from '@/modules/connection/model/traffic/Label'

/**
 * Visualises query record.
 */
export class QueryContainerVisualiser extends TrafficRecordVisualiser<QueryContainer> {

    private readonly workspaceService: WorkspaceService
    private readonly evitaQLConsoleTabFactory: EvitaQLConsoleTabFactory

    constructor(workspaceService: WorkspaceService, evitaQLConsoleTabFactory: EvitaQLConsoleTabFactory) {
        super()
        this.workspaceService = workspaceService
        this.evitaQLConsoleTabFactory = evitaQLConsoleTabFactory
    }

    canVisualise(trafficRecord: TrafficRecord): boolean {
        return trafficRecord instanceof QueryContainer
    }

    visualise(ctx: TrafficRecordVisualisationContext, trafficRecord: QueryContainer): TrafficRecordVisualisationDefinition {
        return new TrafficRecordVisualisationDefinition(
            trafficRecord,
            i18n.global.t('trafficViewer.recordHistory.record.type.query.title'),
            trafficRecord.queryDescription,
            this.constructMetadata(trafficRecord),
            this.constructActions(ctx, trafficRecord)
        )
    }

    private constructMetadata(trafficRecord: QueryContainer): MetadataGroup[] {
        const defaultMetadata: MetadataItem[] = []

        defaultMetadata.push(MetadataItem.created(trafficRecord.created))
        defaultMetadata.push(MetadataItem.finishedStatus(trafficRecord.finishedWithError))
        defaultMetadata.push(MetadataItem.duration(trafficRecord.duration, [50, 100])) // todo lho/jno revise
        defaultMetadata.push(MetadataItem.ioFetchedSizeBytes(trafficRecord.ioFetchedSizeBytes))
        defaultMetadata.push(MetadataItem.ioFetchCount(trafficRecord.ioFetchCount))
        defaultMetadata.push(new MetadataItem(
            undefined, // don't need to reference it
            'mdi-counter',
            i18n.global.t('trafficViewer.recordHistory.record.type.query.metadata.item.totalRecordCount.tooltip'),
            // @ts-ignore
            i18n.global.t('trafficViewer.recordHistory.record.type.query.metadata.item.totalRecordCount.value', trafficRecord.totalRecordCount, { count: trafficRecord.totalRecordCount })
        ))
        defaultMetadata.push(new MetadataItem(
            undefined, // don't need to reference it
            'mdi-identifier',
            i18n.global.t('trafficViewer.recordHistory.record.type.query.metadata.item.primaryKeys.tooltip'),
            // @ts-ignore
            i18n.global.t('trafficViewer.recordHistory.record.type.query.metadata.item.primaryKeys.value', trafficRecord.primaryKeys.size, { count: trafficRecord.primaryKeys.size })
        ))

        const queryLabelsMetadata: MetadataItem[] = []

        for (const label of trafficRecord.labels) {
            queryLabelsMetadata.push(new MetadataItem(
                undefined, // don't need to reference it
                'mdi-tag-outline',
                i18n.global.t('trafficViewer.recordHistory.record.type.query.metadata.item.queryLabel'),
                label.name,
                MetadataItemSeverity.Info,
                label.value,
                (ctx: TrafficRecordMetadataItemContext) => {
                    const historyCriteriaLabels: Label[] | undefined = ctx.historyCriteria.value.labels
                    if (historyCriteriaLabels != undefined) {
                        const existingLabelUnderName = historyCriteriaLabels.findIndex(it => it.name === label.name)
                        if (existingLabelUnderName > -1) {
                            historyCriteriaLabels.splice(existingLabelUnderName, 1)
                        }
                        historyCriteriaLabels.push(label)
                    }
                }
            ))
        }

        return [
            MetadataGroup.default(defaultMetadata),
            new MetadataGroup(
                undefined,
                'mdi-tag-outline',
                i18n.global.t('trafficViewer.recordHistory.record.type.query.metadata.group.queryLabels'),
                i18n.global.t('trafficViewer.recordHistory.record.type.query.metadata.group.queryLabels'),
                queryLabelsMetadata
            )
        ]
    }

    private constructActions(ctx: TrafficRecordVisualisationContext,
                             trafficRecord: QueryContainer): Immutable.List<Action> {
        const actions: Action[] = []

        actions.push(new Action(
            i18n.global.t('trafficViewer.recordHistory.record.type.query.action.query'),
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
