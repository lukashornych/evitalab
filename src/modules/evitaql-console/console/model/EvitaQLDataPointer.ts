import { CatalogPointer } from '@/model/editor/tab/CatalogPointer'
import { EvitaDBConnection } from '@/model/EvitaDBConnection'

/**
 * Points to concrete evitaDB EvitaQL instance
 */
export class EvitaQLDataPointer extends CatalogPointer {
    constructor(connection: EvitaDBConnection, catalogName: string) {
        super(connection, catalogName)
    }
}
