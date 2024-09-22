import { TabParamsDto } from '@/modules/workspace/tab/model/TabParamsDto'
import { Connection } from '@/modules/connection/model/Connection'

export interface JfrViewerTabParamsDto extends TabParamsDto {
    readonly connection: Connection
}
