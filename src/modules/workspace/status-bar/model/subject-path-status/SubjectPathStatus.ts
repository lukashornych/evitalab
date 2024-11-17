import { SubjectPath } from '@/modules/workspace/status-bar/model/subject-path-status/SubjectPath'
import { SystemSubjectPath } from '@/modules/workspace/status-bar/model/subject-path-status/SystemSubjectPath'

const fallbackPath: SubjectPath = new SystemSubjectPath([])

/**
 * Holds user-resource paths
 */
export class SubjectPathStatus {

    _activatedPathId: string | undefined

    readonly availablePaths: Map<string, SubjectPath> = new Map()

    constructor() {
    }

    activatePath(id: string): void {
        this._activatedPathId = id
    }

    deactivatePath(): void {
        this._activatedPathId = undefined
    }

    get activatedPath(): SubjectPath | undefined {
        if (this._activatedPathId == undefined) {
            return fallbackPath
        }
        const activatedPath: SubjectPath | undefined = this.availablePaths.get(this._activatedPathId)
        if (activatedPath == undefined) {
            return fallbackPath
        }
        return activatedPath
    }

    definePath(id: string, path: SubjectPath): void {
        this.availablePaths.set(id, path)
    }

    deletePath(id: string): void {
        this.availablePaths.delete(id)
    }
}



