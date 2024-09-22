import { InjectionKey } from 'vue'
import { JfrViewerService } from '@/modules/jfr-viewer/service/JfrViewerService'
import { ConnectionService } from '@/modules/connection/service/ConnectionService'
import { Connection } from '@/modules/connection/model/Connection'
import { SchemaViewerTabDefinition } from '@/modules/schema-viewer/viewer/workspace/model/SchemaViewerTabDefinition'
import { JfrViewerDefinition } from '@/modules/jfr-viewer/model/JfrViewerDefinition'
import { JfrViewerTabParams } from '@/modules/jfr-viewer/model/JfrViewerTabParams'
import { mandatoryInject } from '@/utils/reactivity'
import { TabParamsDto } from '@/modules/workspace/tab/model/TabParamsDto'
import { JfrViewerTabParamsDto } from '@/modules/jfr-viewer/model/JfrViewerTabParamsDto'

export const jfrViewerTabFactoryInjectionKey: InjectionKey<JfrViewerTabFactory> = Symbol('jfrViewerTabFactory');

export class JfrViewerTabFactory {
    private readonly connectionService: ConnectionService

    constructor(connectionService: ConnectionService) {
        this.connectionService = connectionService
    }

    // todo lho i18n
    createNew(connection: Connection, excutableOnOpen: boolean = false): JfrViewerDefinition {
        return new JfrViewerDefinition('JFR Recordings', this.createTabParams(connection, excutableOnOpen))
    }

    private createTabParams(connection: Connection, executeOnOpen: boolean = false) {
        return new JfrViewerTabParams(connection, executeOnOpen)
    }

    restoreFromJson(paramsJson: TabParamsDto, dataJson?: TabParamsDto):JfrViewerDefinition {
        const params: JfrViewerTabParamsDto = paramsJson as JfrViewerTabParamsDto
        return new JfrViewerDefinition('JFR Recordings', this.createTabParams(this.connectionService.getConnection(params.connection.id)))
    }
}

export function useJfrViewerTabFactory(): JfrViewerTabFactory {
    return mandatoryInject(jfrViewerTabFactoryInjectionKey) as JfrViewerTabFactory
}
