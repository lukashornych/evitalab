import { LabInternalError } from '@/model/lab'

/**
 * Occurs when lab storage is initialized using an incompatible lab version and the stored data cannot be
 * reliably read by that version.
 */
export class IncompatibleStorageVersionError extends LabInternalError {
    constructor() {
        super(
            'IncompatibleStorageVersionError',
            undefined,
            'Stored data are stored using incompatible version of evitaLab. You can access them only using the version they were created with. Creating new storage...'
        )
    }
}
