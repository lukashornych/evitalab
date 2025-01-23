import { OffsetDateTime } from '@/modules/connection/model/data-type/OffsetDateTime'
import { TrafficRecordType } from '@/modules/connection/model/traffic/TrafficRecordType'
import { Uuid } from '@/modules/connection/model/data-type/Uuid'
import { Duration } from 'luxon'
import { Label } from '@/modules/connection/model/traffic/Label'

/**
 * Mutable user criteria for history filtering
 */
export class TrafficRecordHistoryCriteria {

    since?: OffsetDateTime
    types?: TrafficRecordType[]
    sessionId?: Uuid
    longerThan?: Duration
    fetchingMoreBytesThen?: number
    labels?: Label[]
}
