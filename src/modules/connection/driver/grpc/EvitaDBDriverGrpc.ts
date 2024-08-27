import { List } from 'immutable'
import { EvitaDBDriver } from '../EvitaDBDriver'
import { Catalog } from '../../model/Catalog'
import { Connection } from '../../model/Connection'
import { Response } from '../../model/data/Response'
import { CatalogSchema } from '../../model/schema/CatalogSchema'
import { Empty } from '@bufbuild/protobuf'
import { CatalogSchemaConverter } from '../grpc/service/CatalogSchemaConverter'
import { CatalogConverter } from '../grpc/service/CatalogConverter'
import { ResponseConverter } from './service/ResponseConverter'
import { Value } from '../../model/Value'
import { EntitySchema } from '../../model/schema/EntitySchema'
import {
    GrpcCatalogSchemaResponse,
    GrpcCatalogVersionAtResponse,
} from '@/modules/connection/driver/grpc/gen/GrpcEvitaSessionAPI_pb'
import { EvitaDBInstanceServerError } from '@/modules/driver-support/exception/EvitaDBInstanceServerError'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { TimeoutError } from '../../exception/TimeoutError'
import { EvitaDBInstanceNetworkError } from '@/modules/driver-support/exception/EvitaDBInstanceNetworkError'
import { LabError } from '@/modules/base/exception/LabError'
import {
    ClientsHelper,
    EvitaClient,
    SessionClient,
} from './helpers/ClientsHelper'
import { TransportHelper } from './helpers/TransportHelper'
import { EntityConverter } from './service/EntityConverter'
import { EvitaValueConvert } from './service/EvitaValueConverter'
import { ExtraResultConverter } from './service/ExtraResultConverter'
import { ServerStatus } from '../../model/data/ServerStatus'
import { ServerStatusConverter } from './service/ServerStatusConverter'
import ky from 'ky'
import { ApiReadiness } from '../../model/data/ApiReadiness'
import { ApiServerStatus } from '../../model/data/ApiServerStatus'
import { OffsetDateTime } from '../../model/data-type/OffsetDateTime'
import { CatalogVersionAtResponse } from '../../model/data/CatalogVersionAtResponse'
import { TaskStatus } from '../../model/data/TaskStatus'
import { FilesToFetch } from '../../model/data/FilesToFetch'
import { BackupConverter } from './service/BackupConverter'
import { JobsConverter } from './service/JobsConverter'
import { TaskStatuses } from '../../model/data/TaskStatuses'

//TODO: Add docs and add header 'X-EvitaDB-ClientID': this.getClientIdHeaderValue()
export class EvitaDBDriverGrpc implements EvitaDBDriver {
    private readonly evitaValueConverter: EvitaValueConvert =
        new EvitaValueConvert()
    private readonly entityConverter: EntityConverter = new EntityConverter(
        this.evitaValueConverter
    )
    private readonly extraResultConverter: ExtraResultConverter =
        new ExtraResultConverter(this.entityConverter)
    private readonly catalogSchemaConverter: CatalogSchemaConverter =
        new CatalogSchemaConverter(this.evitaValueConverter)
    private readonly catalogConverter: CatalogConverter = new CatalogConverter()
    private readonly responseConverter: ResponseConverter =
        new ResponseConverter(this.entityConverter, this.extraResultConverter)
    private readonly serverStatusConverter: ServerStatusConverter =
        new ServerStatusConverter()
    private readonly backupConverter: BackupConverter = new BackupConverter()
    private readonly jobsConverter: JobsConverter = new JobsConverter()

    private readonly clientsHelper: ClientsHelper = new ClientsHelper()

