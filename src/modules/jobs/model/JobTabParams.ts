import { TabParams } from '@/modules/workspace/tab/model/TabParams'
import { JobTabParamsDto } from '@/modules/jobs/model/JobTabParamsDto'
import { ExecutableTabRequest } from '@/modules/workspace/tab/model/ExecutableTabRequest'
import { Connection } from '@/modules/connection/model/Connection'

export class JobTabParams implements TabParams<JobTabParamsDto>, ExecutableTabRequest{
    readonly  executeOnOpen: boolean
    readonly connection: Connection


    constructor(connection: Connection, executeOnOpen: boolean = false) {
        this.executeOnOpen = executeOnOpen
        this.connection = connection
    }

    toSerializable(): JobTabParamsDto {
        return {
            connection: this.connection
        }
    }
}
