import { EvitaDBConnection } from '@/model/EvitaDBConnection'
import { LabInvalidUsageError } from '@/model/LabInvalidUsageError'

/**
 * Error that is thrown when a query to evitaDB fails.
 */
export class QueryError extends LabInvalidUsageError {
    readonly error: any

    constructor(connection: EvitaDBConnection, error: any) {
        super('QueryError', connection, 'Query error occurred.', error instanceof Array ? error.map(it => it.message).join('; ') : error.message)
        this.error = error
    }
}
