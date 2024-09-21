import Immutable, { List } from 'immutable'
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
    GrpcDefineEntitySchemaResponse,
    GrpcCatalogVersionAtResponse,
    GrpcDeleteCollectionResponse, GrpcGoLiveAndCloseResponse, GrpcRenameCollectionResponse
} from '@/modules/connection/driver/grpc/gen/GrpcEvitaSessionAPI_pb'
import { EvitaDBInstanceServerError } from '@/modules/driver-support/exception/EvitaDBInstanceServerError'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { TimeoutError } from '../../exception/TimeoutError'
import { EvitaDBInstanceNetworkError } from '@/modules/driver-support/exception/EvitaDBInstanceNetworkError'
import { LabError } from '@/modules/base/exception/LabError'
import { ClientProvider, EvitaSessionClient } from './service/ClientProvider'
import { EntityConverter } from './service/EntityConverter'
import { EvitaValueConverter } from './service/EvitaValueConverter'
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
import { TaskSimplifiedState } from '../../model/data/TaskSimplifiedState'
import { TaskSimplifiedStateConverter } from './service/TaskSimplifiedStateConverter'
import { GrpcDefineCatalogResponse } from '@/modules/connection/driver/grpc/gen/GrpcEvitaAPI_pb'
import { EvitaSessionProvider } from '@/modules/connection/driver/grpc/service/EvitaSessionProvider'
import { ConnectError } from '@connectrpc/connect'
import { ClassifierValidationErrorType } from '@/modules/connection/model/data-type/ClassifierValidationErrorType'
import { ClassifierType } from '@/modules/connection/model/data-type/ClassifierType'
import { GrpcReservedKeywordsResponse } from '@/modules/connection/driver/grpc/gen/GrpcEvitaManagementAPI_pb'
import { ReservedKeywordsConverter } from '@/modules/connection/driver/grpc/service/ReservedKeywordsConverter'
import { splitStringWithCaseIntoWords } from '@/utils/string'
import { Keyword } from '@/modules/connection/driver/grpc/model/Keyword'
import { Uuid } from '../../model/data-type/Uuid'
import {
    GrpcRestoreCatalogRequest,
    GrpcRestoreCatalogResponse
} from '@/modules/connection/driver/grpc/gen/GrpcEvitaManagementAPI_pb'
import { EventType } from '@/modules/connection/model/data/EventType'

//TODO: Add docs and add header 'X-EvitaDB-ClientID': this.getClientIdHeaderValue()
export class EvitaDBDriverGrpc implements EvitaDBDriver {

    private readonly classifierFormatPattern: RegExp = /^[A-Za-z][A-Za-z0-9_.\-~]{0,254}$/

    private _clientProvider?: ClientProvider
    private _evitaSessionProvider?: EvitaSessionProvider

    private _evitaValueConverter?: EvitaValueConverter
    private _entityConverter?: EntityConverter
    private _extraResultConverter?: ExtraResultConverter
    private _catalogSchemaConverter?: CatalogSchemaConverter
    private _catalogConverter?: CatalogConverter

    private _responseConverter?: ResponseConverter
    private _serverStatusConverter?: ServerStatusConverter
    private _reservedKeywordsConverter?: ReservedKeywordsConverter
    private _taskSimplifiedStateConverter?: TaskSimplifiedStateConverter
    private _backupConverter?: BackupConverter
    private _jobsConverter?: JobsConverter

    private reservedKeywords?: Immutable.Map<ClassifierType, Immutable.List<Keyword>>

    async getCatalogSchema(
        connection: Connection,
        catalogName: string
    ): Promise<CatalogSchema> {
        try {
            const schemaRes: GrpcCatalogSchemaResponse =
                await this.evitaSessionProvider.executeInReadOnlySession(
                    connection,
                    await this.getCatalog(connection, catalogName),
                    async (sessionId) => {
                        return await this.clientProvider
                            .getEvitaSessionClient(connection)
                            .getCatalogSchema(
                                { nameVariants: true },
                                {
                                    headers: {
                                        sessionId
                                    }
                                }
                            )
                    }
                )
            if (schemaRes.catalogSchema == null) {
                throw new UnexpectedError(
                    'Catalog schema is missing in gRPC response.'
                )
            }

            return this.catalogSchemaConverter.convert(
                schemaRes.catalogSchema,
                async (
                    catalogName: string
                ): Promise<Value<List<EntitySchema>>> => {
                    return await this.loadEntitySchemas(connection, catalogName)
                }
            )
        } catch (e: any) {
            throw this.handleCallError(e, connection)
        }
    }

