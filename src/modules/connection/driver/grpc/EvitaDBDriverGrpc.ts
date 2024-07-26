import { List } from 'immutable'
import { EvitaDBDriver } from '../EvitaDBDriver'
import { Catalog } from '../../model/Catalog'
import { Connection } from '../../model/Connection'
import { Response } from '../../model/data/Response'
import { CatalogSchema } from '../../model/schema/CatalogSchema'
import { Empty } from '@bufbuild/protobuf'
import { CatalogSchemaConverter as GrpcCatalogSchemaConverter } from '../grpc/service/CatalogSchemaConverter'
import { CatalogConverter as GrpcCatalogConverter } from '../grpc/service/CatalogConverter'
import { ResponseConverter } from './service/ResponseConverter'
import { Value } from '../../model/Value'
import { EntitySchema } from '../../model/schema/EntitySchema'
import { GrpcCatalogSchemaResponse } from '@/modules/connection/driver/grpc/gen/GrpcEvitaSessionAPI_pb'
import { EvitaDBInstanceServerError } from '@/modules/driver-support/exception/EvitaDBInstanceServerError'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { TimeoutError } from '../../exception/TimeoutError'
import { EvitaDBInstanceNetworkError } from '@/modules/driver-support/exception/EvitaDBInstanceNetworkError'
import { LabError } from '@/modules/base/exception/LabError'
import { ClientsHelper, EvitaClient, SessionClient } from './helpers/ClientsHelper'
import { TransportHelper } from './helpers/TransportHelper'

//TODO: Add docs and add header 'X-EvitaDB-ClientID': this.getClientIdHeaderValue()
export class EvitaDBDriverGrpc implements EvitaDBDriver {
    private readonly grpcCatalogSchemaConverter: GrpcCatalogSchemaConverter =
        new GrpcCatalogSchemaConverter()
    private readonly grpcCatalogConverter: GrpcCatalogConverter =
        new GrpcCatalogConverter()
    private readonly responseConverter: ResponseConverter =
        new ResponseConverter()

    async getCatalogSchema(
        connection: Connection,
        catalogName: string
    ): Promise<CatalogSchema> {
        try {
            const res = await ClientsHelper.getEvitaClient(connection, TransportHelper.getTransport(connection)).createReadOnlySession({
                catalogName: catalogName,
            })
            const schemaRes: GrpcCatalogSchemaResponse =
                await ClientsHelper.getSessionClient(connection, TransportHelper.getTransport(connection)).getCatalogSchema(
                    { nameVariants: true },
                    {
                        headers: {
                            sessionId: res.sessionId,
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
                            ClientsHelper.getEvitaClient(connection, TransportHelper.getTransport(connection)),
                            ClientsHelper.getSessionClient(connection, TransportHelper.getTransport(connection))
                        )
                    }
                )
            return result
        } catch (e: any) {
            throw this.handleCallError(e, connection)
        }
    }
    private async loadEntitySchemas(
        catalogName: string,
        grpcCatalogSchemaConverter: GrpcCatalogSchemaConverter,
        client: EvitaClient,
        sessionClient: SessionClient
    ): Promise<Value<List<EntitySchema>>> {
        const entities: EntitySchema[] = []
        const res = await client.createReadOnlySession({
            catalogName: catalogName,
        })

        const entityTypesResult = await sessionClient.getAllEntityTypes(Empty, {
            headers: {
                sessionId: res.sessionId,
            },
        })

        const entityTypes = entityTypesResult.entityTypes
        for (const type of entityTypes) {
            const entitySchemaResult = await sessionClient.getEntitySchema(
                { nameVariants: true, entityType: type },
                {
                    headers: {
                        sessionId: res.sessionId,
                    },
                }
            )
            const schema = entitySchemaResult.entitySchema
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
            const session = await ClientsHelper.getEvitaClient(connection, TransportHelper.getTransport(connection)).createReadOnlySession({
                catalogName,
            })
            const queryRespose = await ClientsHelper.getSessionClient(connection, TransportHelper.getTransport(connection)).query(
                {
                    query,
                },
                {
                    headers: {
                        sessionId: session.sessionId,
                    },
                }
            )
            return this.responseConverter.convert(queryRespose)
        } catch (e: any) {
            throw this.handleCallError(e, connection)
        }
    }
    async getCatalogs(connection: Connection): Promise<Catalog[]> {
        try {
            const res = (await ClientsHelper.getManagmentClient(connection, TransportHelper.getTransport(connection)).getCatalogStatistics(Empty))
                .catalogStatistics
            return res.map((x) => this.grpcCatalogConverter.convert(x))
        } catch (e: any) {
            throw this.handleCallError(e, connection)
        }
    }

    getSupportedVersions(): List<string> {
        return List(['all'])
    }

    private handleCallError(e: any, connection?: Connection): LabError {
        if (e.name === 'HTTPError') {
            const statusCode: number = e.response.status
            if (statusCode >= 500) {
                return new EvitaDBInstanceServerError(connection)
            } else {
                return new UnexpectedError(e.message)
            }
        } else if (e.name === 'TimeoutError') {
            return new TimeoutError(connection)
        } else if (e.name === 'TypeError' && e.message === 'Failed to fetch') {
            return new EvitaDBInstanceNetworkError(connection)
        } else {
            return new UnexpectedError(e.message)
        }
    }
}
