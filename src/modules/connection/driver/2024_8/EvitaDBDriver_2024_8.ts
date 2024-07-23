import { EvitaDBDriver } from '@/modules/connection/driver/EvitaDBDriver'
import { Connection } from '@/modules/connection/model/Connection'
import { HttpApiClient } from '@/modules/driver-support/service/HttpApiClient'
import { Catalog } from '@/modules/connection/model/Catalog'
import { CatalogSchemaConverter as GrpcCatalogSchemaConverter } from '../grpc/service/CatalogSchemaConverter'
import { CatalogConverter as GrpcCatalogConverter } from '../grpc/service/CatalogConverter'
import {
    Catalog as DriverCatalog,
    CatalogSchema as DriverCatalogSchema,
    ModelError as DriverModelError,
    QueryEntitiesRequestBody as DriverQueryEntitiesRequestBody,
    Response as DriverResponse,
} from './model/model'
import { CatalogSchema } from '@/modules/connection/model/schema/CatalogSchema'
import { QueryError } from '@/modules/connection/exception/QueryError'
import { CatalogConverter } from '@/modules/connection/driver/2024_8/service/CatalogConverter'
import { CatalogSchemaConverter } from '@/modules/connection/driver/2024_8/service/CatalogSchemaConverter'
import { Response } from '@/modules/connection/model/data/Response'
import { ResponseConverter } from '@/modules/connection/driver/2024_8/service/ResponseConverter'
import { EvitaLabConfig } from '@/modules/config/EvitaLabConfig'
import { List } from 'immutable'
import { EvitaManagementService } from '../../../../gen/GrpcEvitaManagementAPI_connect'
import { EvitaSessionService } from '../../../../gen/GrpcEvitaSessionAPI_connect'
import { createConnectTransport } from '@connectrpc/connect-web'
import {
    createContextValues,
    createPromiseClient,
    PromiseClient,
} from '@connectrpc/connect'
import { EvitaService } from '../../../../gen/GrpcEvitaAPI_connect'
import { GrpcCatalogSchema } from '@/gen/GrpcCatalogSchema_pb'
import {
    GrpcCatalogSchemaResponse,
    GrpcGetCatalogSchemaRequest,
} from '@/gen/GrpcEvitaSessionAPI_pb'
import { EntitySchema } from '../../model/schema/EntitySchema'
import { Value } from '../../model/Value'
import { Empty } from '@bufbuild/protobuf'
import { EntityConverter as GrpcEntityConverter } from '../grpc/service/EntityConverter'

/**
 * evitaDB driver implementation for version >=2024.8.0
 */
