import { v4 as uuidv4 } from 'uuid'

/**
 * Represents unique identifier of a single evitaDB server connection.
 */
export type EvitaDBConnectionId = string

/**
 * Represents a connection to a single evitaDB server. This allows the user to fetch data from concrete evitaDB server.
 */
export class EvitaDBConnection {
    readonly id: EvitaDBConnectionId
    readonly name: string
    readonly labApiUrl: string
    readonly restUrl: string
    readonly gqlUrl: string

    constructor(name: string, labApiUrl: string, restUrl: string, gqlUrl: string) {
        this.id = uuidv4()
        this.name = name
        this.labApiUrl = labApiUrl
        this.restUrl = restUrl
        this.gqlUrl = gqlUrl
    }
}

/**
 * Type of lab panel.
 */
export enum PanelType {
    Explorer = 'explorer',
    Info = 'info'
}

/**
 * Defines languages that will be used to query data from evitaDB.
 */
export enum QueryLanguage {
    EvitaQL = 'evitaql',
    GraphQL = 'graphql'
}
