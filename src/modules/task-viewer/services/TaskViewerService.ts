import { Connection } from "@/modules/connection/model/Connection";
import { Uuid } from "@/modules/connection/model/data-type/Uuid";
import { mandatoryInject } from "@/utils/reactivity";
import { InjectionKey } from "vue";
import { TaskStatuses } from '@/modules/connection/model/task/TaskStatuses'
import { TaskState } from '@/modules/connection/model/task/TaskState'
import { ConnectionService } from '@/modules/connection/service/ConnectionService'

export const taskViewerServiceInjectionKey: InjectionKey<TaskViewerService> = Symbol('taskViewerService')

export class TaskViewerService {
    private readonly connectionService: ConnectionService

    constructor(connectionService: ConnectionService) {
        this.connectionService = connectionService
    }

    async getTaskStates(connection: Connection,
                        pageNumber: number,
                        pageSize: number,
                        states?: TaskState[],
                        taskType?: string): Promise<TaskStatuses>{
        const driver = await this.connectionService.getDriver(connection)
        return await driver.getTaskStatuses(connection, pageNumber, pageSize, states, taskType)
    }

    async cancelTask(connection: Connection, taskId: Uuid): Promise<boolean> {
        const driver = await this.connectionService.getDriver(connection)
        return await driver.cancelTask(connection, taskId)
    }
}

export function useTaskViewerService(): TaskViewerService {
    return mandatoryInject(taskViewerServiceInjectionKey) as TaskViewerService
}
