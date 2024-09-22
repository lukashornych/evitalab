import { TabParams } from '@/modules/workspace/tab/model/TabParams'
import { TaskViewerTabParamsDto } from '@/modules/task-viewer/model/TaskViewerTabParamsDto'
import { ExecutableTabRequest } from '@/modules/workspace/tab/model/ExecutableTabRequest'
import { Connection } from '@/modules/connection/model/Connection'

export class TaskViewerTabParams implements TabParams<TaskViewerTabParamsDto>, ExecutableTabRequest{
    readonly  executeOnOpen: boolean
    readonly connection: Connection

    constructor(connection: Connection, executeOnOpen: boolean = false) {
        this.executeOnOpen = executeOnOpen
        this.connection = connection
    }

    toSerializable(): TaskViewerTabParamsDto {
        return {
            connection: this.connection
        }
    }
}
