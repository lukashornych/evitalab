import { TrafficRecordVisualiser } from '@/modules/traffic-viewer/service/TrafficRecordVisualiser'
import { SourceQueryContainer } from '@/modules/connection/model/traffic/SourceQueryContainer'
import { TrafficRecord } from '@/modules/connection/model/traffic/TrafficRecord'
import Immutable from 'immutable'
import {
    Action, MetadataGroup,
    MetadataItem,
    MetadataItemSeverity,
    TrafficRecordVisualisationControlFlag,
    TrafficRecordVisualisationDefinition
} from '../model/TrafficRecordVisualisationDefinition'
import { i18n } from '@/vue-plugins/i18n'
import { WorkspaceService } from '@/modules/workspace/service/WorkspaceService'
import { GraphQLConsoleTabFactory } from '@/modules/graphql-console/console/workspace/service/GraphQLConsoleTabFactory'
import { TrafficRecordVisualisationContext } from '@/modules/traffic-viewer/model/TrafficRecordVisualisationContext'
import { GraphQLInstanceType } from '@/modules/graphql-console/console/model/GraphQLInstanceType'
import { GraphQLConsoleTabData } from '@/modules/graphql-console/console/workspace/model/GraphQLConsoleTabData'

/**
 * Visualises the source query container record. Uses statistics from the `SourceQueryStatisticsContainer`.
 */
export class SourceQueryContainerVisualiser extends TrafficRecordVisualiser<SourceQueryContainer> {

    private readonly workspaceService: WorkspaceService
    private readonly graphQLConsoleTabFactory: GraphQLConsoleTabFactory

    constructor(workspaceService: WorkspaceService,
                graphQLConsoleTabFactory: GraphQLConsoleTabFactory) {
        super()
        this.workspaceService = workspaceService
        this.graphQLConsoleTabFactory = graphQLConsoleTabFactory
    }

    canVisualise(trafficRecord: TrafficRecord): boolean {
        return trafficRecord instanceof SourceQueryContainer
    }

    visualise(ctx: TrafficRecordVisualisationContext,
              trafficRecord: SourceQueryContainer): TrafficRecordVisualisationDefinition {
        return new TrafficRecordVisualisationDefinition(
            trafficRecord,
            i18n.global.t('trafficViewer.recordHistory.record.type.sourceQuery.title', { queryType: trafficRecord.queryType }),
            undefined,
            this.constructMetadata(trafficRecord),
            this.constructActions(ctx, trafficRecord),
            TrafficRecordVisualisationControlFlag.ParentStart
        )
    }

    private constructMetadata(trafficRecord: SourceQueryContainer): MetadataGroup[] {
        const defaultMetadata: MetadataItem[] = []

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

    private constructActions(ctx: TrafficRecordVisualisationContext,
                             trafficRecord: SourceQueryContainer): Immutable.List<Action> {
        const actions: Action[] = []

        let queryActionCallback: (() => void) | undefined = undefined
        if (trafficRecord.queryType === QueryType.GraphQL) {
            const sourceQuery: { query: string, variables: any, extensions: any } = JSON.parse(trafficRecord.sourceQuery)
            queryActionCallback = () => this.workspaceService.createTab(
                this.graphQLConsoleTabFactory.createNew(
                    ctx.dataPointer.connection,
                    ctx.dataPointer.catalogName,
                    GraphQLInstanceType.Data,
                    new GraphQLConsoleTabData(
                        sourceQuery.query,
                        JSON.stringify(sourceQuery.variables),
                    )
                )
            )
        }
        actions.push(new Action(
            i18n.global.t('trafficViewer.recordHistory.record.type.sourceQuery.action.query'),
            'mdi-play',
            queryActionCallback
        ))

        return Immutable.List(actions)
    }
}

/**
 * Supported query types that produces source query
 */
enum QueryType {
    GraphQL = 'GraphQL',
    REST = 'REST'
}
