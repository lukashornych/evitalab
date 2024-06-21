import { LabInvalidUsageError } from '@/model/LabInvalidUsageError'
import { EvitaDBConnection } from '@/model/EvitaDBConnection'

/**
 * Something went wrong with the server (evitaDB instance). We can't do anything about it.
 */
export class EvitaDBInstanceServerError extends LabInvalidUsageError {
    constructor(connection: EvitaDBConnection | undefined) {
        super(
            'EvitaDBInstanceCallError',
            connection,
            'Server error. Please check your evitaDB instance for more details.'
        )
    }
}
