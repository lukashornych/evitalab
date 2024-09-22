import { TabParams } from "@/modules/workspace/tab/model/TabParams";
import { BackupViewerTabParamsDto } from "./BackupViewerTabParamsDto";
import { ExecutableTabRequest } from "@/modules/workspace/tab/model/ExecutableTabRequest";
import { Connection } from "@/modules/connection/model/Connection";

export class BackupViewerTabParams implements TabParams<BackupViewerTabParamsDto>, ExecutableTabRequest {
    readonly executeOnOpen: boolean
    readonly connection: Connection
    readonly catalogName: string

    constructor(connection: Connection, catalogName: string, executeOnOpen: boolean = false) {
        this.connection = connection
        this.executeOnOpen = executeOnOpen
        this.catalogName = catalogName
    }
    toSerializable(): BackupViewerTabParamsDto {
        return {
            connection: this.connection,
            catalogName: this.catalogName
        }
    }
}
