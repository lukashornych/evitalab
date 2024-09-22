import { Connection } from "@/modules/connection/model/Connection";
import { ConnectionService } from "@/modules/connection/service/ConnectionService";
import { mandatoryInject } from "@/utils/reactivity";
import { InjectionKey } from "vue";
import { BackupViewerDefinition } from "../model/BackupViewerDefinition";
import { TabParamsDto } from "@/modules/workspace/tab/model/TabParamsDto";
import { TabDataDto } from "@/modules/workspace/tab/model/TabDataDto";
import { BackupViewerTabParamsDto } from "../model/BackupViewerTabParamsDto";
import { BackupViewerTabParams } from '@/modules/backup-viewer/model/BackupViewerTabParams'

export const backupsTabFactoryInjectionKey: InjectionKey<BackupViewerTabFactory> = Symbol('BackupsTabFactory')

export class BackupViewerTabFactory {
    private readonly connectionService: ConnectionService

    constructor(connectionService: ConnectionService){
        this.connectionService = connectionService
    }

    createNew(connection: Connection, catalogName: string, executeOnOpen: boolean = false):BackupViewerDefinition {
        return new BackupViewerDefinition('Backups', this.createTabParams(connection, catalogName, executeOnOpen))
    }

    private createTabParams(connection: Connection, catalogName: string, executeOnOpen: boolean = false):BackupViewerTabParams {
        return new BackupViewerTabParams(connection, catalogName, executeOnOpen)
    }

    restoreFromJson(paramsJson: TabParamsDto, dataJson?: TabDataDto): BackupViewerDefinition {
        const params: BackupViewerTabParamsDto = paramsJson as BackupViewerTabParams
        return new BackupViewerDefinition('Backups', this.createTabParams(this.connectionService.getConnection(params.connection.id), params.catalogName))
    }
}

export const useBackupsTabFactory = (): BackupViewerTabFactory => {
    return mandatoryInject(backupsTabFactoryInjectionKey) as BackupViewerTabFactory
}
