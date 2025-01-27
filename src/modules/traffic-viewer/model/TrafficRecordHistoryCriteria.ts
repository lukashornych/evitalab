import { OffsetDateTime } from '@/modules/connection/model/data-type/OffsetDateTime'
import { TrafficRecordType } from '@/modules/connection/model/traffic/TrafficRecordType'
import { Uuid } from '@/modules/connection/model/data-type/Uuid'
import { Duration } from 'luxon'
import { Label } from '@/modules/connection/model/traffic/Label'
import { UserTrafficRecordType } from '@/modules/traffic-viewer/model/UserTrafficRecordType'

/**
 * Mutable user criteria for history filtering
 */
export class TrafficRecordHistoryCriteria {

    since?: OffsetDateTime
    types?: UserTrafficRecordType[]
    sessionId?: Uuid
    longerThan?: Duration
    fetchingMoreBytesThan?: number
    labels?: Label[]

    constructor(since?: OffsetDateTime,
                types?: UserTrafficRecordType[],
                sessionId?: Uuid,
                longerThan?: Duration,
                fetchingMoreBytesThan?: number,
                labels?: Label[]) {
        this.since = since
        // todo lho filtering by types not working
        this.types = types
        // this.types = types || Object.values(UserTrafficRecordType).map(type => type as UserTrafficRecordType)
        this.sessionId = sessionId
        this.longerThan = longerThan
        this.fetchingMoreBytesThan = fetchingMoreBytesThan
        this.labels = labels
    }
}
