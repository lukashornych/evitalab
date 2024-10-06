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
        return new ServerStatusTabDefinition(
            this.constructTitle(connection),
            this.createTabParams(connection, executeOnOpen))
    }

    private createTabParams(connection: Connection, executeOnOpen: boolean = false): ServerStatusTabParams {
        return new ServerStatusTabParams(connection, executeOnOpen)
    }

    restoreFromJson(paramsJson: TabParamsDto): ServerStatusTabDefinition {
        // todo lho fix params retore
        const params: ServerStatusTabParamsDto = paramsJson as ServerStatusTabParams
        return new ServerStatusTabDefinition(
            this.constructTitle(params.connection),
            new ServerStatusTabParams(this.connectionService.getConnection(params.connection.id))
        )
    }

    private constructTitle(connection: Connection): string {
        // todo i18n
        return `Server [${connection.name}]`
    }
}

export const useServerStatusTabFactory = (): ServerStatusTabFactory => {
    return mandatoryInject(serverStatusTabFactoryInjectionKey) as ServerStatusTabFactory
}
