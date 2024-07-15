import { EvitaDBDriver } from '@/modules/connection/driver/EvitaDBDriver'
import { Connection } from '@/modules/connection/model/Connection'
import { HttpApiClient } from '@/modules/driver-support/service/HttpApiClient'
import { Catalog } from '@/modules/connection/model/Catalog'
import {
    Catalog as DriverCatalog,
    CatalogSchema as DriverCatalogSchema,
    ModelError as DriverModelError,
    QueryEntitiesRequestBody as DriverQueryEntitiesRequestBody,
    Response as DriverResponse
} from './model/model'
import { CatalogSchema } from '@/modules/connection/model/schema/CatalogSchema'
import { QueryError } from '@/modules/connection/exception/QueryError'
import { CatalogConverter } from '@/modules/connection/driver/2024_8/service/CatalogConverter'
import { CatalogSchemaConverter } from '@/modules/connection/driver/2024_8/service/CatalogSchemaConverter'
import { Response } from '@/modules/connection/model/data/Response'
import { ResponseConverter } from '@/modules/connection/driver/2024_8/service/ResponseConverter'
import { EvitaLabConfig } from '@/modules/config/EvitaLabConfig'
import { List } from 'immutable'

/**
 * evitaDB driver implementation for version >=2024.8.0
 */
export class EvitaDBDriver_2024_8 extends HttpApiClient implements EvitaDBDriver {

    private readonly catalogConverter: CatalogConverter = new CatalogConverter()
    private readonly catalogSchemaConverter: CatalogSchemaConverter = new CatalogSchemaConverter()
    private readonly responseConverter: ResponseConverter = new ResponseConverter()

    constructor(evitaLabConfig: EvitaLabConfig) {
        super(evitaLabConfig)
    }

    getSupportedVersions(): List<string> {
        // todo lho we need semver with snapshots i quess
        return List(['all'])
    }

    async getCatalogs(connection: Connection): Promise<Catalog[]> {
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

    async getCatalogSchema(connection: Connection, catalogName: string): Promise<CatalogSchema> {
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

    async query(connection: Connection, catalogName: string, query: string): Promise<Response> {
        try {
            const driverResponse: DriverResponse = await this.httpClient.post(
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
                .json() as DriverResponse
            return this.responseConverter.convert(driverResponse)
        } catch (e: any) {
            if (e.name === 'HTTPError' && e.response.status === 400) {
                // this is a special case where this might be a user's error
                throw new QueryError(connection, (await e.response.json()) as DriverModelError)
            }
            throw this.handleCallError(e, connection)
        }
    }

}
