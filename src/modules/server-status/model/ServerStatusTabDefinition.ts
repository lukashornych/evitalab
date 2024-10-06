import { TabDefinition } from '@/modules/workspace/tab/model/TabDefinition'
import { VoidTabData } from '@/modules/workspace/tab/model/void/VoidTabData'
import { ServerStatusTabParams } from './ServerStatusTabParams'
import { DefineComponent, markRaw } from 'vue'
import ServerStatus from '@/modules/server-status/component/ServerStatus.vue'

// todo docs
export class ServerStatusTabDefinition extends TabDefinition<ServerStatusTabParams, VoidTabData> {
    constructor(title: string, params: ServerStatusTabParams) {
        super(
            undefined,
            title,
            'mdi-database-outline',
            markRaw(ServerStatus as DefineComponent<any, any, any>),
            params,
            new VoidTabData()
        )
    }
}
