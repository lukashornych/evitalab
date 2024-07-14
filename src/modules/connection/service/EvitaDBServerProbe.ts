import { HttpApiClient } from '@/modules/driver-support/service/HttpApiClient'
import { Connection } from '@/modules/connection/model/Connection'
import { ConnectionServerInfo } from '@/modules/connection/model/ConnectionServerInfo'
import { InjectionKey } from 'vue'
import { mandatoryInject } from '@/utils/reactivity'
import { EvitaLabConfig } from '@/modules/config/EvitaLabConfig'

export const evitaDBServerProbeInjectionKey: InjectionKey<EvitaDBServerProbe> = Symbol('evitaDBServerProbe')

/**
 * Probes a evitaDB server to gather information about the server before proper connection with proper driver
 * can be established.
 */
export class EvitaDBServerProbe extends HttpApiClient {

    constructor(evitaLabConfig: EvitaLabConfig) {
        super(evitaLabConfig)
    }

    async fetchServerInfo(connection: Connection): Promise<ConnectionServerInfo> {
        try {
            const responseBody = await this.httpClient.get(`${connection.systemUrl}/status`).json()
            return ConnectionServerInfo.fromJson(responseBody)
        } catch (e: any) {
            throw this.handleCallError(e, connection)
        }
    }
}

export const useEvitaDBServerProbe = (): EvitaDBServerProbe => {
    return mandatoryInject(evitaDBServerProbeInjectionKey) as EvitaDBServerProbe
}
