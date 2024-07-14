import { ModuleRegistrar } from '@/ModuleRegistrar'
import {
    EvitaDBDriverResolver,
    evitaDBDriverResolverInjectionKey
} from '@/modules/connection/driver/EvitaDBDriverResolver'
import { ConnectionService, connectionServiceInjectionKey } from '@/modules/connection/service/ConnectionService'
import { ConnectionStore, useConnectionStore } from '@/modules/connection/store/connectionStore'
import { LabStorage, labStorageInjectionKey } from '@/modules/storage/LabStorage'
import { EvitaDBServerProbe, evitaDBServerProbeInjectionKey } from '@/modules/connection/service/EvitaDBServerProbe'
import { EvitaLabConfig, evitaLabConfigInjectionKey } from '@/modules/config/EvitaLabConfig'
import { ModuleContextBuilder } from '@/ModuleContextBuilder'

// todo docs
export class ConnectionModuleRegistrar implements ModuleRegistrar {

    register(builder: ModuleContextBuilder): void {
        const connectionStore: ConnectionStore = useConnectionStore()

        const evitaLabConfig: EvitaLabConfig = builder.inject(evitaLabConfigInjectionKey)
        const labStorage: LabStorage = builder.inject(labStorageInjectionKey)

        const evitaDBServerProbe: EvitaDBServerProbe = new EvitaDBServerProbe(evitaLabConfig)
        const evitaDBDriverResolver: EvitaDBDriverResolver = new EvitaDBDriverResolver(
            evitaLabConfig,
            evitaDBServerProbe
        )

        builder.provide(
            connectionServiceInjectionKey,
            ConnectionService.load(
                connectionStore,
                labStorage,
                evitaDBDriverResolver
            )
        )
        builder.provide(
            evitaDBDriverResolverInjectionKey,
            evitaDBDriverResolver
        )
        builder.provide(evitaDBServerProbeInjectionKey, evitaDBServerProbe)
    }
}
