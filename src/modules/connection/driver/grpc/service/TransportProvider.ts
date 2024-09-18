import { Connection } from "@/modules/connection/model/Connection";
import { ConnectionId } from "@/modules/connection/model/ConnectionId";
import { Transport } from "@connectrpc/connect";
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'

//TODO implement and add doc
export class TransportProvider {
    private readonly transports: Map<ConnectionId, Transport> = new Map();

    public getTransport(connection: Connection){
        let transport: Transport | undefined = this.transports.get(connection.id);
        if(!transport){
            if(!connection.grpcUrl){
                throw new UnexpectedError("Grpc url is undefined");
            }
            transport = createGrpcWebTransport({
                baseUrl: connection.grpcUrl
            })
            this.transports.set(connection.id, transport);
        }
        return transport
    }
}
