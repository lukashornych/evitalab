import { TabData } from '@/modules/workspace/tab/model/TabData'
import {
    TrafficRecordHistoryViewerTabDataDto
} from '@/modules/traffic-viewer/model/TrafficRecordHistoryViewerTabDataDto'
import { OffsetDateTime } from '@/modules/connection/model/data-type/OffsetDateTime'
import { Uuid } from '@/modules/connection/model/data-type/Uuid'
import { Duration } from 'luxon'
import { Label } from '@/modules/connection/model/traffic/Label'
import { UserTrafficRecordType } from '@/modules/traffic-viewer/model/UserTrafficRecordType'

export class TrafficRecordHistoryViewerTabData implements TabData<TrafficRecordHistoryViewerTabDataDto> {

    readonly since?: OffsetDateTime
    readonly types?: UserTrafficRecordType[]
    readonly sessionId?: Uuid
    readonly longerThan?: Duration
    readonly fetchingMoreBytesThan?: number
    readonly labels?: Label[]

    constructor(since?: OffsetDateTime,
                types?: UserTrafficRecordType[],
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
            since: this.since != undefined
                ? {
                    seconds: String(this.since.timestamp.seconds),
                    nanos: this.since.timestamp.nanos,
                    offset: this.since.offset
                }
                : undefined,
            types: this.types,
            sessionId: this.sessionId?.toString(),
            longerThanMilliseconds: this.longerThan?.toMillis(),
            fetchingMoreBytesThan: this.fetchingMoreBytesThan,
            labels: this.labels
        }
    }
}
