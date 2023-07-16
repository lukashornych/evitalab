import ky from 'ky'
import { EvitaDBConnection } from '@/model/lab'
import { inject, InjectionKey } from 'vue'
import { Store } from 'vuex'
import { State } from '@/store'

export const key: InjectionKey<LabService> = Symbol()

/**
 * Service that manages lifecycle of a whole evitaLab instance. It contains generic methods for accessing evitaDB servers
 * and so on.
 */
export class LabService {
    readonly store: Store<State>

    constructor(store: Store<State>) {
        this.store = store
    }

    getConnections = (): EvitaDBConnection[] => {
        return this.store.state.lab.connections
    }

    addConnection = (connection: EvitaDBConnection): void => {
        this.store.commit('lab/addConnection', connection)
    }

    removeConnection = (connectionName: string): void => {
        this.store.commit('lab/removeConnection', connectionName)
    }

    getCatalogs = async (connection: EvitaDBConnection): Promise<any> => {
        return await ky.get(`${connection.restUrl}/system/catalogs`)
            .json()
    }

    getCatalogSchema = async (connection: EvitaDBConnection, catalogName: string): Promise<any> => {
        return await ky.get(`${connection.restUrl}/${catalogName}/schema`).json()
    }

    getEntities = async (connection: EvitaDBConnection, filterBy: string = '', orderBy: string = ''): Promise<any> => {
        return await ky.post(
            `${connection.restUrl}/evita/entity/list`,
            {
                headers: {
                    'Content-Type': 'application/evitaql+json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    query: this.buildQuery(filterBy, orderBy)
                })
            },
        )
            .json()
    }

    private buildQuery = (filterBy?: string, orderBy?: string): string => {
        let query = 'query('

        const constraints: string[] = []
        constraints.push('collection(\'Product\')')
        if (filterBy) {
            constraints.push(`filterBy(${filterBy})`)
        }
        if (orderBy) {
            constraints.push(`orderBy(${orderBy})`)
        }
        query += constraints.join(",")

        query += ')'

        return query
    }
}

export const useLabService = (): LabService => {
    return inject(key) as LabService
}
