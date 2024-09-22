import { Connection } from "@/modules/connection/model/Connection";
import { TabDataDto } from "@/modules/workspace/tab/model/TabDataDto";
import { TabParamsDto } from '@/modules/workspace/tab/model/TabParamsDto'

export interface BackupViewerTabParamsDto extends TabParamsDto {
    readonly connection: Connection
    readonly catalogName: string
}
