import { Catalog } from '@/modules/connection/model/Catalog'
import { Connection } from '@/modules/connection/model/Connection'
import { CatalogSchema } from '@/modules/connection/model/schema/CatalogSchema'
import { Response } from '@/modules/connection/model/data/Response'
import { List } from 'immutable'
import { ServerStatus } from '../model/data/ServerStatus'
import { ApiReadiness } from '../model/data/ApiReadiness'
import { ApiServerStatus } from '../model/data/ApiServerStatus'
import { CatalogVersionAtResponse } from '../model/data/CatalogVersionAtResponse'
import { OffsetDateTime } from '../model/data-type/OffsetDateTime'
import { TaskStatus } from '../model/data/TaskStatus'
import { FilesToFetch } from '../model/data/FilesToFetch'
import { TaskStatuses } from '../model/data/TaskStatuses'
import { GrpcTaskSimplifiedState } from './grpc/gen/GrpcEnums_pb'
import { TaskSimplifiedState } from '../model/data/TaskSimplifiedState'

/**
 * evitaDB version-agnostic driver to access data from connected evitaDB server
 */
export interface EvitaDBDriver {
    //TODO: Add doc
    getServerDetails(connection: Connection): Promise<ServerStatus>
    //TODO: Add doc
    getApiReadiness(connection: Connection): Promise<ApiReadiness>
    //TODO: Add doc
    getRuntimeConfig(connection: Connection): Promise<string>
    //TODO: Add doc
    getServerStatus(connection: Connection): Promise<ApiServerStatus>
    //TODO: Add doc
    createCatalog(connection: Connection, catalogName: string): Promise<boolean>
    //TODO: Add doc
    dropCatalog(connection: Connection, catalogName: string): Promise<boolean>
    //TODO: Add doc
    renameCatalog(
        connection: Connection,
        catalogName: string,
        newCatalogName: string
    ): Promise<boolean>
    //TODO: Add doc
    replaceCatalog(
        connection: Connection,
        catalogNameToBeReplaced: string,
        catalogNameToBeReplacedWith: string
    ): Promise<boolean>
    //TODO: Add doc
    createCollection(
        connection: Connection,
        entityType: string,
        catalogName: string
    ): Promise<Catalog[] | undefined>
    //TODO: Add doc
    renameCollection(
        connection: Connection,
        entityType: string,
        newName: string,
        catalogName: string
    ): Promise<Catalog[] | undefined>
    //TODO: Add doc
    dropCollection(
        connection: Connection,
        entityType: string,
        catalogName: string
    ): Promise<Catalog[] | undefined>
    //TODO: Add doc
    getMinimalBackupDate(
        connection: Connection,
        catalogName: string
    ): Promise<CatalogVersionAtResponse>
    //TODO: Add doc
    createBackup(
        connection: Connection,
        catalogName: string,
        includingWAL: boolean,
        pastMoment: OffsetDateTime
    ): Promise<TaskStatus>
    //TODO: Add doc
    getBackups(
        connection: Connection,
        pageNumber: number,
        pageSize: number
    ): Promise<FilesToFetch>
    //TODO: Add doc
    getAciveJobs(
        connection: Connection,
        pageNumber: number,
        pageSize: number,
        simplifiedState?: TaskSimplifiedState[],
        taskType?: string
    ): Promise<TaskStatuses>
    /**
     * Which versions of evitaDB server this driver supports. Can be any string supported by https://www.npmjs.com/package/semver.
     * Comparison is done using the `.satisfies(...)` method
     */
    getSupportedVersions(): List<string>

    /**
     * Returns all available catalogs from server for the given evitaDB connection
     *
     * @param connection connection to evitaDB server
     */
    getCatalogs(connection: Connection): Promise<Catalog[]>

    // todo docs
    getCatalog(connection: Connection, catalogName: string): Promise<Catalog>

    /**
     * Returns schema for a given catalog name from server for the given evitaDB connection
     *
     * @param connection connection to evitaDB server
     * @param catalogName name of catalog for which schema is returned
     */
    getCatalogSchema(
        connection: Connection,
        catalogName: string
    ): Promise<CatalogSchema>

    /**
     * Returns list of entities for given query from given catalog for the given evitaDB connection
     *
     * @param connection connection to evitaDB server
     * @param catalogName name of catalog to query
     * @param query query to request entities
     */
    query(
        connection: Connection,
        catalogName: string,
        query: string
    ): Promise<Response>

    // todo use this driver even for GQL etc? it could make sense to differentiate version of gql apis
    // queryGraphQL(connection: Connection, path: string, query: string, variables: any = {}): Promise<GraphQLResponse>
}
