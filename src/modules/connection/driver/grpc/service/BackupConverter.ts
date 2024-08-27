import { Uuid } from "@/modules/connection/model/data-type/Uuid"
import { GrpcFilesToFetchResponse } from "../gen/GrpcEvitaManagementAPI_pb"
import Immutable from "immutable"
import { FilesToFetch } from "@/modules/connection/model/data/FilesToFetch"
import { File } from "@/modules/connection/model/data/File"
import { OffsetDateTime } from "@/modules/connection/model/data-type/OffsetDateTime"
import { GrpcBackupCatalogResponse } from "../gen/GrpcEvitaSessionAPI_pb"
import { TaskStatus } from "@/modules/connection/model/data/TaskStatus"

export class BackupConverter {
    convertFilesTofetch(result: GrpcFilesToFetchResponse) {
        const files: File[] = []
        for (const file of result.filesToFetch) {
            files.push(
                new File(
                    Uuid.createUUID(file.fileId!.mostSignificantBits, file.fileId!.leastSignificantBits),
                    file.name!,
                    file.description!,
                    file.contentType!,
                    file.totalSizeInBytes,
                    file.created ?
                    new OffsetDateTime(
                        file.created?.timestamp,
                        file.created?.offset
                    ) : undefined,
                    file.origin!
                )
            )
        }
        return new FilesToFetch(
            result.pageNumber,
            result.pageNumber,
            Immutable.List(files),
            result.totalNumberOfRecords
        )
    }

    convertBackupCatalog(result: GrpcBackupCatalogResponse){
        const status = result.taskStatus?.result
        let value: File | string
        if (status?.case === 'text') {
            value = status.value.value
        } else {
            value = new File(
                Uuid.createUUID(
                    status?.value?.fileId!.mostSignificantBits!,
                    status?.value?.fileId?.leastSignificantBits!
                ),
                status?.value?.name!,
                status?.value?.description!,
                status?.value?.contentType!,
                status?.value?.totalSizeInBytes!,
                new OffsetDateTime(
                    status?.value?.created?.timestamp,
                    status?.value?.created?.offset
                ),
                status?.value?.origin!
            )
        }
        const taskStatus = result.taskStatus
        return new TaskStatus(
            taskStatus?.taskType!,
            taskStatus?.taskName!,
            Uuid.createUUID(
                taskStatus?.taskId?.mostSignificantBits!,
                taskStatus?.taskId?.leastSignificantBits!
            ),
            taskStatus?.catalogName!,
            new OffsetDateTime(
                taskStatus?.issued?.timestamp,
                taskStatus?.issued?.offset
            ),
            new OffsetDateTime(
                taskStatus?.started?.timestamp,
                taskStatus?.started?.offset
            ),
            new OffsetDateTime(
                taskStatus?.finished?.timestamp,
                taskStatus?.finished?.offset
            ),
            taskStatus?.progress!,
            taskStatus?.settings!,
            value,
            taskStatus?.exception!
        )
    }
}