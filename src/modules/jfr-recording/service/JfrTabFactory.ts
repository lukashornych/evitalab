import { InjectionKey } from 'vue'
import { JfrService } from '@/modules/jfr-recording/service/JfrService'
import { ConnectionService } from '@/modules/connection/service/ConnectionService'
import { Connection } from '@/modules/connection/model/Connection'
import { SchemaViewerTabDefinition } from '@/modules/schema-viewer/viewer/workspace/model/SchemaViewerTabDefinition'
import { JfrVisualizerDefinition } from '@/modules/jfr-recording/model/JfrVisualizerDefinition'
import { JfrVisualizerTabParams } from '@/modules/jfr-recording/model/JfrVisualizerTabParams'
import { mandatoryInject } from '@/utils/reactivity'
import { TabParamsDto } from '@/modules/workspace/tab/model/TabParamsDto'
import { JfrVisualizerTabParamsDto } from '@/modules/jfr-recording/model/JfrVisualizerTabParamsDto'

export const jfrTabFactoryInjectionKey: InjectionKey<JfrTabFactory> = Symbol('JfrTabFactory');

export class JfrTabFactory {
    private readonly connectionService: ConnectionService

    constructor(connectionService: ConnectionService) {
        this.connectionService = connectionService
    }

    createNew(connection: Connection, excutableOnOpen: boolean = false): JfrVisualizerDefinition {
        return new JfrVisualizerDefinition('JFR Recordings', this.createTabParams(connection, excutableOnOpen))
    }

    private createTabParams(connection: Connection, executeOnOpen: boolean = false) {
        return new JfrVisualizerTabParams(connection, executeOnOpen)
    }

    restoreFromJson(paramsJson: TabParamsDto, dataJson?: TabParamsDto):JfrVisualizerDefinition {
        const params: JfrVisualizerTabParamsDto = paramsJson as JfrVisualizerTabParamsDto
        return new JfrVisualizerDefinition('JFR Recordings', this.createTabParams(this.connectionService.getConnection(params.connection.id)))
    }
}

export const useJfrTabFactory = ():JfrTabFactory => {
    return mandatoryInject(jfrTabFactoryInjectionKey) as JfrTabFactory
}
