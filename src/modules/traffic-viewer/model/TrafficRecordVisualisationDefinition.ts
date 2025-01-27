import Immutable from 'immutable'
import { Uuid } from '@/modules/connection/model/data-type/Uuid'
import { OffsetDateTime } from '@/modules/connection/model/data-type/OffsetDateTime'
import { Duration } from 'luxon'
import { i18n } from '@/vue-plugins/i18n'
import { TrafficRecord } from '@/modules/connection/model/traffic/TrafficRecord'

/**
 * Defines how a particular traffic record should be displayed in UI
 */
export class TrafficRecordVisualisationDefinition {

    readonly source: TrafficRecord
    readonly controlFlag: TrafficRecordVisualisationControlFlag

    readonly title: string
    readonly details?: string
    metadata: MetadataGroup[]
    readonly actions: Immutable.List<Action>
    private readonly _children: TrafficRecordVisualisationDefinition[] = []

    constructor(source: TrafficRecord,
                title: string,
                details: string | undefined,
                metadata: MetadataGroup[],
                actions: Immutable.List<Action>,
                controlFlag: TrafficRecordVisualisationControlFlag = TrafficRecordVisualisationControlFlag.Basic) {
        this.source = source
        this.controlFlag = controlFlag
        this.title = title
        this.details = details
        this.metadata = metadata
        this.actions = actions
    }

    addChild(childRecord: TrafficRecordVisualisationDefinition): void {
        this._children.push(childRecord)
    }

    get children(): Immutable.List<TrafficRecordVisualisationDefinition> {
        return Immutable.List(this._children)
    }

    get defaultMetadata(): MetadataGroup | undefined {
        return this.metadata.find(group => group.identifier === defaultMetadataGroupIdentifier)
    }
}

export enum TrafficRecordVisualisationControlFlag {
    Basic = 'basic',
    ParentStart = 'parentStart',
    ParentEnd = 'parentEnd'
}

export class MetadataItem {
    readonly identifier: string | undefined
    readonly icon: string
    readonly tooltip: string
    readonly value: string
    readonly severity: MetadataItemSeverity
    readonly details?: string

    constructor(identifier: string | undefined, icon: string, tooltip: string, value: string, severity?: MetadataItemSeverity, details?: string) {
        this.identifier = identifier
        this.icon = icon
        this.tooltip = tooltip
        this.value = value
        this.severity = severity || MetadataItemSeverity.Info
        this.details = details
    }

    static sessionId(sessionId: Uuid): MetadataItem {
        return new MetadataItem(
            'sessionId',
            'mdi-identifier',
            i18n.global.t('trafficViewer.recordHistory.record.type.common.metadata.item.sessionId'),
            sessionId.toString()
        )
    }

    static created(created: OffsetDateTime): MetadataItem {
        return new MetadataItem(
            'created',
            'mdi-clock-outline',
            i18n.global.t('trafficViewer.recordHistory.record.type.common.metadata.item.created'),
            created.getPrettyPrintableString()
        )
    }

    static duration(duration: Duration): MetadataItem {
        const durationInMillis: number = duration.toMillis()
        let durationIndicator: MetadataItemSeverity = MetadataItemSeverity.Success
        // todo jno : verify
        if (durationInMillis > 100) {
            durationIndicator = MetadataItemSeverity.Warning
        } else if (durationInMillis > 1000) {
            durationIndicator = MetadataItemSeverity.Failure
        }

        return new MetadataItem(
            'duration',
            'mdi-timer-outline',
            i18n.global.t('trafficViewer.recordHistory.record.type.common.metadata.item.duration'),
            // note: typescript cannot comprehend that there is luxon extensions that overrides it...
            // @ts-ignore
            duration.toHuman({ smallestUnit: 'milliseconds', biggestUnit: 'milliseconds' }),
            durationIndicator
        )
    }

    static ioFetchedSizeBytes(ioFetchedSizeBytes: number): MetadataItem {
        return new MetadataItem(
            'ioFetchedSizeBytes',
            'mdi-download-network-outline',
            i18n.global.t('trafficViewer.recordHistory.record.type.common.metadata.item.ioFetchedSizeBytes.tooltip'),
            // @ts-ignore
            i18n.global.t('trafficViewer.recordHistory.record.type.common.metadata.item.ioFetchedSizeBytes.value', ioFetchedSizeBytes, { bytes: ioFetchedSizeBytes }),
        )
    }

    static ioFetchCount(ioFetchCount: number): MetadataItem {
        return new MetadataItem(
            'ioFetchedSizeBytes',
            'mdi-download-network-outline',
            i18n.global.t('trafficViewer.recordHistory.record.type.common.metadata.item.ioFetchCount.tooltip'),
            i18n.global.t('trafficViewer.recordHistory.record.type.common.metadata.item.ioFetchCount.value', { count: ioFetchCount }),
        )
    }

    static finishedStatus(finishedWithError: string | undefined): MetadataItem {
        const identifier: string = 'finishedStatus'
        if (finishedWithError == undefined) {
            return new MetadataItem(
                identifier,
                'mdi-check',
                i18n.global.t('trafficViewer.recordHistory.record.type.common.metadata.item.finishedStatus.tooltip.success'),
                i18n.global.t('trafficViewer.recordHistory.record.type.common.metadata.item.finishedStatus.status.success'),
                MetadataItemSeverity.Success
            )
        } else {
            return new MetadataItem(
                identifier,
                'mdi-alert-circle-outline',
                i18n.global.t('trafficViewer.recordHistory.record.type.common.metadata.item.finishedStatus.tooltip.error', { error: finishedWithError }),
                i18n.global.t('trafficViewer.recordHistory.record.type.common.metadata.item.finishedStatus.status.error'),
                MetadataItemSeverity.Failure
            )
        }
    }
}

export const defaultMetadataGroupIdentifier: string = 'default'

export class MetadataGroup {

    readonly identifier?: string
    readonly icon: string
    readonly tooltip: string
    readonly title?: string
    items: MetadataItem[]

    constructor(identifier: string | undefined, icon: string, tooltip: string, title: string | undefined, items: MetadataItem[]) {
        this.identifier = identifier
        this.icon = icon
        this.tooltip = tooltip
        this.title = title
        this.items = items
    }

    static default(items: MetadataItem[]): MetadataGroup {
        return new MetadataGroup(
            defaultMetadataGroupIdentifier,
            'mdi-format-list-bulleted',
            i18n.global.t('trafficViewer.recordHistory.record.type.common.metadata.group.default'),
            undefined,
            items
        )
    }
}

export enum MetadataItemSeverity {
    Success = 'success',
    Warning = 'warning',
    Failure = 'failure',
    Info = 'info'
}

export class Action {
    readonly title: string
    readonly icon: string
    readonly callback?: () => void

    constructor(title: string, icon: string, callback?: (() => void) | undefined) {
        this.title = title
        this.icon = icon
        this.callback = callback
    }
}
