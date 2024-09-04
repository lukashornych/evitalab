import XXH, { HashObject } from 'xxhashjs'
import { ConnectionId } from '@/modules/connection/model/ConnectionId'

const hasher: HashObject = XXH.h64()

/**
 * Represents a connection to a single evitaDB server. This allows the user to fetch data from concrete evitaDB server.
 */
export class Connection {
    readonly id: ConnectionId
    readonly name: string
    readonly preconfigured: boolean
    readonly systemUrl: string
    readonly grpcUrl: string
    readonly gqlUrl?: string
    readonly restUrl?: string
    readonly observabilityUrl: string

    constructor(id: ConnectionId | undefined,
                name: string,
                preconfigured: boolean,
                systemUrl: string,
                grpcUrl: string,
                observabilityUrl: string,
                gqlUrl?: string,
                restUrl?: string) {
        this.id = id ? id : hasher.update(name).digest().toString(16)
        this.name = name
        this.preconfigured = preconfigured
        this.systemUrl = this.normalizeApiUrl(systemUrl)!
        this.grpcUrl = this.normalizeApiUrl(grpcUrl)!
        this.gqlUrl = this.normalizeApiUrl(gqlUrl)
        this.restUrl = this.normalizeApiUrl(restUrl)
        this.observabilityUrl = observabilityUrl
    }

    static fromJson(json: any, preconfigured: boolean): Connection {
        return new Connection(
            json.id,
            json.name,
            preconfigured,
            json.systemUrl,
            json.observabilityUrl,
            json.grpcUrl,
            json.gqlUrl,
            json.restUrl
        )
    }

    private normalizeApiUrl(url: string | undefined): string | undefined {
        if (url == undefined) {
            return undefined
        }
        return url.endsWith('/') ? url.substring(0, url.length - 1) : url
    }
}
