import { InjectionKey } from 'vue'
import { ConnectionService } from '@/modules/connection/service/ConnectionService'
import { Connection } from '@/modules/connection/model/Connection'
import { TaskViewerDefinition } from '@/modules/task-viewer/model/TaskViewerDefinition'
import { TaskViewerTabParams } from '@/modules/task-viewer/model/TaskViewerTabParams'
import { TabParamsDto } from '@/modules/workspace/tab/model/TabParamsDto'
import { TabDataDto } from '@/modules/workspace/tab/model/TabDataDto'
import { TaskViewerTabParamsDto } from '@/modules/task-viewer/model/TaskViewerTabParamsDto'
import { mandatoryInject } from '@/utils/reactivity'

export const taskViewerTabFactoryInjectionKey: InjectionKey<TaskViewerTabFactory> = Symbol('taskViewerTabFactory')

export class TaskViewerTabFactory {
    private readonly connectionService: ConnectionService

    constructor(connectionService: ConnectionService) {
        this.connectionService = connectionService
    }

    // todo lho i18n
    createNew(connection: Connection, executeOnOpen: boolean = false):TaskViewerDefinition {
        return new TaskViewerDefinition('Tasks',this.createTabParams(connection, executeOnOpen))
    }

    private createTabParams(connection: Connection, executeOnOpen: boolean = false):TaskViewerTabParams {
        return new TaskViewerTabParams(connection, executeOnOpen)
    }

    restoreFromJson(paramsJson: TabParamsDto, dataJson?: TabDataDto):TaskViewerDefinition{
        const params: TaskViewerTabParamsDto = paramsJson as TaskViewerTabParamsDto
        return new TaskViewerDefinition('Tasks', this.createTabParams(this.connectionService.getConnection(params.connection.id)))
    }
}

export const useTaskViewerTabFactory = ():TaskViewerTabFactory => {
    return mandatoryInject(taskViewerTabFactoryInjectionKey) as TaskViewerTabFactory
}
