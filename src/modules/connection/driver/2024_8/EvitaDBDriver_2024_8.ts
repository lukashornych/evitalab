import { EvitaDBDriver } from '@/modules/connection/driver/EvitaDBDriver'
import { EvitaDBConnection } from '@/modules/connection/model/EvitaDBConnection'
import { HttpApiClient } from '@/modules/driver-support/service/HttpApiClient'
import { Catalog } from '@/modules/connection/model/Catalog'
import {
    Catalog as DriverCatalog,
    CatalogSchema as DriverCatalogSchema,
    QueryEntitiesRequestBody as DriverQueryEntitiesRequestBody,
    ModelError as DriverModelError
} from './model/model'
import { CatalogSchema } from '@/modules/connection/model/schema/CatalogSchema'
import { QueryError } from '@/modules/connection/exception/QueryError'
import { CatalogConverter } from '@/modules/connection/driver/2024_8/service/CatalogConverter'
import { CatalogSchemaConverter } from '@/modules/connection/driver/2024_8/service/CatalogSchemaConverter'

/**
 * evitaDB driver implementation for version >=2024.8.0
 */
export class EvitaDBDriver_2024_8 extends HttpApiClient implements EvitaDBDriver {

    private readonly catalogConverter: CatalogConverter = new CatalogConverter()
    private readonly catalogSchemaConverter: CatalogSchemaConverter = new CatalogSchemaConverter()

    getSupportedVersions(): string {
        return '>=2024.8.x'
    }

    async getCatalogs(connection: EvitaDBConnection): Promise<Catalog[]> {
        try {
            const driverCatalogs: DriverCatalog[] = await this.httpClient.get(
                `${connection.labApiUrl}/data/catalogs`,
                {
                    headers: {
                        'X-EvitaDB-ClientID': this.getClientIdHeaderValue()
                    }
                }
            )
                .json() as DriverCatalog[]
            return driverCatalogs.map(it => this.catalogConverter.convert(it))
        } catch (e: any) {
            throw this.handleCallError(e, connection)
        }
    }

    async getCatalogSchema(connection: EvitaDBConnection, catalogName: string): Promise<CatalogSchema> {
        try {
            const driverCatalogSchema: DriverCatalogSchema = await this.httpClient.get(
                `${connection.labApiUrl}/schema/catalogs/${catalogName}`,
                {
                    headers: {
                        'X-EvitaDB-ClientID': this.getClientIdHeaderValue()
                    }
                }
            )
                .json() as DriverCatalogSchema
            return this.catalogSchemaConverter.convert(driverCatalogSchema)
        } catch (e: any) {
            throw this.handleCallError(e, connection)
        }
    }

    async queryEntities(connection: EvitaDBConnection, catalogName: string, query: string): Promise<Response> {
        try {
            const driverQueryEntitiesRequestBody = await this.httpClient.post(
                `${connection.labApiUrl}/data/catalogs/${catalogName}/collections/query`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-EvitaDB-ClientID': this.getClientIdHeaderValue()
                    },
                    body: JSON.stringify({
                        query
                    } as DriverQueryEntitiesRequestBody)
                }
            )
                .json() as Response
            return this.entitiesConverter()
        } catch (e: any) {
            if (e.name === 'HTTPError' && e.response.status === 400) {
                // this is a special case where this might be a user's error
                throw new QueryError(connection, (await e.response.json()) as DriverModelError)
            }
            throw this.handleCallError(e, connection)
        }
    }

}
