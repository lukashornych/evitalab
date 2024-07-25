import { CatalogState } from '@/modules/connection/model/CatalogState'
import { Value } from '@/modules/connection/model/Value'
import { EntityCollectionStatistics } from './EntityCollectionStatistics'

/**
 * evitaLab's representation of a single evitaDB catalog instance independent of specific evitaDB version
 */
export class Catalog {
    /**
     * Returns unique catalog id that doesn't change with catalog schema changes - such as renaming.
     * The id is assigned to the catalog when it is created and never changes.
     */
    readonly catalogId: Value<string | undefined>
    /**
     * Catalog header version that is incremented with each update. Version is not stored on the disk, it serves only to distinguish whether there is any change made in the header and whether it needs to be persisted on disk.
     */
    readonly version: Value<BigInt>
    /**
     * Name of the catalog. Name must be unique across all catalogs inside same evitaDB instance.
     * This is a mandatory value, it cannot be omitted.
     */
    readonly name: string
    /**
     * Set of all maintained entity collections - i.e. entity types.
     */
    readonly entityTypes: Value<EntityCollectionStatistics[]>
    /**
     * Whether this catalog is corrupted or can be freely used.
     */
    readonly corrupted: Value<boolean>
    /**
     * Current catalog state
     */
    readonly catalogState: Value<CatalogState>

    /**
     * Total record count
     */
    readonly totalRecords: Value<bigint>

    readonly indexCount: Value<bigint>

    readonly sizeOnDisk: Value<bigint>

    constructor(
        catalogId: Value<string | undefined>,
        version: Value<BigInt>,
        name: string,
        entityTypes: Value<EntityCollectionStatistics[]>,
        corrupted: Value<boolean>,
        catalogState: Value<CatalogState>,
        totalRecords: Value<bigint>,
        indexCount: Value<bigint>,
        sizeOnDisk: Value<bigint>
    ) {
        this.catalogId = catalogId
        this.version = version
        this.name = name
        this.entityTypes = entityTypes
        this.corrupted = corrupted
        this.catalogState = catalogState
        this.totalRecords = totalRecords
        this.indexCount = indexCount
        this.sizeOnDisk = sizeOnDisk
    }
}
