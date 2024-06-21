import { LabInvalidUsageError } from '@/model/LabInvalidUsageError'
import { EvitaDBConnection } from '@/model/EvitaDBConnection'

/**
 * Thrown when request to evitaDB took too long.
 */
export class TimeoutError extends LabInvalidUsageError {
    constructor(connection: EvitaDBConnection | undefined) {
        super(
            'TimeoutError',
            connection,
            'Request timed out. Please check your connection settings.'
        )
    }
}
