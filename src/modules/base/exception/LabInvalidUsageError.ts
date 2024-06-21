import { LabError } from '@/model/LabError'
import { EvitaDBConnection } from '@/model/EvitaDBConnection'

/**
 * Base lab-specific error indicated that the user did something wrong. It also means that the user can potentially fix the
 * problem themselves.
 */
export abstract class LabInvalidUsageError extends LabError {
    protected constructor(name: string, connection: EvitaDBConnection | undefined, message: string, detail?: string) {
        super(name, connection, message, detail)
    }
}
