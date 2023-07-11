import ky from 'ky'
import { Connection } from '@/model/connection'

export const getCatalogs = async (connection: Connection): Promise<any> => {
    return await ky.get(`${connection.restUrl}/system/catalogs`)
        .json()
}

export const getCatalogSchema = async (connection: Connection, catalogName: string): Promise<any> => {
    return await ky.get(`${connection.restUrl}/${catalogName}/schema`).json()
}

export const getEntities = async (connection: Connection, filterBy: string = '', orderBy: string = ''): Promise<any> => {
    return await ky.post(
        `${connection.restUrl}/evita/entity/list`,
        {
            headers: {
                'Content-Type': 'application/json+evitaql',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                query: buildQuery(filterBy, orderBy)
            })
        },
    )
        .json()
}


function buildQuery(filterBy?: string, orderBy?: string): string {
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
