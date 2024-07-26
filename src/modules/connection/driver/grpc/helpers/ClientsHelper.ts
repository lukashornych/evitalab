import {
    createPromiseClient,
    PromiseClient,
    Transport,
} from '@connectrpc/connect'
import { EvitaService } from '../gen/GrpcEvitaAPI_connect'
import { EvitaManagementService } from '../gen/GrpcEvitaManagementAPI_connect'
import { EvitaSessionService } from '../gen/GrpcEvitaSessionAPI_connect'
import { Connection } from '@/modules/connection/model/Connection'
import { ConnectionId } from '@/modules/connection/model/ConnectionId'

export type EvitaClient = PromiseClient<typeof EvitaService>
export type SessionClient = PromiseClient<typeof EvitaSessionService>
export type ManagmentClient = PromiseClient<typeof EvitaManagementService>

//TODO: Add docs
export class ClientsHelper {
    private static evitaClients: Map<ConnectionId, EvitaClient> = new Map<ConnectionId, EvitaClient>();
    public static getEvitaClient(connection: Connection, transport: Transport): EvitaClient {
        let evitaClient : EvitaClient | undefined = this.evitaClients.get(connection.id);
        if (!evitaClient) {
            evitaClient = createPromiseClient(EvitaService, transport)
            this.evitaClients.set(connection.id, evitaClient);
            return evitaClient;
        }
        return evitaClient;
    }

    private static managmentClients?: Map<ConnectionId, ManagmentClient> = new Map<ConnectionId, ManagmentClient>
    public static getManagmentClient(connection: Connection, transport: Transport): ManagmentClient {
        let managmentClient : ManagmentClient | undefined = this.managmentClients?.get(connection.id); 
        if (!managmentClient) {
            managmentClient = createPromiseClient(
                EvitaManagementService,
                transport,
            )
        }
        return managmentClient
    }

    private static sessionClients?: Map<ConnectionId, SessionClient> = new Map<ConnectionId, SessionClient>
    public static getSessionClient(connection: Connection, transport: Transport): SessionClient {
        let sessionClient : SessionClient | undefined = this.sessionClients?.get(connection.id);  
        if (!sessionClient) {
            sessionClient = createPromiseClient(
                EvitaSessionService,
                transport
            )
        }
        return sessionClient
    }
}
