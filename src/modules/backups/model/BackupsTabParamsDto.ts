import { Connection } from "@/modules/connection/model/Connection";
import { TabDataDto } from "@/modules/workspace/tab/model/TabDataDto";

export interface BackupsTabParamsDto extends TabDataDto {
    readonly connection: Connection
    readonly catalogName: string
}