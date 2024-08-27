import { EvitaDBDriverResolver } from "@/modules/connection/driver/EvitaDBDriverResolver"
import { Connection } from "@/modules/connection/model/Connection"
import { OffsetDateTime } from "@/modules/connection/model/data-type/OffsetDateTime"
import { CatalogVersionAtResponse } from "@/modules/connection/model/data/CatalogVersionAtResponse"
import { FilesToFetch } from "@/modules/connection/model/data/FilesToFetch"
import { TaskStatus } from "@/modules/connection/model/data/TaskStatus"
import { mandatoryInject } from "@/utils/reactivity"
import { InjectionKey } from "vue"

export const backupsServiceInjectionKey: InjectionKey<BackupsService> = Symbol('backupsService')

export class BackupsService {
    private readonly evitaDBDriverResolver: EvitaDBDriverResolver

    constructor(evitaDBDriver: EvitaDBDriverResolver) {
        this.evitaDBDriverResolver = evitaDBDriver
    }

    async getMinimalBackupDate(connection: Connection, catalogName: string): Promise<CatalogVersionAtResponse> {
        const driver = await this.evitaDBDriverResolver.resolveDriver(connection)
        return driver.getMinimalBackupDate(connection,catalogName);
    }

    async backupCatalog(connection: Connection, catalogName: string, includingWAL: boolean, pastMoment: OffsetDateTime):Promise<TaskStatus> {
        const driver = await this.evitaDBDriverResolver.resolveDriver(connection)
        return driver.createBackup(connection, catalogName, includingWAL, pastMoment)
    }

    async getAllBackups(connection: Connection, pageNumber: number, pageSize: number):Promise<FilesToFetch>{
        const driver = await this.evitaDBDriverResolver.resolveDriver(connection)
        return await driver.getBackups(connection, pageNumber, pageSize)
    }
}

export const useBackupsService = (): BackupsService => {
    return mandatoryInject(backupsServiceInjectionKey) as BackupsService
}