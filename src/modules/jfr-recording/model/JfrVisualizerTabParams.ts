import { TabParams } from '@/modules/workspace/tab/model/TabParams'
import { ExecutableTabRequest } from '@/modules/workspace/tab/model/ExecutableTabRequest'
import { JfrVisualizerTabParamsDto } from '@/modules/jfr-recording/model/JfrVisualizerTabParamsDto'
import { Connection } from '@/modules/connection/model/Connection'

export class JfrVisualizerTabParams implements TabParams<JfrVisualizerTabParamsDto>, ExecutableTabRequest {
    readonly  executeOnOpen: boolean
    readonly connection: Connection

    constructor(connection: Connection, executeOnOpen: boolean = false) {
        this.executeOnOpen = executeOnOpen
        this.connection = connection
    }

    toSerializable(): JfrVisualizerTabParamsDto {
        return {
            connection: this.connection,
        }
    }
}
