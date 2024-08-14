import { ModuleRegistrar } from '@/ModuleRegistrar'
import { ModuleContextBuilder } from '@/ModuleContextBuilder'
import { DetailViewerService, detailViewerServiceInjectionKey } from '@/modules/server-actions/server-status/service/ServerStatusService'
import { EvitaDBDriverResolver, evitaDBDriverResolverInjectionKey } from '../connection/driver/EvitaDBDriverResolver'
import { ModifyActionService, modifyActionServiceInjectionKey } from './modify/services/ModifyActionService'
import { connectionServiceInjectionKey } from '../connection/service/ConnectionService'

// todo docs
export class ServerActionsModuleRegistrar implements ModuleRegistrar {

    register(builder: ModuleContextBuilder): void {
        const evitaDBDriverResolver: EvitaDBDriverResolver = builder.inject(evitaDBDriverResolverInjectionKey)
        const connectionService = builder.inject(connectionServiceInjectionKey)
        const detailViewerService: DetailViewerService = new DetailViewerService(evitaDBDriverResolver)
        builder.provide(detailViewerServiceInjectionKey, detailViewerService)
        const modifyActionService: ModifyActionService = new ModifyActionService(connectionService)
        builder.provide(modifyActionServiceInjectionKey, modifyActionService)
    }
}
