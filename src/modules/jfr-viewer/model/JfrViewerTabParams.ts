import { TabParams } from '@/modules/workspace/tab/model/TabParams'
import { ExecutableTabRequest } from '@/modules/workspace/tab/model/ExecutableTabRequest'
import { JfrViewerTabParamsDto } from '@/modules/jfr-viewer/model/JfrViewerTabParamsDto'
import { Connection } from '@/modules/connection/model/Connection'

export class JfrViewerTabParams implements TabParams<JfrViewerTabParamsDto>, ExecutableTabRequest {
    readonly executeOnOpen: boolean
    readonly connection: Connection

    constructor(connection: Connection, executeOnOpen: boolean = false) {
        this.executeOnOpen = executeOnOpen
        this.connection = connection
    }

    toSerializable(): JfrViewerTabParamsDto {
        return {
            connection: this.connection,
        }
    }
}
