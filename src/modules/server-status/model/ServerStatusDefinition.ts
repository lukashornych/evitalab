import { TabDefinition } from '@/modules/workspace/tab/model/TabDefinition'
import { VoidTabData } from '@/modules/workspace/tab/model/void/VoidTabData'
import { ServerStatusTabParams } from './ServerStatusTabParams'
import { DefineComponent, markRaw } from 'vue'
import ServerDetail from '../component/ServerDetail.vue'

export class ServerStatusDefinition extends TabDefinition<ServerStatusTabParams, VoidTabData> {
    constructor(title: string, params: ServerStatusTabParams) {
        super(undefined,
            title,
            'mdi-database-outline',
            markRaw(ServerDetail as DefineComponent<any, any, any>),
            params,
            new VoidTabData()
        )
    }
}