export class EvitaDBDriver_2024_8
    extends HttpApiClient
    implements EvitaDBDriver
{
    private readonly catalogConverter: CatalogConverter = new CatalogConverter()
    private readonly grpcCatalogSchemaConverter: GrpcCatalogSchemaConverter =
        new GrpcCatalogSchemaConverter()
    private readonly grpcCatalogConverter: GrpcCatalogConverter =
        new GrpcCatalogConverter()
    private readonly catalogSchemaConverter: CatalogSchemaConverter =
        new CatalogSchemaConverter()
    private readonly responseConverter: ResponseConverter =
        new ResponseConverter()
    private readonly entityConverter: GrpcEntityConverter =
        new GrpcEntityConverter()
    private readonly connectionUrl: string = 'https://LAPTOP-C4DH0B5J:5555'

    protected readonly transport = createConnectTransport({
        baseUrl: this.connectionUrl,
    })

    protected readonly client = createPromiseClient(
        EvitaService,
        this.transport
    )

    protected readonly managmentClient = createPromiseClient(
        EvitaManagementService,
        this.transport
    )

    protected readonly sessionClient = createPromiseClient(
        EvitaSessionService,
        this.transport
    )

    constructor(evitaLabConfig: EvitaLabConfig) {
        super(evitaLabConfig)
    }

    getSupportedVersions(): List<string> {
        // todo lho we need semver with snapshots i quess
        return List(['all'])
    }

    async getCatalogs(connection: Connection): Promise<Catalog[]> {
        try {
            const res = (await this.managmentClient.getCatalogStatistics(Empty))
                .catalogStatistics
            return res.map((x) => this.grpcCatalogConverter.convert(x))
        } catch (e: any) {
            throw this.handleCallError(e, connection)
        }
        //TODO: Remove
        /*
        try {
            const driverCatalogs: DriverCatalog[] = (await this.httpClient
                .get(`${connection.labApiUrl}/data/catalogs`, {
                    headers: {
                        'X-EvitaDB-ClientID': this.getClientIdHeaderValue(),
                    },
                })
                .json()) as DriverCatalog[]
            return driverCatalogs.map((it) => this.catalogConverter.convert(it))
        } catch (e: any) {
            throw this.handleCallError(e, connection)
        }*/
    }

    async getCatalogSchema(
        connection: Connection,
        catalogName: string
    ): Promise<CatalogSchema> {
        try {
            const res = await this.client.createReadOnlySession({
                catalogName: catalogName,
            })
            const schemaRes: GrpcCatalogSchemaResponse =
                await this.sessionClient.getCatalogSchema(
                    { nameVariants: true },
                    {
                        headers: {
                            sessionId: res.sessionId,
                            catalogName: catalogName,
                        },
                    }
                )
            if (schemaRes.catalogSchema == null) {
                throw this.handleCallError('catalog name is null', connection)
            }
            const result: CatalogSchema =
                this.grpcCatalogSchemaConverter.convert(
                    schemaRes.catalogSchema,
                    async (
                        catalogName: string
                    ): Promise<Value<List<EntitySchema>>> => {
                        return await this.loadEntitySchemas(
                            catalogName,
                            this.grpcCatalogSchemaConverter,
                            this.client,
                            this.sessionClient
                        )
                    }
                )
            return result
            //TODO: Remove
            /*
            const driverCatalogSchema: DriverCatalogSchema =
                (await this.httpClient
                    .get(
                        `${connection.labApiUrl}/schema/catalogs/${catalogName}`,
                        {
                            headers: {
                                'X-EvitaDB-ClientID':
                                    this.getClientIdHeaderValue(),
                            },
                        }
                    )
                    .json()) as DriverCatalogSchema
            return this.catalogSchemaConverter.convert(driverCatalogSchema)
            */
        } catch (e: any) {
            throw this.handleCallError(e, connection)
        }
    }

    async loadEntitySchemas(
        catalogName: string,
        grpcCatalogSchemaConverter: GrpcCatalogSchemaConverter,
        client: PromiseClient<typeof EvitaService>,
        sessionClient: PromiseClient<typeof EvitaSessionService>
    ): Promise<Value<List<EntitySchema>>> {
        const entities: EntitySchema[] = []
        const res = await client.createReadOnlySession({
            catalogName: catalogName,
        })
        
        for (const type of (
            await sessionClient.getAllEntityTypes(Empty, {
                headers: {
                    sessionId: res.sessionId,
                    catalogName: catalogName,
                },
            })
        ).entityTypes) {
            const schema = (
                await sessionClient.getEntitySchema(
                    { nameVariants: true, entityType: type },
                    {
                        headers: {
                            sessionId: res.sessionId,
                            catalogName: catalogName,
                        },
                    }
                )
            ).entitySchema
            if (schema != null) {
                entities.push(
                    grpcCatalogSchemaConverter.convertEntitySchema(schema)
                )
            }
        }
        return Value.of(List(entities))
    }
    async query(
        connection: Connection,
        catalogName: string,
        query: string
    ): Promise<Response> {
        try {
            const driverResponse: DriverResponse = (await this.httpClient
                .post(
                    `${connection.labApiUrl}/data/catalogs/${catalogName}/collections/query`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-EvitaDB-ClientID': this.getClientIdHeaderValue(),
                        },
                        body: JSON.stringify({
                            query,
                        } as DriverQueryEntitiesRequestBody),
                    }
                )
                .json()) as DriverResponse
            return this.responseConverter.convert(driverResponse)
        } catch (e: any) {
            if (e.name === 'HTTPError' && e.response.status === 400) {
                // this is a special case where this might be a user's error
                throw new QueryError(
                    connection,
                    (await e.response.json()) as DriverModelError
                )
            }
            throw this.handleCallError(e, connection)
        }
    }
}
