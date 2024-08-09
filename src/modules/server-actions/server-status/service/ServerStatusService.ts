import { EvitaDBDriverResolver } from '@/modules/connection/driver/EvitaDBDriverResolver'
import { Connection } from '@/modules/connection/model/Connection'
import { ServerStatus } from '@/modules/connection/model/data/ServerStatus'
import { mandatoryInject } from '@/utils/reactivity'
import { InjectionKey } from 'vue'

export const detailViewerServiceInjectionKey: InjectionKey<DetailViewerService> = Symbol('detailViewerService')

export class DetailViewerService {
    private readonly evitaDBDriverResolver: EvitaDBDriverResolver

    constructor(evitaDBDriver: EvitaDBDriverResolver) {
        this.evitaDBDriverResolver = evitaDBDriver
    }

    async getServerStatistics(connection: Connection): Promise<ServerStatus> {
        const driver = await this.evitaDBDriverResolver.resolveDriver(connection)
        return await driver.getServerDetails(connection)
    }
}

export const useDetailViewerService = (): DetailViewerService => {
    return mandatoryInject(detailViewerServiceInjectionKey) as DetailViewerService
}
