import { OffsetDateTime } from "../data-type/OffsetDateTime"

export class ServerStatus {
    readonly version: string
    readonly started: OffsetDateTime | undefined
    readonly uptime: bigint
    readonly instanceId: string
    readonly catalogsCorrupted: number
    readonly catalogsOk: number


    constructor(version: string, started: OffsetDateTime | undefined, uptime: bigint, instanceId: string, catalogsCorrupted: number, catalogsOk: number) {
        this.version = version
        this.started = started
        this.uptime = uptime
        this.instanceId = instanceId
        this.catalogsCorrupted = catalogsCorrupted
        this.catalogsOk = catalogsOk
    }
}
