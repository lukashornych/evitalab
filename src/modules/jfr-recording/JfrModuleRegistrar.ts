import { ModuleRegistrar } from '@/ModuleRegistrar'
import { ModuleContextBuilder } from '@/ModuleContextBuilder'
import {
    EvitaDBDriverResolver,
    evitaDBDriverResolverInjectionKey
} from '@/modules/connection/driver/EvitaDBDriverResolver'
import { JfrService, jfrServiceInjectionKey } from '@/modules/jfr-recording/service/JfrService'

export class JfrModuleRegistrar implements ModuleRegistrar {
    register(builder: ModuleContextBuilder): void {
        const evitaDBDriverResolver: EvitaDBDriverResolver = builder.inject(evitaDBDriverResolverInjectionKey)
        const jfrService: JfrService = new JfrService(evitaDBDriverResolver)
        builder.provide(jfrServiceInjectionKey, jfrService)
    }
}
