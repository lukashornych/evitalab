import { HttpApiClient } from '@/modules/driver-support/service/HttpApiClient'
import { EvitaDBConnection } from '@/modules/connection/model/EvitaDBConnection'
import { ConnectionServerInfo } from '@/modules/connection/model/ConnectionServerInfo'
import { inject, InjectionKey } from 'vue'

export const key: InjectionKey<EvitaDBServerProbe> = Symbol()

/**
 * Probes a evitaDB server to gather information about the server before proper connection with proper driver
 * can be established.
 */
export class EvitaDBServerProbe extends HttpApiClient {

    async fetchServerInfo(connection: EvitaDBConnection): Promise<ConnectionServerInfo> {
        try {
            const responseBody = await this.httpClient.get(connection.systemUrl).json()
            return ConnectionServerInfo.fromJson(responseBody)
        } catch (e: any) {
            throw this.handleCallError(e, connection)
        }
    }
}

export const useEvitaDBServerProbe = (): EvitaDBServerProbe => {
    return inject(key) as EvitaDBServerProbe
}
