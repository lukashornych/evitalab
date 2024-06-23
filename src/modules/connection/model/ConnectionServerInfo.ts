/**
 * Represents fetched server info for evitaDB connection.
 */
export class ConnectionServerInfo {
    readonly serverName: string
    readonly version: string
    readonly startedAt: Date
    readonly uptime: string
    readonly catalogsOk: number
    readonly catalogsCorrupted: number
    readonly apis: Map<ServerApiType, ServerApiInfo>

    private constructor(serverName: string,
                        version: string,
                        startedAt: Date,
                        uptime: string,
                        catalogsOk: number,
                        catalogsCorrupted: number,
                        apis: Map<ServerApiType, ServerApiInfo>) {
        this.serverName = serverName
        this.version = version
        this.startedAt = startedAt
        this.uptime = uptime
        this.catalogsOk = catalogsOk
        this.catalogsCorrupted = catalogsCorrupted
        this.apis = apis
    }

    static fromJson(json: any): ConnectionServerInfo {
        const apis: Map<ServerApiType, ServerApiInfo> = new Map()
        json.apis.forEach((apiInfo: any) => {
            const apiType: ServerApiType = Object.keys(apiInfo)[0] as ServerApiType
            const urls: string[] = apiInfo[apiType]
            apis.set(apiType, { urls })
        })
        return new ConnectionServerInfo(
            json.serverName,
            json.version,
            new Date(json.startedAt), // todo fix
            json.uptimeForHuman,
            json.catalogsOk,
            json.catalogsCorrupted,
            apis
        )
    }
}

export enum ServerApiType {
    System = 'system',
    Grpc = 'gRPC',
    GraphQL = 'graphQL',
    Rest = 'rest',
    Lab = 'lab'
}

export type ServerApiInfo = {
    readonly urls: string[]
}
