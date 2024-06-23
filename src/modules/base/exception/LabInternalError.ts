import { LabError } from '@/modules/base/exception/LabError'
import { EvitaDBConnection } from '@/modules/connection/model/EvitaDBConnection'

/**
 * Base lab-specific error indicated that something unexpected happened and user cannot do anything about it.
 */
export abstract class LabInternalError extends LabError {
    protected constructor(name: string, connection: EvitaDBConnection | undefined, message: string, detail?: string) {
        super(name, connection, message, detail)
    }

    get detail(): string {
        const parts: string[] = []
        if (this._detail !== undefined) {
            parts.push(this._detail)
        }
        if (this.stack !== undefined) {
            parts.push(this.stack)
        }
        return parts.join('\n\n')
    }
}
