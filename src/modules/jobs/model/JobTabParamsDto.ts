import { Connection } from '@/modules/connection/model/Connection'
import { TabParamsDto } from '@/modules/workspace/tab/model/TabParamsDto'

export interface JobTabParamsDto extends TabParamsDto{
    readonly connection: Connection
}
