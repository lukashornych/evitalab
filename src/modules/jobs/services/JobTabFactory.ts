import { InjectionKey } from 'vue'
import { ConnectionService } from '@/modules/connection/service/ConnectionService'
import { Connection } from '@/modules/connection/model/Connection'
import { JobDefinition } from '@/modules/jobs/model/JobDefinition'
import { JobTabParams } from '@/modules/jobs/model/JobTabParams'
import { TabParamsDto } from '@/modules/workspace/tab/model/TabParamsDto'
import { TabDataDto } from '@/modules/workspace/tab/model/TabDataDto'
import { JobTabParamsDto } from '@/modules/jobs/model/JobTabParamsDto'
import { mandatoryInject } from '@/utils/reactivity'

export const jobTabFactoryInjectionKey: InjectionKey<JobTabFactory> = Symbol('JobTabFactory')

export class JobTabFactory {
    private readonly connectionService: ConnectionService

    constructor(connectionService: ConnectionService) {
        this.connectionService = connectionService
    }

    createNew(connection: Connection, executeOnOpen: boolean = false):JobDefinition {
        return new JobDefinition('Jobs',this.createTabParams(connection, executeOnOpen))
    }

    private createTabParams(connection: Connection, executeOnOpen: boolean = false):JobTabParams {
        return new JobTabParams(connection, executeOnOpen)
    }

    restoreFromJson(paramsJson: TabParamsDto, dataJson?: TabDataDto):JobDefinition{
        const params: JobTabParamsDto = paramsJson as JobTabParamsDto
        return new JobDefinition('Jobs', this.createTabParams(this.connectionService.getConnection(params.connection.id)))
    }
}

export const useJobTabFactory = ():JobTabFactory => {
    return mandatoryInject(jobTabFactoryInjectionKey) as JobTabFactory
}
