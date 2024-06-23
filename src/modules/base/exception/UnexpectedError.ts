import { EvitaDBConnectionId } from '@/modules/connection/model/EvitaDBConnectionId'
import { EvitaDBConnection } from '@/modules/connection/model/EvitaDBConnection'

/**
 * Unexpected error that should never happen. We don't know what happened.
 */
export class UnexpectedError extends LabInternalError {
    constructor(connection: EvitaDBConnection | undefined, detail: string) {
        super(
            'UnexpectedError',
            connection,
            'Unexpected error occurred.',
            detail
        )
    }
}
