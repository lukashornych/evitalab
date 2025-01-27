import { TabDataDto } from '@/modules/workspace/tab/model/TabDataDto'
import { OffsetDateTime } from '@/modules/connection/model/data-type/OffsetDateTime'
import { TrafficRecordType } from '@/modules/connection/model/traffic/TrafficRecordType'
import { Label } from '@/modules/connection/model/traffic/Label'

export interface TrafficRecordHistoryViewerTabDataDto extends TabDataDto {

    readonly since?: OffsetDateTime
    readonly types?: TrafficRecordType[]
    readonly sessionId?: string
    readonly longerThanMilliseconds?: number
    readonly fetchingMoreBytesThan?: number
    readonly labels?: Label[]
}
