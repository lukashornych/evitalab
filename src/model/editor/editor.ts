import { v4 as uuidv4 } from 'uuid';
import { DefineComponent } from 'vue/dist/vue'
import { Raw } from 'vue'
import { EvitaDBConnection } from '@/model/lab'

/**
 * Request to instantiate a new editor tab.
 */
export abstract class TabRequest<P extends TabRequestComponentProps> {
    readonly id: string;
    readonly title: string;
    readonly icon: string;
    readonly component: Raw<DefineComponent<any, any, any>>
    readonly componentProps: P

    /**
     * Indicates whether this tab has been visited by the user or not.
     */
    new: boolean = true

    protected constructor(title: string, icon: string, component: Raw<DefineComponent<any, any, any>>, componentProps: P) {
        this.id = uuidv4()
        this.title = title
        this.icon = icon
        this.component = component
        this.componentProps = componentProps
    }
}

/**
 * Interface that is supposed to represent props of a component that is used to render inside a tab.
 */
export interface TabRequestComponentProps {}

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
        super(message)
        this.name = name
        this.connection = connection
        this._detail = detail
    }
}

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

export abstract class LabInvalidUsageError extends LabError {
    protected constructor(name: string, connection: EvitaDBConnection | undefined, message: string, detail?: string) {
        super(name, connection, message, detail)
    }
}

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

/**
 * Something went wrong with the server (evitaDB instance). We can't do anything about it.
 */
export class EvitaDBInstanceServerError extends LabInvalidUsageError {
    constructor(connection: EvitaDBConnection | undefined) {
        super(
            'EvitaDBInstanceCallError',
            connection,
            'Server error. Please check your evitaDB instance for more details.'
        )
    }
}

/**
 * Could not connect to the server (evitaDB instance). We can't do anything about it.
 */
export class EvitaDBInstanceNetworkError extends LabInvalidUsageError {
    constructor(connection: EvitaDBConnection) {
        super(
            'EvitaDBInstanceNetworkError',
            connection,
            `Could not connect to the '${connection.name}' instance. Please check your connection settings.`
        )
    }
}
