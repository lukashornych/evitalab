import { Catalog } from '@/modules/connection/model/Catalog'
import { CatalogSchema } from '@/modules/connection/model/CatalogSchema'
import { EvitaDBConnection } from '@/modules/connection/model/EvitaDBConnection'
import { Entity } from '@/modules/connection/model/Entity'

/**
 * evitaDB version-agnostic driver to access data from connected evitaDB server
 */
export interface EvitaDBDriver {

    /**
     * Which versions of evitaDB server this driver supports. Can be any string supported by https://www.npmjs.com/package/semver.
     * Comparison is done using the `.satisfies(...)` method
     */
    getSupportedVersions(): string

    /**
     * Returns all available catalogs from server for the given evitaDB connection
     *
     * @param connection connection to evitaDB server
     */
    getCatalogs(connection: EvitaDBConnection): Promise<Catalog[]>

    /**
     * Returns schema for a given catalog name from server for the given evitaDB connection
     *
     * @param connection connection to evitaDB server
     * @param catalogName name of catalog for which schema is returned
     */
    getCatalogSchema(connection: EvitaDBConnection, catalogName: string): Promise<CatalogSchema>

    /**
     * Returns entities for given query from given catalog for the given evitaDB connection
     *
     * @param connection connection to evitaDB server
     * @param catalogName name of catalog to query
     * @param query query to request entities
     */
    queryEntities(connection: EvitaDBConnection, catalogName: string, query: string): Promise<Entity>

    // todo use this driver even for GQL etc? it could make sense to differentiate version of gql apis
    // queryGraphQL(connection: EvitaDBConnection, path: string, query: string, variables: any = {}): Promise<GraphQLResponse>
}
