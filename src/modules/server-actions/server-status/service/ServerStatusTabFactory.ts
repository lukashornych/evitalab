import { Connection } from '@/modules/connection/model/Connection'
import { ServerStatusDefinition } from '../model/ServerStatusDefinition'
import { ServerStatusTabParams } from '../model/ServerStatusTabParams'
import { mandatoryInject } from '@/utils/reactivity'
import { InjectionKey } from 'vue'
import { TabParamsDto } from '@/modules/workspace/tab/model/TabParamsDto'
import { TabDataDto } from '@/modules/workspace/tab/model/TabDataDto'
import { ServerStatusTabParamsDto } from '../model/ServerStatusTabParamsDto'
import { ConnectionService } from '@/modules/connection/service/ConnectionService'

export const detailViewerTabFactoryInjectionKey: InjectionKey<ServerStatusTabFactory> = Symbol('DetailViewerTabFactory')

export class ServerStatusTabFactory {
    private readonly connectionService: ConnectionService

    constructor(connectionService: ConnectionService) {
        this.connectionService = connectionService
    }

    createNew(connection: Connection, executeOnOpen: boolean = false):ServerStatusDefinition {
        return new ServerStatusDefinition('Status', this.createTabParams(connection, executeOnOpen))
    }

    private createTabParams(connection: Connection, executeOnOpen: boolean = false): ServerStatusTabParams {
        return new ServerStatusTabParams(connection, executeOnOpen)
    }

    restoreFromJson(paramsJson: TabParamsDto, dataJson?: TabDataDto): ServerStatusDefinition { 
        const params: ServerStatusTabParamsDto = paramsJson as ServerStatusTabParams
        return new ServerStatusDefinition('Status', new ServerStatusTabParams(this.connectionService.getConnection(params.connection.id)))
    }
}

export const useDetailViewerTabFactory = (): ServerStatusTabFactory => {
    return mandatoryInject(detailViewerTabFactoryInjectionKey) as ServerStatusTabFactory
}
