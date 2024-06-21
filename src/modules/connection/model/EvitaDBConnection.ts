import XXH, { HashObject } from 'xxhashjs'
import { EvitaDBConnectionId } from '@/modules/connection/model/EvitaDBConnectionId'

const hasher: HashObject = XXH.h64()

/**
 * Represents a connection to a single evitaDB server. This allows the user to fetch data from concrete evitaDB server.
 */
export class EvitaDBConnection {
    readonly id: EvitaDBConnectionId
    readonly name: string
    readonly preconfigured: boolean
    readonly labApiUrl?: string
    readonly restUrl?: string
    readonly gqlUrl?: string

    constructor(id: EvitaDBConnectionId | undefined, name: string, preconfigured: boolean, labApiUrl?: string, restUrl?: string, gqlUrl?: string) {
        this.id = id ? id : hasher.update(name).digest().toString(16)
        this.name = name
        this.preconfigured = preconfigured
        this.labApiUrl = this.normalizeApiUrl(labApiUrl)
        this.restUrl = this.normalizeApiUrl(restUrl)
        this.gqlUrl = this.normalizeApiUrl(gqlUrl)
    }

    static fromJson(json: any, preconfigured: boolean): EvitaDBConnection {
        return new EvitaDBConnection(json.id, json.name, preconfigured, json.labApiUrl, json.restUrl, json.gqlUrl)
    }

    private normalizeApiUrl(url: string | undefined): string | undefined {
        if (url == undefined) {
            return undefined
        }
        return url.endsWith('/') ? url.substring(0, url.length - 1) : url
    }
}
