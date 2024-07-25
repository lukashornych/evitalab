import { Value } from './Value'

export class EntityCollectionStatistics {
    readonly entityType: Value<string>

    readonly totalRecords: Value<number>

    readonly indexCount: Value<number>

    readonly sizeOnDiskInBytes: Value<bigint>

    constructor(
        entityType: Value<string>,
        totalRecords: Value<number>,
        indexCount: Value<number>,
        sizeOnDiskInBytes: Value<bigint>
    ) {
        this.entityType = entityType
        this.totalRecords = totalRecords
        this.indexCount = indexCount
        this.sizeOnDiskInBytes = sizeOnDiskInBytes
    }
}
