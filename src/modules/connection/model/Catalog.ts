import { CatalogState } from '@/modules/connection/model/CatalogState'
import { Map as ImmutableMap, List as ImmutableList } from 'immutable'
import { NamingConvention } from './NamingConvetion'
import { Long } from '@/modules/connection/model/data-type/Long'
import { Value } from '@/modules/connection/model/Value'

/**
 * evitaLab's representation of a single evitaDB catalog instance independent of specific evitaDB version
 */
export class Catalog {

    /**
     * Returns unique catalog id that doesn't change with catalog schema changes - such as renaming.
     * The id is assigned to the catalog when it is created and never changes.
     */
    readonly catalogId: Value<string>
    /**
     * Catalog header version that is incremented with each update. Version is not stored on the disk, it serves only to distinguish whether there is any change made in the header and whether it needs to be persisted on disk.
     */
    readonly version: Value<Long>
    /**
     * Name of the catalog. Name must be unique across all catalogs inside same evitaDB instance.
     */
    readonly name: Value<string>
    /**
     * Name variant for different cases
     */
    readonly nameVariants: Value<ImmutableMap<NamingConvention, string>>
    /**
     * Set of all maintained entity collections - i.e. entity types.
     */
    readonly entityTypes: Value<ImmutableList<string>>
    /**
     * Whether this catalog is corrupted or can be freely used.
     */
    readonly corrupted: Value<boolean>
    /**
     * Returns true if catalog supports transaction.
     */
    readonly supportsTransaction: Value<boolean>
    /**
     * Current catalog state
     */
    readonly catalogState: Value<CatalogState>

    constructor(catalogId: Value<string>,
                version: Value<Long>,
                name: Value<string>,
                nameVariants: Value<Map<NamingConvention, string>>,
                entityTypes: Value<string[]>,
                corrupted: Value<boolean>,
                supportsTransaction: Value<boolean>,
                catalogState: Value<CatalogState>) {
        this.catalogId = catalogId
        this.version = version
        this.name = name
        this.nameVariants = nameVariants.map(it => ImmutableMap(it))
        this.entityTypes = entityTypes.map(it => ImmutableList(it))
        this.corrupted = corrupted
        this.supportsTransaction = supportsTransaction
        this.catalogState = catalogState

        this.catalogId.get()
    }
}
