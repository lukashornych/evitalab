/**
 * evitaLab representation of server readiness types
 */
export enum Readiness {
    ApiStarting = 'apiStarting',
    ApiReady = 'apiReady',
    ApiStalling = 'apiStalling',
    ApiShutdown = 'apiShutdown',
    ApiUnknown = 'apiUnknown'
}
