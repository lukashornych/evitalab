import { inject, InjectionKey } from 'vue'
import { DataGridDataPointer, DataGridQueryResult } from '@/model/tab/data-grid-console'
import { QueryLanguage } from '@/model/lab'
import ky from 'ky'
import { LabService } from '@/services/lab.service'
import { CatalogSchema } from '@/model/evitadb/schema'

export const key: InjectionKey<DataGridConsoleService> = Symbol()

export class DataGridConsoleService {
    readonly labService: LabService

    constructor(labService: LabService) {
        this.labService = labService
    }

    async executeQuery(dataPointer: DataGridDataPointer,
                       language: QueryLanguage,
                       filterBy: string,
                       orderBy: string,
                       requiredData: string[],
                       pageNumber: number,
                       pageSize: number): Promise<DataGridQueryResult> {
        switch (language) {
            case QueryLanguage.EvitaQL:
                return await this.executeEvitaQLQuery(dataPointer, filterBy, orderBy)
            case QueryLanguage.GraphQL:
                throw new Error('Not implemented')
        }
    }

    private async executeEvitaQLQuery(dataPointer: DataGridDataPointer, filterBy: string = '', orderBy: string = ''): Promise<DataGridQueryResult> {
        const urlCatalogName: string = (await this.labService.getCatalogSchema(dataPointer.connection, dataPointer.catalogName))
            .nameVariants
            .kebabCase

        const result = await ky.post(
            `${dataPointer.connection.restUrl}/${urlCatalogName}/entity/query`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    query: this.buildQuery(dataPointer.entityType, filterBy, orderBy)
                })
            },
        )
            .json()

        return {
            entities: result?.recordPage?.data || [],
            totalEntitiesCount: result?.recordPage?.totalRecordCount || 0
        }
    }

    private buildQuery(entityType: string, filterBy?: string, orderBy?: string): string {
        let query = 'query('

        const constraints: string[] = []
        constraints.push(`collection('${entityType}')`)
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

export const useDataGridConsoleService = ():DataGridConsoleService => {
    return inject(key) as DataGridConsoleService
}
