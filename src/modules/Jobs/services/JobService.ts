import { EvitaDBDriverResolver } from "@/modules/connection/driver/EvitaDBDriverResolver";
import { Connection } from "@/modules/connection/model/Connection";
import { TaskSimplifiedState } from "@/modules/connection/model/data/TaskSimplifiedState";
import { TaskStatuses } from "@/modules/connection/model/data/TaskStatuses";
import { mandatoryInject } from "@/utils/reactivity";
import { InjectionKey } from "vue";

export const jobServiceInjectionKey: InjectionKey<JobService> = Symbol('jobService')

export class JobService {
    private readonly evitaDBDriverResolver: EvitaDBDriverResolver

    constructor(evitaDBDriver: EvitaDBDriverResolver) {
        this.evitaDBDriverResolver = evitaDBDriver
    }

    async getJobs(connection: Connection, pageNumber: number, pageSize: number, simplifiedState?: TaskSimplifiedState[], taskType?: string):Promise<TaskStatuses>{
        const driver = await this.evitaDBDriverResolver.resolveDriver(connection)
        return await driver.getAciveJobs(connection, pageNumber, pageSize, simplifiedState, taskType)
    }
}

export const useJobService = (): JobService => {
    return mandatoryInject(jobServiceInjectionKey) as JobService
}