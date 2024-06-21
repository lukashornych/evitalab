import { LabInvalidUsageError } from '@/model/LabInvalidUsageError'
import { EvitaDBConnection } from '@/model/EvitaDBConnection'

/**
 * Could not connect to the server (evitaDB instance). We can't do anything about it.
 */
export class EvitaDBInstanceNetworkError extends LabInvalidUsageError {
    constructor(connection: EvitaDBConnection | undefined) {
        super(
            'EvitaDBInstanceNetworkError',
            connection,
            `Could not connect to the '${connection?.name || 'unknown'}' instance. Please check your connection settings.`
        )
    }
}
