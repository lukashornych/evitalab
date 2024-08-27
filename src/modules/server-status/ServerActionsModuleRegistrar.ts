import { ModuleRegistrar } from '@/ModuleRegistrar'
import { ModuleContextBuilder } from '@/ModuleContextBuilder'
import { EvitaDBDriverResolver, evitaDBDriverResolverInjectionKey } from '../connection/driver/EvitaDBDriverResolver'
import {
    ServerStatusService,
    serverStatusServiceInjectionKey
} from '@/modules/server-status/service/ServerStatusService'

// todo docs
export class ServerActionsModuleRegistrar implements ModuleRegistrar {

    register(builder: ModuleContextBuilder): void {
        const evitaDBDriverResolver: EvitaDBDriverResolver = builder.inject(evitaDBDriverResolverInjectionKey)
        const serverStatusService: ServerStatusService = new ServerStatusService(evitaDBDriverResolver)
        builder.provide(serverStatusServiceInjectionKey, serverStatusService)
    }
}
