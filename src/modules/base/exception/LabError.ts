import { EvitaDBConnection } from '@/model/EvitaDBConnection'

/**
 * Base for all lab-specific errors.
 */
export abstract class LabError extends Error {
    readonly connection?: EvitaDBConnection

    protected readonly _detail?: string | undefined
    get detail(): string | undefined {
        return this._detail
    }

    protected constructor(name: string, connection: EvitaDBConnection | undefined, message: string, detail?: string) {
        super(detail ? `${message}: ${detail}` : message)
        this.name = name
        this.connection = connection
        this._detail = detail
    }
}
