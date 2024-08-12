import { ApiEndpoint } from "./ApiEndpoint";

export class ApiServerStatus {
    serverName: string;
    version: string;
    startedAt: string;
    uptime: number;
    uptimeForHuman: string;
    catalogsCorrupted: number;
    catalogsOk: number;
    healthProblems: string[];
    apis: ApiEndpoint[];

    constructor(
        serverName: string,
        version: string,
        startedAt: string,
        uptime: number,
        uptimeForHuman: string,
        catalogsCorrupted: number,
        catalogsOk: number,
        healthProblems: string[],
        apis: ApiEndpoint[]
    ) {
        this.serverName = serverName;
        this.version = version;
        this.startedAt = startedAt;
        this.uptime = uptime;
        this.uptimeForHuman = uptimeForHuman;
        this.catalogsCorrupted = catalogsCorrupted;
        this.catalogsOk = catalogsOk;
        this.healthProblems = healthProblems;
        this.apis = apis;
    }
}