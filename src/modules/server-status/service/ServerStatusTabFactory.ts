import { Connection } from '@/modules/connection/model/Connection'
import { ServerStatusTabDefinition } from '../model/ServerStatusTabDefinition'
import { ServerStatusTabParams } from '../model/ServerStatusTabParams'
import { mandatoryInject } from '@/utils/reactivity'
import { InjectionKey } from 'vue'
import { TabParamsDto } from '@/modules/workspace/tab/model/TabParamsDto'
import { ServerStatusTabParamsDto } from '../model/ServerStatusTabParamsDto'
import { ConnectionService } from '@/modules/connection/service/ConnectionService'

export const serverStatusTabFactoryInjectionKey: InjectionKey<ServerStatusTabFactory> = Symbol('serverStatusTabFactory')

export class ServerStatusTabFactory {
    private readonly connectionService: ConnectionService

    constructor(connectionService: ConnectionService) {
        this.connectionService = connectionService
    }

    createNew(connection: Connection, executeOnOpen: boolean = false) {
        return new ServerStatusTabDefinition(this.createTabParams(connection, executeOnOpen))
    }

    private createTabParams(connection: Connection, executeOnOpen: boolean = false): ServerStatusTabParams {
        return new ServerStatusTabParams(connection, executeOnOpen)
    }

    restoreFromJson(paramsJson: TabParamsDto): ServerStatusTabDefinition {
        const params: ServerStatusTabParamsDto = paramsJson as ServerStatusTabParams
        return new ServerStatusTabDefinition(new ServerStatusTabParams(this.connectionService.getConnection(params.connection.id)))
    }
}

export const useServerStatusTabFactory = (): ServerStatusTabFactory => {
    return mandatoryInject(serverStatusTabFactoryInjectionKey) as ServerStatusTabFactory
}
