import { TabParams } from '@/modules/workspace/tab/model/TabParams'
import { ServerStatusTabParamsDto } from './ServerStatusTabParamsDto'
import { ExecutableTabRequest } from '@/modules/workspace/tab/model/ExecutableTabRequest'
import { Connection } from '@/modules/connection/model/Connection'

export class ServerStatusTabParams implements TabParams<ServerStatusTabParamsDto>, ExecutableTabRequest {
    readonly executeOnOpen: boolean
    readonly connection: Connection

    constructor(connection: Connection, executeOnOpen: boolean = false) {
        this.connection = connection
        this.executeOnOpen = executeOnOpen
    }

    toSerializable(): ServerStatusTabParamsDto {
        return {
            connection: this.connection
        }
    }

}
