import { LabInvalidUsageError } from '@/model/LabInvalidUsageError'

/**
 * Indicates that the user tried to create a connection with a name that already exists.
 */
export class DuplicateEvitaDBConnectionError extends LabInvalidUsageError {
    constructor(name: string) {
        super(
            'DuplicateEvitaDBConnectionError',
            undefined,
            `Connection with name '${name}' already exists.`
        )
    }
}