    private async loadEntitySchemas(
        connection: Connection,
        catalogName: string
    ): Promise<Value<List<EntitySchema>>> {
        try {
            const entitySchemas: EntitySchema[] =
                await this.evitaSessionProvider.executeInReadOnlySession(
                    connection,
                    await this.getCatalog(connection, catalogName),
                    async (sessionId) => {
                        const evitaSessionClient: EvitaSessionClient =
                            this.clientProvider.getEvitaSessionClient(
                                connection
                            )

                        const entityTypesResponse =
                            await evitaSessionClient.getAllEntityTypes(Empty, {
                                headers: {
                                    sessionId
                                }
                            })

                        const entitySchemas: EntitySchema[] = []
                        const entityTypes = entityTypesResponse.entityTypes
                        for (const type of entityTypes) {
                            const entitySchemaResult =
                                await evitaSessionClient.getEntitySchema(
                                    {
                                        nameVariants: true,
                                        entityType: type
                                    },
                                    {
                                        headers: {
                                            sessionId
                                        }
                                    }
                                )
                            const schema = entitySchemaResult.entitySchema
                            if (schema != null) {
                                entitySchemas.push(
                                    this.catalogSchemaConverter.convertEntitySchema(
                                        schema
                                    )
                                )
                            }
                        }

                        return entitySchemas
                    }
                )

            return Value.of(List(entitySchemas))
        } catch (e) {
            throw this.handleCallError(e, connection)
        }
    }

    async query(
        connection: Connection,
        catalogName: string,
        query: string
    ): Promise<Response> {
        try {
            const queryResponse =
                await this.evitaSessionProvider.executeInReadOnlySession(
                    connection,
                    await this.getCatalog(connection, catalogName),
                    async (sessionId) => {
                        return await this.clientProvider
                            .getEvitaSessionClient(connection)
                            .queryUnsafe(
                                {
                                    query
                                },
                                {
                                    headers: {
                                        sessionId
                                    }
                                }
                            )
                    }
                )
            return this.responseConverter.convert(queryResponse)
        } catch (e: any) {
            throw this.handleCallError(e, connection)
        }
    }

    async getCatalogs(connection: Connection): Promise<Catalog[]> {
        try {
            const res = (
                await this.clientProvider
                    .getEvitaManagementClient(connection)
                    .getCatalogStatistics(Empty)
            ).catalogStatistics
            return res.map((x) => this.catalogConverter.convert(x))
        } catch (e: any) {
            throw this.handleCallError(e, connection)
        }
    }

    async getCatalog(
        connection: Connection,
        catalogName: string
    ): Promise<Catalog> {
        const catalogs: Catalog[] = await this.getCatalogs(connection)
        const catalog: Catalog | undefined = catalogs.find(
            (it) => it.name === catalogName
        )
        if (catalog == undefined) {
            throw new UnexpectedError(`No catalog '${catalogName}' found.`)
        }
        return catalog
    }

    getSupportedVersions(): List<string> {
        return List(['all'])
    }

