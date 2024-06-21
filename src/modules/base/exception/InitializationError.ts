import { LabInternalError } from '@/model/LabInternalError'

/**
 * Error that occurs only because of incorrect internal state initialization.
 */
export class InitializationError extends LabInternalError {
    constructor(detail: string) {
        super(
            'InitializationError',
            undefined,
            'Unexpected error occurred during intial initialization.',
            detail
        )
    }
}
