import { Connection } from "@/modules/connection/model/Connection";
import { ConnectionService } from "@/modules/connection/service/ConnectionService";
import { mandatoryInject } from "@/utils/reactivity";
import { InjectionKey } from "vue";
import { BackupsDefinition } from "../model/BackupsDefinition";
import { BackupTabParams } from "../model/BackupsTabParams";
import { TabParamsDto } from "@/modules/workspace/tab/model/TabParamsDto";
import { TabDataDto } from "@/modules/workspace/tab/model/TabDataDto";
import { BackupsTabParamsDto } from "../model/BackupsTabParamsDto";

export const backupsTabFactoryInjectionKey: InjectionKey<BackupsTabFactory> = Symbol('BackupsTabFactory')

export class BackupsTabFactory {
    private readonly connectionService: ConnectionService

    constructor(connectionService: ConnectionService){
        this.connectionService = connectionService
    }

    createNew(connection: Connection, catalogName: string, executeOnOpen: boolean = false):BackupsDefinition {
        return new BackupsDefinition('Backups', this.createTabParams(connection, catalogName, executeOnOpen))
    }

    private createTabParams(connection: Connection, catalogName: string, executeOnOpen: boolean = false):BackupTabParams {
        return new BackupTabParams(connection, catalogName, executeOnOpen)
    }

    restoreFromJson(paramsJson: TabParamsDto, dataJson?: TabDataDto): BackupsDefinition {
        const params: BackupsTabParamsDto = paramsJson as BackupTabParams
        return new BackupsDefinition('Backups', this.createTabParams(this.connectionService.getConnection(params.connection.id), params.catalogName))
    }
}

export const useBackupsTabFactory = (): BackupsTabFactory => {
    return mandatoryInject(backupsTabFactoryInjectionKey) as BackupsTabFactory
}