    async getCatalogSchema(
        connection: Connection,
        catalogName: string
    ): Promise<CatalogSchema> {
        try {
            const res = await this.clientsHelper
                .getEvitaClient(
                    connection,
                    TransportHelper.getTransport(connection)
                )
                .createReadOnlySession({
                    catalogName,
                })
            const schemaRes: GrpcCatalogSchemaResponse =
                await this.clientsHelper
                    .getSessionClient(
                        connection,
                        TransportHelper.getTransport(connection)
                    )
                    .getCatalogSchema(
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
            const result: CatalogSchema = this.catalogSchemaConverter.convert(
                schemaRes.catalogSchema,
                async (
                    catalogName: string
                ): Promise<Value<List<EntitySchema>>> => {
                    return await this.loadEntitySchemas(
                        catalogName,
                        this.catalogSchemaConverter,
                        this.clientsHelper.getEvitaClient(
                            connection,
                            TransportHelper.getTransport(connection)
                        ),
                        this.clientsHelper.getSessionClient(
                            connection,
                            TransportHelper.getTransport(connection)
                        )
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
        grpcCatalogSchemaConverter: CatalogSchemaConverter,
        client: EvitaClient,
        sessionClient: SessionClient
    ): Promise<Value<List<EntitySchema>>> {
        const entities: EntitySchema[] = []
        const res = await client.createReadOnlySession({
            catalogName,
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
            const session = await this.clientsHelper
                .getEvitaClient(
                    connection,
                    TransportHelper.getTransport(connection)
                )
                .createReadOnlySession({
                    catalogName,
                })
            const queryRespose = await this.clientsHelper
                .getSessionClient(
                    connection,
                    TransportHelper.getTransport(connection)
                )
                .queryUnsafe(
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
            const res = (
                await this.clientsHelper
                    .getManagmentClient(
                        connection,
                        TransportHelper.getTransport(connection)
                    )
                    .getCatalogStatistics(Empty)
            ).catalogStatistics
            return res.map((x) => this.catalogConverter.convert(x))
        } catch (e: any) {
            throw this.handleCallError(e, connection)
        }
    }

    getSupportedVersions(): List<string> {
        return List(['all'])
    }

    async getServerDetails(connection: Connection): Promise<ServerStatus> {
        const grpcServerStatus = await this.clientsHelper
            .getManagmentClient(
                connection,
                TransportHelper.getTransport(connection)
            )
            .serverStatus(Empty)
        await this.clientsHelper.getManagmentClient(
            connection,
            TransportHelper.getTransport(connection)
        )
        return this.serverStatusConverter.convert(grpcServerStatus)
    }

    async getApiReadiness(connection: Connection): Promise<ApiReadiness> {
        const apiResponse = await ky.get(connection.systemUrl + '/readiness')
        const apiStatus = (await apiResponse.json()) as any
        return new ApiReadiness(apiStatus.status, {
            graphQL: apiStatus.apis.graphQL,
            gRPC: apiStatus.apis.gRPC,
            lab: apiStatus.apis.lab,
            observability: apiStatus.apis.observability,
            rest: apiStatus.apis.rest,
            system: apiStatus.apis.system,
        })
    }

    async getRuntimeConfig(connection: Connection): Promise<string> {
        return (
            await this.clientsHelper
                .getManagmentClient(
                    connection,
                    TransportHelper.getTransport(connection)
                )
                .getConfiguration(Empty)
        ).configuration
    }

    async getServerStatus(connection: Connection): Promise<ApiServerStatus> {
        const apiResponse = await ky.get(connection.systemUrl + '/status')
        const apiStatus = (await apiResponse.json()) as any
        return new ApiServerStatus(
            apiStatus.serverName,
            apiStatus.version,
            apiStatus.startedAt,
            apiStatus.uptime,
            apiStatus.uptimeForHuman,
            apiStatus.catalogsCorrupted,
            apiStatus.catalogsOk,
            apiStatus.healthProblems,
            apiStatus.apis
        )
    }

    async createCatalog(
        connection: Connection,
        catalogName: string
    ): Promise<boolean> {
        const response = await this.clientsHelper
            .getEvitaClient(
                connection,
                TransportHelper.getTransport(connection)
            )
            .defineCatalog({
                catalogName,
            })
        return response.success
    }

    async dropCatalog(
        connection: Connection,
        catalogName: string
    ): Promise<boolean> {
        const response = await this.clientsHelper
            .getEvitaClient(
                connection,
                TransportHelper.getTransport(connection)
            )
            .deleteCatalogIfExists({
                catalogName,
            })
        return response.success
    }

    async renameCatalog(
        connection: Connection,
        catalogName: string,
        newCatalogName: string
    ): Promise<boolean> {
        const response = await this.clientsHelper
            .getEvitaClient(
                connection,
                TransportHelper.getTransport(connection)
            )
            .renameCatalog({
                catalogName,
                newCatalogName,
            })
        return response.success
    }

    async replaceCatalog(
        connection: Connection,
        catalogNameToBeReplaced: string,
        catalogNameToBeReplacedWith: string
    ): Promise<boolean> {
        const response = await this.clientsHelper
            .getEvitaClient(
                connection,
                TransportHelper.getTransport(connection)
            )
            .replaceCatalog({
                catalogNameToBeReplaced,
                catalogNameToBeReplacedWith,
            })
        return response.success
    }

    async createCollection(
        connection: Connection,
        entityType: string,
        catalogName: string
    ): Promise<Catalog[] | undefined> {
        const res = await this.clientsHelper
            .getEvitaClient(
                connection,
                TransportHelper.getTransport(connection)
            )
            .createReadWriteSession({ catalogName })
        const response = await this.clientsHelper
            .getSessionClient(
                connection,
                TransportHelper.getTransport(connection)
            )
            .defineEntitySchema(
                {
                    entityType,
                },
                {
                    headers: {
                        sessionId: res.sessionId,
                    },
                }
            )
        const resultClose = await this.clientsHelper
            .getSessionClient(
                connection,
                TransportHelper.getTransport(connection)
            )
            .close(
                {},
                {
                    headers: {
                        sessionId: res.sessionId,
                    },
                }
            )
        if (response.entitySchema && resultClose.catalogVersion) {
            return await this.downloadCtalogsSameSession(
                connection,
                res.sessionId
            )
        } else return undefined
    }

    async renameCollection(
        connection: Connection,
        entityType: string,
        newName: string,
        catalogName: string
    ): Promise<Catalog[] | undefined> {
        const res = await this.clientsHelper
            .getEvitaClient(
                connection,
                TransportHelper.getTransport(connection)
            )
            .createReadWriteSession({ catalogName })
        const response = await this.clientsHelper
            .getSessionClient(
                connection,
                TransportHelper.getTransport(connection)
            )
            .renameCollection(
                {
                    entityType,
                    newName,
                },
                {
                    headers: {
                        sessionId: res.sessionId,
                    },
                }
            )
        await this.clientsHelper
            .getSessionClient(
                connection,
                TransportHelper.getTransport(connection)
            )
            .close(
                {},
                {
                    headers: {
                        sessionId: res.sessionId,
                    },
                }
            )
        if (response)
            return await this.downloadCtalogsSameSession(
                connection,
                res.sessionId
            )
        else return undefined
    }

    async dropCollection(
        connection: Connection,
        entityType: string,
        catalogName: string
    ): Promise<Catalog[] | undefined> {
        const res = await this.clientsHelper
            .getEvitaClient(
                connection,
                TransportHelper.getTransport(connection)
            )
            .createReadWriteSession({ catalogName })
        const response = await this.clientsHelper
            .getSessionClient(
                connection,
                TransportHelper.getTransport(connection)
            )
            .deleteCollection(
                {
                    entityType,
                },
                {
                    headers: {
                        sessionId: res.sessionId,
                    },
                }
            )
        await this.clientsHelper
            .getSessionClient(
                connection,
                TransportHelper.getTransport(connection)
            )
            .close(
                {},
                {
                    headers: {
                        sessionId: res.sessionId,
                    },
                }
            )
        if (response)
            return await this.downloadCtalogsSameSession(
                connection,
                res.sessionId
            )
        else return undefined
    }

    async downloadCtalogsSameSession(
        connection: Connection,
        sessionId: string
    ): Promise<Catalog[]> {
        const resultData = (
            await this.clientsHelper
                .getManagmentClient(
                    connection,
                    TransportHelper.getTransport(connection)
                )
                .getCatalogStatistics(Empty, {
                    headers: {
                        sessionId,
                    },
                })
        ).catalogStatistics
        return resultData.map((x) => this.catalogConverter.convert(x))
    }

    async createBackup(
        connection: Connection,
        catalogName: string,
        includingWAL: boolean,
        pastMoment: OffsetDateTime
    ): Promise<TaskStatus> {
        const res = await this.clientsHelper
            .getEvitaClient(
                connection,
                TransportHelper.getTransport(connection)
            )
            .createReadWriteSession({ catalogName })
        const result = await this.clientsHelper
            .getSessionClient(
                connection,
                TransportHelper.getTransport(connection)
            )
            .backupCatalog(
                {
                    includingWAL,
                    pastMoment: {
                        offset: pastMoment.offset,
                        timestamp: pastMoment.timestamp,
                    },
                },
                {
                    headers: {
                        sessionId: res.sessionId,
                    },
                }
            )
        return this.backupConverter.convertBackupCatalog(result)
    }

    async getMinimalBackupDate(
        connection: Connection,
        catalogName: string
    ): Promise<CatalogVersionAtResponse> {
        const res = await this.clientsHelper
            .getEvitaClient(
                connection,
                TransportHelper.getTransport(connection)
            )
            .createReadOnlySession({ catalogName })
        const result: GrpcCatalogVersionAtResponse = await this.clientsHelper
            .getSessionClient(
                connection,
                TransportHelper.getTransport(connection)
            )
            .getCatalogVersionAt(
                {},
                {
                    headers: {
                        sessionId: res.sessionId,
                    },
                }
            )
        return new CatalogVersionAtResponse(
            result.version,
            new OffsetDateTime(
                result.introducedAt?.timestamp,
                result.introducedAt?.offset
            )
        )
    }

    async getBackups(
        connection: Connection,
        pageNumber: number,
        pageSize: number = 50
    ): Promise<FilesToFetch> {
        this.clientsHelper.getSessionClient(
            connection,
            TransportHelper.getTransport(connection)
        )
        const result = await this.clientsHelper
            .getManagmentClient(
                connection,
                TransportHelper.getTransport(connection)
            )
            .listFilesToFetch({
                origin: 'BackupTask',
                pageNumber,
                pageSize,
            })
        return this.backupConverter.convertFilesTofetch(result)
    }

    async getAciveJobs(connection: Connection, pageNumber:number, pageSize:number):Promise<TaskStatuses>{
        const result = await this.clientsHelper.getManagmentClient(connection, TransportHelper.getTransport(connection)).listTaskStatuses({
            pageNumber,
            pageSize
        })
        return this.jobsConverter.convertJobs(result)
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
