import { LabInternalError } from '@/modules/base/exception/LabInternalError'
import { EvitaDBConnection } from '@/modules/connection/model/EvitaDBConnection'

/**
 * Error thrown when the UI is trying to access a driver value without checking if it is supported by the
 * driver first
 */
export class UnsupportedValueAccessError extends LabInternalError {

    constructor(connection: EvitaDBConnection | undefined,
                message: string,
                detail?: string) {
        super('UnsupportedValueAccessError', connection, message, detail)
    }
}
