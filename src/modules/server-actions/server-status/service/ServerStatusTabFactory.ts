import { Connection } from '@/modules/connection/model/Connection'
import { ServerStatusDefinition } from '../model/ServerStatusDefinition'
import { ServerStatusTabParams } from '../model/ServerStatusTabParams'
import { mandatoryInject } from '@/utils/reactivity'
import { InjectionKey } from 'vue'

export const detailViewerTabFactoryInjectionKey: InjectionKey<ServerStatusTabFactory> = Symbol('DetailViewerTabFactory')

export class ServerStatusTabFactory {

    createNew(connection: Connection, executeOnOpen: boolean = false) {
        return new ServerStatusDefinition('Status', this.createTabParams(connection, executeOnOpen))
    }

    private createTabParams(connection: Connection, executeOnOpen: boolean = false): ServerStatusTabParams {
        return new ServerStatusTabParams(connection, executeOnOpen)
    }
}

export const useDetailViewerTabFactory = (): ServerStatusTabFactory => {
    return mandatoryInject(detailViewerTabFactoryInjectionKey) as ServerStatusTabFactory
}
