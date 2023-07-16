/**
 * Represents a connection to a single evitaDB server. This allows the user to fetch data from concrete evitaDB server.
 */
export type EvitaDBConnection = {
    readonly name: string,
    readonly restUrl: string,
    readonly gqlUrl?: string,
}

/**
 * Type of lab panel.
 */
export enum PanelType {
    Explorer = 'explorer',
    Info = 'info'
}
