import { GrpcEvitaServerStatusResponse } from "../gen/GrpcEvitaManagementAPI_pb";
import { OffsetDateTime } from "@/modules/connection/model/data-type/OffsetDateTime";
import { GrpcOffsetDateTime } from "../gen/GrpcEvitaDataTypes_pb";
import { ServerStatus } from '@/modules/connection/model/status/ServerStatus'

export class ServerStatusConverter {
    convert(serverStatus: GrpcEvitaServerStatusResponse):ServerStatus{
        return new ServerStatus(serverStatus.version, this.convertOffsetDateTime(serverStatus.startedAt), serverStatus.uptime, serverStatus.instanceId, serverStatus.catalogsCorrupted, serverStatus.catalogsOk)
    }

    private convertOffsetDateTime(
        offsetDateTime: GrpcOffsetDateTime | undefined
    ): OffsetDateTime | undefined {
        if(!offsetDateTime)
            return undefined
        if (!offsetDateTime.timestamp) {
            throw new Error('Missing prop timestamp')
        }
        return new OffsetDateTime(
            offsetDateTime.timestamp,
            offsetDateTime.offset
        )
    }
}