    async getServerDetails(connection: Connection): Promise<ServerStatus> {
        // todo lho reimplement
        const grpcServerStatus = await this.clientProvider
            .getEvitaManagementClient(connection)
            .serverStatus(Empty)
        await this.clientProvider.getEvitaManagementClient(connection)
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
            system: apiStatus.apis.system
        })
    }

    async getRuntimeConfig(connection: Connection): Promise<string> {
        return (
            await this.clientProvider
                .getEvitaManagementClient(connection)
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

    async isClassifierValid(connection: Connection, classifierType: ClassifierType, classifier: string): Promise<ClassifierValidationErrorType | undefined> {
        if (this.reservedKeywords == undefined) {
            try {
                const response: GrpcReservedKeywordsResponse = await this.clientProvider.getEvitaManagementClient(connection)
                    .listReservedKeywords(Empty)
                this.reservedKeywords = this.reservedKeywordsConverter.convert(response.keywords)
            } catch (e) {
                this.handleCallError(e, connection)
            }
        }

        if (classifier.trim().length === 0) {
            return ClassifierValidationErrorType.Empty
        }
        if (classifier !== classifier.trim()) {
            return ClassifierValidationErrorType.LeadingTrailingWhiteSpace
        }
        if (this.isClassifierKeyword(classifierType, classifier)) {
            return ClassifierValidationErrorType.Keyword
        }
        if (!this.classifierFormatPattern.test(classifier)) {
            return ClassifierValidationErrorType.Format
        }

        return undefined
    }

    async createCatalog(
        connection: Connection,
        catalogName: string
    ): Promise<boolean> {
        try {
            const catalogResponse: GrpcDefineCatalogResponse =
                await this.clientProvider
                    .getEvitaClient(connection)
                    .defineCatalog({ catalogName })

            return catalogResponse.success
        } catch (e) {
            throw this.handleCallError(e, connection)
        }
    }

    async dropCatalog(
        connection: Connection,
        catalogName: string
    ): Promise<boolean> {
        const response = await this.clientProvider
            .getEvitaClient(connection)
            .deleteCatalogIfExists({
                catalogName
            })
        return response.success
    }

    async renameCatalog(
        connection: Connection,
        catalogName: string,
        newCatalogName: string
    ): Promise<boolean> {
        const response = await this.clientProvider
            .getEvitaClient(connection)
            .renameCatalog({
                catalogName,
                newCatalogName
            })
        return response.success
    }

    async replaceCatalog(
        connection: Connection,
        catalogNameToBeReplacedWith: string,
        catalogNameToBeReplaced: string
    ): Promise<boolean> {
        const response = await this.clientProvider
            .getEvitaClient(connection)
            .replaceCatalog({
                catalogNameToBeReplacedWith,
                catalogNameToBeReplaced
            })
        return response.success
    }

    async switchCatalogToAliveState(connection: Connection, catalogName: string): Promise<boolean> {
        return this.evitaSessionProvider.executeInReadWriteSession(
            connection,
            await this.getCatalog(connection, catalogName),
            async (sessionId) => {
                const response: GrpcGoLiveAndCloseResponse = await this.clientProvider
                    .getEvitaSessionClient(connection)
                    .goLiveAndClose(
                        Empty,
                        {
                            headers: {
                                sessionId
                            }
                        }
                    )
                return response.success
            }
        )
    }

    async createCollection(
        connection: Connection,
        catalogName: string,
        entityType: string
    ): Promise<void> {
        return this.evitaSessionProvider.executeInReadWriteSession(
            connection,
            await this.getCatalog(connection, catalogName),
            async (sessionId) => {
                await this.clientProvider
                    .getEvitaSessionClient(connection)
                    .defineEntitySchema(
                        {
                            entityType,
                        },
                        {
                            headers: {
                                sessionId
                            },
                        }
                    )
            }
        )
    }

    async renameCollection(
        connection: Connection,
        catalogName: string,
        entityType: string,
        newName: string
    ): Promise<boolean> {
        return await this.evitaSessionProvider.executeInReadWriteSession(
            connection,
            await this.getCatalog(connection, catalogName),
            async (sessionId) => {
                const response: GrpcRenameCollectionResponse = await this.clientProvider
                    .getEvitaSessionClient(connection)
                    .renameCollection(
                        {
                            entityType,
                            newName
                        },
                        {
                            headers: {
                                sessionId
                            }
                        }
                    )

                return response.renamed
            }
        )
    }

    async dropCollection(
        connection: Connection,
        catalogName: string,
        entityType: string
    ): Promise<boolean> {
        return await this.evitaSessionProvider.executeInReadWriteSession(
            connection,
            await this.getCatalog(connection, catalogName),
            async (sessionId) => {
                const response: GrpcDeleteCollectionResponse =
                    await this.clientProvider
                        .getEvitaSessionClient(connection)
                        .deleteCollection(
                            {
                                entityType
                            },
                            {
                                headers: {
                                    sessionId
                                }
                            }
                        )

                return response.deleted
            }
        )
    }

    private get evitaValueConverter(): EvitaValueConverter {
        if (this._evitaValueConverter == undefined) {
            this._evitaValueConverter = new EvitaValueConverter()
        }
        return this._evitaValueConverter
    }

    private get entityConverter(): EntityConverter {
        if (this._entityConverter == undefined) {
            this._entityConverter = new EntityConverter(this.evitaValueConverter)
        }
        return this._entityConverter
    }

    private get extraResultConverter(): ExtraResultConverter {
        if (this._extraResultConverter == undefined) {
            this._extraResultConverter = new ExtraResultConverter(this.entityConverter)
        }
        return this._extraResultConverter
    }

    private get catalogSchemaConverter(): CatalogSchemaConverter {
        if (this._catalogSchemaConverter == undefined) {
            this._catalogSchemaConverter = new CatalogSchemaConverter(this.evitaValueConverter)
        }
        return this._catalogSchemaConverter
    }

    private get catalogConverter(): CatalogConverter {
        if (this._catalogConverter == undefined) {
            this._catalogConverter = new CatalogConverter()
        }
        return this._catalogConverter
    }

    private get responseConverter(): ResponseConverter {
        if (this._responseConverter == undefined) {
            this._responseConverter = new ResponseConverter(this.entityConverter, this.extraResultConverter)
        }
        return this._responseConverter
    }

    private get serverStatusConverter(): ServerStatusConverter {
        if (this._serverStatusConverter == undefined) {
            this._serverStatusConverter = new ServerStatusConverter()
        }
        return this._serverStatusConverter
    }

    private get clientProvider(): ClientProvider {
        if (this._clientProvider == undefined) {
            this._clientProvider = new ClientProvider()
        }
        return this._clientProvider
    }

    private get evitaSessionProvider(): EvitaSessionProvider {
        if (this._evitaSessionProvider == undefined) {
            this._evitaSessionProvider = new EvitaSessionProvider(this.clientProvider)
        }
        return this._evitaSessionProvider
    }

    private get reservedKeywordsConverter(): ReservedKeywordsConverter {
        if (this._reservedKeywordsConverter == undefined) {
            this._reservedKeywordsConverter = new ReservedKeywordsConverter()
        }
        return this._reservedKeywordsConverter
    }

    private isClassifierKeyword(classifierType: ClassifierType, classifier: string): boolean {
        if (classifier.trim().length === 0) {
            return false
        }
        const normalizedClassifier: Keyword = new Keyword(
            splitStringWithCaseIntoWords(classifier)
                .map(it => it.toLowerCase())
                .toArray()
        )
        if (this.reservedKeywords == undefined) {
            throw new UnexpectedError('Missing reserved keywords.')
        }
        const reservedKeywords: Immutable.List<Keyword> | undefined = this.reservedKeywords.get(classifierType)
        if (reservedKeywords == undefined) {
            return false
        }
        return reservedKeywords.findIndex(it => it.equals(normalizedClassifier)) > -1
    }

    // todo lho this shouldnt exist, component should call getCatalogs on new session
    async downloadCatalogsSameSession(
        connection: Connection,
        sessionId: string
    ): Promise<Catalog[]> {
        const resultData = (
            await this.clientProvider
                .getEvitaManagementClient(connection)
                .getCatalogStatistics(Empty, {
                    headers: {
                        sessionId
                    }
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
        const res = await this.clientProvider
            .getEvitaClient(connection)
            .createReadWriteSession({ catalogName })
        const result = await this.clientProvider
            .getEvitaSessionClient(connection)
            .backupCatalog(
                {
                    includingWAL,
                    pastMoment: {
                        offset: pastMoment.offset,
                        timestamp: pastMoment.timestamp
                    }
                },
                {
                    headers: {
                        sessionId: res.sessionId
                    }
                }
            )
        return this.backupConverter.convertBackupCatalog(result)
    }

    async getMinimalBackupDate(
        connection: Connection,
        catalogName: string
    ): Promise<CatalogVersionAtResponse> {
        const res = await this.clientProvider
            .getEvitaClient(connection)
            .createReadOnlySession({ catalogName })
        const result: GrpcCatalogVersionAtResponse = await this.clientProvider
            .getEvitaSessionClient(connection)
            .getCatalogVersionAt(
                {},
                {
                    headers: {
                        sessionId: res.sessionId
                    }
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
        const result = await this.clientProvider
            .getEvitaManagementClient(connection)
            .listFilesToFetch({
                origin: 'BackupTask',
                pageNumber,
                pageSize
            })
        return this.backupConverter.convertFilesTofetch(result)
    }

    async getActiveJobs(
        connection: Connection,
        pageNumber: number,
        pageSize: number,
        simplifiedState?: TaskSimplifiedState[],
        taskType?: string
    ): Promise<TaskStatuses> {
        const params = simplifiedState && simplifiedState.length > 0
            ? this.taskSimplifiedStateConverter.convertTaskStatesToGrpc(
                simplifiedState
            )
            : []
        const result = await this.clientProvider
            .getEvitaManagementClient(connection)
            .listTaskStatuses({
                pageNumber,
                pageSize,
                taskType,
                simplifiedState: params
            })
        const jobs = this.jobsConverter.convertJobs(result)
        return jobs
    }

    async getJfrRecords(connection: Connection, pageNumber: number, pageSize: number): Promise<FilesToFetch> {
        const result = await this.clientProvider.getEvitaManagementClient(connection).listFilesToFetch({
            origin: 'JfrRecorderTask',
            pageNumber,
            pageSize
        })

        return this.backupConverter.convertFilesTofetch(result)
    }

    async stopJfrRecording(connection: Connection):Promise<boolean> {
        return (await ky.post(connection.observabilityUrl + '/stopRecording')).ok
    }

    async downloadFile(connection: Connection, fileId: Uuid): Promise<Blob> {
        const res = this.clientProvider.getEvitaManagementClient(connection).fetchFile({
            fileId: {
                leastSignificantBits: fileId.leastSignificantBits,
                mostSignificantBits: fileId.mostSignificantBits
            }
        })
        const data: Uint8Array[] = []

        for await (const job of res) {
            data.push(job.fileContents)
        }
        return new Blob(data)
    }

    async uploadFile(connection: Connection, stream: AsyncIterable<GrpcRestoreCatalogRequest>): Promise<GrpcRestoreCatalogResponse> {
        const res = await this.clientProvider.getEvitaManagementClient(connection).restoreCatalog(stream)
        return res
    }

    async downloadRecordingEventTypes(connection: Connection):Promise<EventType[]>{
        const result = await ky.get(connection.observabilityUrl + '/getRecordingEventTypes')
        return (await result.json()) as EventType[]
    }

    async startJrfRecording(connection: Connection, allowedEvents: string[]):Promise<boolean> {
        const result = await ky.post(connection.observabilityUrl + '/startRecording', {
            json: { allowedEvents: allowedEvents }

        })
        return result.ok
    }

    async restoreCatalog(
        connection: Connection,
        catalogName: string,
        fileId: Uuid
    ): Promise<TaskStatus> {
        const result = await this.clientProvider
            .getEvitaManagementClient(connection)
            .restoreCatalogFromServerFile({
                catalogName,
                fileId: {
                    leastSignificantBits: fileId.leastSignificantBits,
                    mostSignificantBits: fileId.mostSignificantBits
                }
            })
        return this.jobsConverter.convertJob(result.task!)
    }

    async cancelJob(connection: Connection, taskId: Uuid): Promise<boolean> {
        const result = await this.clientProvider.getEvitaManagementClient(connection).cancelTask({
            taskId: {
                leastSignificantBits: taskId.leastSignificantBits,
                mostSignificantBits: taskId.mostSignificantBits
            }
        })
        return result.success
    }

    private get taskSimplifiedStateConverter(): TaskSimplifiedStateConverter {
        if (this._taskSimplifiedStateConverter == undefined) {
            this._taskSimplifiedStateConverter = new TaskSimplifiedStateConverter()
        }
        return this._taskSimplifiedStateConverter
    }

    private get backupConverter(): BackupConverter {
        if (this._backupConverter == undefined) {
            this._backupConverter = new BackupConverter(
                this.taskSimplifiedStateConverter
            )
        }
        return this._backupConverter
    }
    private get jobsConverter(): JobsConverter {
        if (this._jobsConverter == undefined) {
            this._jobsConverter = new JobsConverter(
                this.taskSimplifiedStateConverter
            )
        }
        return this._jobsConverter
    }

    private handleCallError(e: any, connection?: Connection): LabError {
        if (e instanceof ConnectError) {
            return new UnexpectedError(`${e.code}: ${e.message}`)
        } else if (e.name === 'HTTPError') {
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
