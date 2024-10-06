import { Connection } from '@/modules/connection/model/Connection'
import { OffsetDateTime } from '@/modules/connection/model/data-type/OffsetDateTime'
import { Uuid } from '@/modules/connection/model/data-type/Uuid'
import { mandatoryInject } from '@/utils/reactivity'
import { InjectionKey } from 'vue'
import {
    GrpcRestoreCatalogRequest,
    GrpcRestoreCatalogResponse
} from '@/modules/connection/driver/grpc/gen/GrpcEvitaManagementAPI_pb'
import { ConnectionService } from '@/modules/connection/service/ConnectionService'
import { CatalogVersionAtResponse } from '@/modules/connection/model/CatalogVersionAtResponse'
import { TaskStatus } from '@/modules/connection/model/task/TaskStatus'
import { ClassifierValidationErrorType } from '@/modules/connection/model/data-type/ClassifierValidationErrorType'
import { EvitaDBDriver } from '@/modules/connection/driver/EvitaDBDriver'
import { ClassifierType } from '@/modules/connection/model/data-type/ClassifierType'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { PaginatedList } from '@/modules/connection/model/PaginatedList'
import { ServerFile } from '@/modules/connection/model/server-file/ServerFile'
import { backupTaskName } from '@/modules/backup-viewer/model/BackupTask'

export const backupViewerServiceInjectionKey: InjectionKey<BackupViewerService> = Symbol('backupViewerService')

export class BackupViewerService {
    private readonly connectionService: ConnectionService

    constructor(connectionService: ConnectionService) {
        this.connectionService = connectionService
    }

    async getMinimalBackupDate(
        connection: Connection,
        catalogName: string
    ): Promise<CatalogVersionAtResponse> {
        const driver = await this.connectionService.getDriver(connection)
        return driver.getMinimalBackupDate(connection, catalogName)
    }

    async backupCatalog(
        connection: Connection,
        catalogName: string,
        includingWAL: boolean,
        pastMoment: OffsetDateTime | undefined
    ): Promise<TaskStatus> {
        const driver = await this.connectionService.getDriver(connection)
        return driver.createBackup(
            connection,
            catalogName,
            includingWAL,
            pastMoment
        )
    }

    async getBackupFiles(
        connection: Connection,
        pageNumber: number,
        pageSize: number
    ): Promise<PaginatedList<ServerFile>> {
        const driver = await this.connectionService.getDriver(connection)
        return await driver.getFilesToFetch(connection, backupTaskName, pageNumber, pageSize)
    }

    async restoreCatalog(
        connection: Connection,
        fileId: Uuid,
        catalogName: string
    ): Promise<TaskStatus> {
        const driver = await this.connectionService.getDriver(connection)
        return await driver.restoreCatalog(connection, fileId, catalogName)
    }

    async downloadBackup(connection: Connection, fileId: Uuid): Promise<Blob> {
        const driver = await this.connectionService.getDriver(connection)
        return await driver.downloadFile(connection, fileId)
    }

    async uploadBackup(connection: Connection, stream: AsyncIterable<GrpcRestoreCatalogRequest>): Promise<GrpcRestoreCatalogResponse>{
        const driver = await this.connectionService.getDriver(connection)
        return await driver.uploadFile(connection, stream)
    }

    async isCatalogNameValid(connection: Connection, catalogName: string): Promise<ClassifierValidationErrorType | undefined> {
        const driver: EvitaDBDriver = await this.connectionService.getDriver(connection)
        return driver.isClassifierValid(connection, ClassifierType.Catalog, catalogName)
    }

    async isCatalogNameAvailable(connection: Connection, catalogName: string): Promise<boolean> {
        const driver: EvitaDBDriver = await this.connectionService.getDriver(connection)
        try {
            await driver.getCatalog(connection, catalogName)
        } catch (e) {
            // todo lho better exceptions
            if (e instanceof UnexpectedError) {
                // catalog not found
                return true
            }
        }
        return false
    }


// todo lho prototype for local file restore
// async function upload(){
//     await backupViewerService.uploadBackup(props.params.connection, sendCatalogChunks())
// }
//
// async function* sendCatalogChunks(): AsyncIterable<GrpcRestoreCatalogRequest> {
//     if (!file.value) {
//         return;
//     }
//
//     const CHUNK_SIZE = 64 * 1024; // 64 KB chunks
//     const fileReader = new FileReader();
//     let offset = 0;
//     const totalSize = file.value.size;
//
//     // Helper function to read a chunk
//     function readChunk() {
//         if (offset >= totalSize) {
//             fileReader.abort();
//             return;
//         }
//         const chunk = file.value!.slice(offset, offset + CHUNK_SIZE);
//         fileReader.readAsArrayBuffer(chunk);
//     }
//
//     // Promise to handle the load of one chunk
//     const onLoadPromise = () => {
//         return new Promise<Uint8Array>((resolve, reject) => {
//             fileReader.onload = (event: ProgressEvent<FileReader>) => {
//                 if (event.target?.result) {
//                     const arrayBuffer = event.target.result as ArrayBuffer;
//                     const fileChunk = new Uint8Array(arrayBuffer);
//                     offset += CHUNK_SIZE;
//                     resolve(fileChunk);
//                 }
//             };
//
//             fileReader.onerror = () => {
//                 console.error('Error reading file.');
//                 fileReader.abort();
//                 reject(new Error('Error reading file'));
//             };
//         });
//     };
//
//     try {
//         while (offset < totalSize) {
//             readChunk();
//             const chunk = await onLoadPromise();
//             yield new GrpcRestoreCatalogRequest({
//                 catalogName: 'random',
//                 backupFile: chunk
//             }); // Yield the chunk here
//         }
//     } catch (error) {
//         console.error('Error during file upload:', error);
//     }
// }

}

export const useBackupViewerService = (): BackupViewerService => {
    return mandatoryInject(backupViewerServiceInjectionKey) as BackupViewerService
}
