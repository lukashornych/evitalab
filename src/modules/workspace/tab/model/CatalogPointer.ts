import { EvitaDBConnection } from '@/model/EvitaDBConnection'

/**
 * Points to concrete evitaDB catalog in specific connection.
 */
// todo lho dont know where to move this
export abstract class CatalogPointer {
    readonly connection: EvitaDBConnection
    readonly catalogName: string

    protected constructor(connection: EvitaDBConnection, catalogName: string) {
        this.connection = connection
        this.catalogName = catalogName
    }
}
