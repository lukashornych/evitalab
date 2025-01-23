import { TabData } from '@/modules/workspace/tab/model/TabData'
import { TrafficRecordHistoryViewerTabDataDto } from '@/modules/traffic-viewer/model/TrafficRecordHistoryViewerTabDataDto'

export class TrafficRecordHistoryViewerTabData implements TabData<TrafficRecordHistoryViewerTabDataDto> {

    // todo lho filtry

    constructor() {
    }

    toSerializable(): TrafficRecordHistoryViewerTabDataDto {
        return {}
    }
}
