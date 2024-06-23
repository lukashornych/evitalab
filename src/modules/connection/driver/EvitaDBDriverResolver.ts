import { EvitaDBConnection } from '@/modules/connection/model/EvitaDBConnection'
import { EvitaDBDriver } from '@/modules/connection/driver/EvitaDBDriver'
import { ConnectionServerInfo } from '@/modules/connection/model/ConnectionServerInfo'
import { EvitaDBDriver_2024_8 } from '@/modules/connection/driver/2024_8/EvitaDBDriver_2024_8'
import semver from 'semver/preload'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { inject, InjectionKey } from 'vue'

/**
 * All supported drivers. Must be sorted from the newest one to correctly resolve version ranges
 */
const driverIndex: EvitaDBDriver[] = [
    new EvitaDBDriver_2024_8()
]

export const key: InjectionKey<EvitaDBDriverResolver> = Symbol()

/**
 * Provides correct evitaDB driver for given connection.
 */
export class EvitaDBDriverResolver {

    /**
     * Tries to find a correct driver for the given connection based on server version.
     *
     * @param connection
     */
    async resolveDriver(connection: EvitaDBConnection): Promise<EvitaDBDriver> {
        const serverInfo: ConnectionServerInfo = await connection.getServerInfo()
        for (const driver of driverIndex) {
            if (semver.gte(serverInfo.version, driver.getSupportedVersions())) {
                return driver
            }
        }
        throw new UnexpectedError(connection, `Could not driver for connection '${connection.name}' with evitaDB version '${serverInfo.version}'.`)
    }
}

export const useEvitaDBDriverResolver = (): EvitaDBDriverResolver => {
    return inject(key) as EvitaDBDriverResolver
}
