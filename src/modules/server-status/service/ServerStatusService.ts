import { EvitaDBDriverResolver } from '@/modules/connection/driver/EvitaDBDriverResolver'
import { Connection } from '@/modules/connection/model/Connection'
import { ApiReadiness } from '@/modules/connection/model/data/ApiReadiness'
import { ApiServerStatus } from '@/modules/connection/model/data/ApiServerStatus'
import { ServerStatus } from '@/modules/connection/model/data/ServerStatus'
import { mandatoryInject } from '@/utils/reactivity'
import { InjectionKey } from 'vue'

export const serverStatusServiceInjectionKey: InjectionKey<ServerStatusService> = Symbol('serverStatusService')

// todo docs
export class ServerStatusService {
    private readonly evitaDBDriverResolver: EvitaDBDriverResolver

    constructor(evitaDBDriver: EvitaDBDriverResolver) {
        this.evitaDBDriverResolver = evitaDBDriver
    }

    async getServerStatistics(connection: Connection): Promise<ServerStatus> {
        const driver = await this.evitaDBDriverResolver.resolveDriver(connection)
        return await driver.getServerDetails(connection)
    }

    async getApiReadiness(connection: Connection): Promise<ApiReadiness> {
        const driver = await this.evitaDBDriverResolver.resolveDriver(connection)
        return await driver.getApiReadiness(connection);
    }

    async getServerStatus(connection: Connection):Promise<ApiServerStatus> {
        const driver = await this.evitaDBDriverResolver.resolveDriver(connection)
        return await driver.getServerStatus(connection)
    }

    async getRuntimeConfiguration(connection: Connection):Promise<string> {
        const driver = await this.evitaDBDriverResolver.resolveDriver(connection)
        return await driver.getRuntimeConfig(connection)
    }
}

export const useServerStatusService = (): ServerStatusService => {
    return mandatoryInject(serverStatusServiceInjectionKey) as ServerStatusService
}
