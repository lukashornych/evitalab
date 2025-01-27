import { TabData } from '@/modules/workspace/tab/model/TabData'
import { TrafficRecordHistoryViewerTabDataDto } from '@/modules/traffic-viewer/model/TrafficRecordHistoryViewerTabDataDto'
import { OffsetDateTime } from '@/modules/connection/model/data-type/OffsetDateTime'
import { TrafficRecordType } from '@/modules/connection/model/traffic/TrafficRecordType'
import { Uuid } from '@/modules/connection/model/data-type/Uuid'
import { Duration } from 'luxon'
import { Label } from '@/modules/connection/model/traffic/Label'

export class TrafficRecordHistoryViewerTabData implements TabData<TrafficRecordHistoryViewerTabDataDto> {

    readonly since?: OffsetDateTime
    readonly types?: TrafficRecordType[]
    readonly sessionId?: Uuid
    readonly longerThan?: Duration
    readonly fetchingMoreBytesThan?: number
    readonly labels?: Label[]

    constructor(since?: OffsetDateTime,
                types?: TrafficRecordType[],
                sessionId?: Uuid,
                longerThan?: Duration,
                fetchingMoreBytesThan?: number,
                labels?: Label[]) {
        this.since = since
        this.types = types
        this.sessionId = sessionId
        this.longerThan = longerThan
        this.fetchingMoreBytesThan = fetchingMoreBytesThan
        this.labels = labels
    }

    toSerializable(): TrafficRecordHistoryViewerTabDataDto {
        return {
            since: this.since,
            types: this.types,
            sessionId: this.sessionId?.toString(),
            longerThanMilliseconds: this.longerThan?.toMillis(),
            fetchingMoreBytesThan: this.fetchingMoreBytesThan,
            labels: this.labels
        }
    }
}
