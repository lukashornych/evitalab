import { TabParams } from "@/modules/workspace/tab/model/TabParams";
import { BackupViewerTabParamsDto } from "./BackupViewerTabParamsDto";
import { Connection } from "@/modules/connection/model/Connection";

export class BackupViewerTabParams implements TabParams<BackupViewerTabParamsDto> {

    readonly connection: Connection
    readonly catalogName: string

    constructor(connection: Connection, catalogName: string) {
        this.connection = connection
        this.catalogName = catalogName
    }
    toSerializable(): BackupViewerTabParamsDto {
        return {
            connectionId: this.connection.id,
            catalogName: this.catalogName
        }
    }
}
