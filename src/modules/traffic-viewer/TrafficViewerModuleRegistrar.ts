import { ModuleRegistrar } from '@/ModuleRegistrar'
import { ModuleContextBuilder } from '@/ModuleContextBuilder'
import { ConnectionService, connectionServiceInjectionKey } from '@/modules/connection/service/ConnectionService'
import {
    TrafficViewerService,
    trafficViewerServiceInjectionKey
} from '@/modules/traffic-viewer/service/TrafficViewerService'

export class TrafficViewerModuleRegistrar implements ModuleRegistrar {

    register(builder: ModuleContextBuilder): void {
        const connectionService: ConnectionService = builder.inject(connectionServiceInjectionKey)
        const trafficViewerService: TrafficViewerService = new TrafficViewerService(connectionService)
        builder.provide(trafficViewerServiceInjectionKey, trafficViewerService)
    }
}
