import { TabParams } from "@/modules/workspace/tab/model/TabParams";
import { BackupsTabParamsDto } from "./BackupsTabParamsDto";
import { ExecutableTabRequest } from "@/modules/workspace/tab/model/ExecutableTabRequest";
import { Connection } from "@/modules/connection/model/Connection";

export class BackupTabParams implements TabParams<BackupsTabParamsDto>, ExecutableTabRequest {
    readonly executeOnOpen: boolean
    readonly connection: Connection
    readonly catalogName: string

    constructor(connection: Connection, catalogName: string, executeOnOpen: boolean = false) {
        this.connection = connection
        this.executeOnOpen = executeOnOpen
        this.catalogName = catalogName
    }
    toSerializable(): BackupsTabParamsDto {
        return {
            connection: this.connection,
            catalogName: this.catalogName
        }
    }
}