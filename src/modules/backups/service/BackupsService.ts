import { EvitaDBDriverResolver } from '@/modules/connection/driver/EvitaDBDriverResolver'
import { Connection } from '@/modules/connection/model/Connection'
import { OffsetDateTime } from '@/modules/connection/model/data-type/OffsetDateTime'
import { Uuid } from '@/modules/connection/model/data-type/Uuid'
import { CatalogVersionAtResponse } from '@/modules/connection/model/data/CatalogVersionAtResponse'
import { FilesToFetch } from '@/modules/connection/model/data/FilesToFetch'
import { TaskStatus } from '@/modules/connection/model/data/TaskStatus'
import { mandatoryInject } from '@/utils/reactivity'
import { InjectionKey } from 'vue'
import {
    GrpcRestoreCatalogRequest,
    GrpcRestoreCatalogResponse
} from '@/modules/connection/driver/grpc/gen/GrpcEvitaManagementAPI_pb'

export const backupsServiceInjectionKey: InjectionKey<BackupsService> =
    Symbol('backupsService')

export class BackupsService {
    private readonly evitaDBDriverResolver: EvitaDBDriverResolver

    constructor(evitaDBDriver: EvitaDBDriverResolver) {
        this.evitaDBDriverResolver = evitaDBDriver
    }

    async getMinimalBackupDate(
        connection: Connection,
        catalogName: string
    ): Promise<CatalogVersionAtResponse> {
        const driver = await this.evitaDBDriverResolver.resolveDriver(
            connection
        )
        return driver.getMinimalBackupDate(connection, catalogName)
    }

    async backupCatalog(
        connection: Connection,
        catalogName: string,
        includingWAL: boolean,
        pastMoment: OffsetDateTime
    ): Promise<TaskStatus> {
        const driver = await this.evitaDBDriverResolver.resolveDriver(
            connection
        )
        return driver.createBackup(
            connection,
            catalogName,
            includingWAL,
            pastMoment
        )
    }

    async getAllBackups(
        connection: Connection,
        pageNumber: number,
        pageSize: number
    ): Promise<FilesToFetch> {
        const driver = await this.evitaDBDriverResolver.resolveDriver(
            connection
        )
        return await driver.getBackups(connection, pageNumber, pageSize)
    }

    async restoreCatalog(
        connection: Connection,
        catalogName: string,
        fileId: Uuid
    ) {
        const driver = await this.evitaDBDriverResolver.resolveDriver(
            connection
        )
        return await driver.restoreCatalog(connection, catalogName, fileId)
    }

    async downloadBackup(connection: Connection, fileId: Uuid){
        const driver = await this.evitaDBDriverResolver.resolveDriver(connection)
        return await driver.downloadFile(connection, fileId)
    }

    async uploadBackup(connection: Connection, stream: AsyncIterable<GrpcRestoreCatalogRequest>):Promise<GrpcRestoreCatalogResponse>{
        const driver = await this.evitaDBDriverResolver.resolveDriver(connection)
        return await driver.uploadFile(connection, stream)
    }
}

export const useBackupsService = (): BackupsService => {
    return mandatoryInject(backupsServiceInjectionKey) as BackupsService
}
