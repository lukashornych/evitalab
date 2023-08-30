import { EvitaDBConnection } from '@/model/lab'
import {
    EvitaDBInstanceNetworkError,
    EvitaDBInstanceServerError,
    LabError,
    UnexpectedError
} from '@/model/editor/editor'

/**
 * Common base for all API clients.
 */
export abstract class ApiClient {

    /**
     * Translates HTTP errors into specific lab errors.
     */
    protected handleCallError(e: any, connection: EvitaDBConnection): LabError {
        if (e.name === 'HTTPError') {
            const statusCode: number = e.response.status
            if (statusCode >= 500) {
                return new EvitaDBInstanceServerError(connection)
            } else {
                return new UnexpectedError(connection, e.message)
            }
        } else if (e.name === 'TypeError' && e.message === 'Failed to fetch') {
            return new EvitaDBInstanceNetworkError(connection)
        } else {
            return new UnexpectedError(connection, e.message)
        }
    }
}
