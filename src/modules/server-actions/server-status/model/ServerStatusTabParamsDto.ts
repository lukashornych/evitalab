import { Connection } from '@/modules/connection/model/Connection'
import { TabDataDto } from '@/modules/workspace/tab/model/TabDataDto'

export interface ServerStatusTabParamsDto extends TabDataDto {
    readonly connection: Connection
}
