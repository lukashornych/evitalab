import { Connection } from "@/modules/connection/model/Connection";
import { ConnectionId } from "@/modules/connection/model/ConnectionId";
import { Transport } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";

//TODO implement and add doc
export class TransportHelper {
    private static readonly transports: Map<ConnectionId, Transport> = new Map();

    public static getTransport(connection: Connection){
        let transport: Transport | undefined = this.transports.get(connection.id);
        if(!transport){
            if(!connection.grpcUrl){
                throw new Error("Grpc url is undefined");
            }
            transport = createConnectTransport({
                baseUrl: connection.grpcUrl,
            })
            this.transports.set(connection.id, transport);
        }
        return transport
    }
}