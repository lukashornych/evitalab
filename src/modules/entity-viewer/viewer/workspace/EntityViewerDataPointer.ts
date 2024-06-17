import { CatalogPointer } from '@/model/editor/tab/CatalogPointer'
import { EvitaDBConnection } from '@/model/lab'

/**
 * Points to concrete evitaDB collection to fetch data from.
 */
export class EntityViewerDataPointer extends CatalogPointer {
    readonly entityType: string

    constructor(connection: EvitaDBConnection, catalogName: string, entityType: string) {
        super(connection, catalogName)
        this.entityType = entityType
    }
}
