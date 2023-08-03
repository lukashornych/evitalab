import { DataGridDataPointer } from '@/model/tab/data-grid-console'

/**
 * Executes query against evitaDB server in language defined by implementation.
 */
export interface QueryExecutor {

    /**
     * Executes query against evitaDB server in language defined by implementation and returns formatted data.
     *
     * @param dataPointer points to collection where to fetch data from
     * @param query pre-built query to execute in language defined by implementation
     */
    executeQuery(dataPointer: DataGridDataPointer, query: string): Promise<DataGridQueryResult>
}

/**
 * Holds query result of data grid console query.
 */
export type DataGridQueryResult = {
    readonly entities: any[],
    readonly totalEntitiesCount: number
}
