import { CatalogPointer } from '@/model/editor/tab/CatalogPointer'

import { EvitaDBConnection } from '@/model/EvitaDBConnection'

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
