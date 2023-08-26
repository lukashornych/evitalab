import ky from 'ky'
import { Catalog, CatalogSchema, QueryEntitiesRequestBody, Response } from '@/model/evitadb'
import { EvitaDBConnection } from '@/model/lab'

/**
 * API client for evitaDB lab API. Should not be used directly in components, instead it should be used as a low level
 * abstraction of raw HTTP API.
 */
export class EvitaDBClient {

    /**
     * Fetches schema from evitaDB server for specific catalog.
     */
    async getCatalogSchema(connection: EvitaDBConnection, urlCatalogName: string): Promise<CatalogSchema> {
        return await ky.get(`${connection.labApiUrl}/schema/catalogs/${urlCatalogName}`)
            .json() as CatalogSchema
    }

    /**
     * Fetches a list of all catalogs from evitaDB server.
     */
    async getCatalogs(connection: EvitaDBConnection): Promise<Catalog[]> {
        return await ky.get(`${connection.labApiUrl}/data/catalogs`)
            .json() as Catalog[]
    }

    /**
     * Fetches entities with extra results from evitaDB server from specific catalog.
     */
    async queryEntities(connection: EvitaDBConnection, urlCatalogName: string, query: string): Promise<Response> {
        return await ky.post(
            `${connection.labApiUrl}/data/catalogs/${urlCatalogName}/collections/query`,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query
                } as QueryEntitiesRequestBody)
            }
        )
            .json() as Response
    }
}
