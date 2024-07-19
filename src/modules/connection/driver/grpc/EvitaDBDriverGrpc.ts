import { List } from 'immutable'
import { createPromiseClient } from '@connectrpc/connect'
import { EvitaService } from '../../../../gen/GrpcEvitaAPI_connect'
import { EvitaManagementService } from "../../../../gen/GrpcEvitaManagementAPI_connect"
import { EvitaSessionService } from "../../../../gen/GrpcEvitaSessionAPI_connect"
import { createConnectTransport } from '@connectrpc/connect-web'
import { EvitaDBDriver } from '../EvitaDBDriver'
import { Catalog } from '../../model/Catalog'
import { Connection } from '../../model/Connection'
import { Response } from '../../model/data/Response'
import { CatalogSchema } from '../../model/schema/CatalogSchema'
import { Empty } from '@bufbuild/protobuf'
import { GrpcCatalogStatistics } from '@/gen/GrpcEvitaDataTypes_pb'
import { stat } from 'fs'
import { GrpcQueryRequest } from '@/gen/GrpcEvitaSessionAPI_pb'

export class EvitaDBDriverGrpc implements EvitaDBDriver
{
    async getCatalogSchema(connection: Connection, catalogName: string): Promise<CatalogSchema> {
        const response = await this.managmentClient.getCatalogStatistics(Empty);
        throw new Error('Method not implemented.')
    }
    query(connection: Connection, catalogName: string, query: string): Promise<Response> {
        throw new Error('Method not implemented.')
    }
    async getCatalogs(connection: Connection): Promise<Catalog[]> {
        const catalogs = await this.client.getCatalogNames(Empty);
        throw new Error("Method not implemented.");

    }
    private readonly connectionUrl: string = 'http://LAPTOP-C4DH0B5J:5555'

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

    getSupportedVersions() : List<string> {
        return List(['all']);
    }
}
