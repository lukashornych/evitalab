import { inject, InjectionKey } from 'vue'
import { LabService } from '@/services/lab.service'
import { EvitaQLDataPointer } from '@/model/tab/evitaql-console'
import ky from 'ky'

export const key: InjectionKey<EvitaQLConsoleService> = Symbol()

/**
 * Service for running EvitaQL console component.
 */
export class EvitaQLConsoleService {
    readonly labService: LabService

    constructor(labService: LabService) {
        this.labService = labService
    }

    /**
     * Executes user GraphQL query against a given evitaDB server and catalog.
     */
    // todo lho variables
    async executeEvitaQLQuery(dataPointer: EvitaQLDataPointer, query: string, variables?: object): Promise<string> {
        const urlCatalogName: string = (await this.labService.getCatalogSchema(dataPointer.connection, dataPointer.catalogName))
            .nameVariants
            .kebabCase

        const result: any = await ky.post(
            `${dataPointer.connection.restUrl}/${urlCatalogName}/entity/query`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ query })
            },
        )
            .json()

        return JSON.stringify(result, null, 2)
    }
}

export const useEvitaQLConsoleService = (): EvitaQLConsoleService => {
    return inject(key) as EvitaQLConsoleService
}
