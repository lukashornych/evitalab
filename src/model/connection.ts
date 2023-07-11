/**
 * Represents a connection to a single evitaDB server. This allows the user to fetch data from concrete evitaDB server.
 */
export type Connection = {
    name: string,
    restUrl: string,
    gqlUrl?: string,
}
