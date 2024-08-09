import { ModuleRegistrar } from '@/ModuleRegistrar'
import { ModuleContextBuilder } from '@/ModuleContextBuilder'
import { DetailViewerService, detailViewerServiceInjectionKey } from '@/modules/server-actions/server-status/service/ServerStatusService'
import { EvitaDBDriverResolver, evitaDBDriverResolverInjectionKey } from '../connection/driver/EvitaDBDriverResolver'

// todo docs
export class ServerActionsModuleRegistrar implements ModuleRegistrar {

    register(builder: ModuleContextBuilder): void {
        const evitaDBDriverResolver: EvitaDBDriverResolver = builder.inject(evitaDBDriverResolverInjectionKey)
        const detailViewerService: DetailViewerService = new DetailViewerService(evitaDBDriverResolver)
        builder.provide(detailViewerServiceInjectionKey, detailViewerService)
    }
}
