import { inject, InjectionKey } from 'vue'
import { LabService } from '@/services/lab.service'
import { EvitaQLDataPointer } from '@/model/editor/evitaql-console'
import { EvitaDBClient } from '@/services/evitadb-client'
import { Response } from '@/model/evitadb'

export const key: InjectionKey<EvitaQLConsoleService> = Symbol()

/**
 * Service for running EvitaQL console component.
 */
export class EvitaQLConsoleService {
    readonly labService: LabService
    readonly evitaDBClient: EvitaDBClient

    constructor(labService: LabService, evitaDBClient: EvitaDBClient) {
        this.labService = labService
        this.evitaDBClient = evitaDBClient
    }

    /**
     * Executes user GraphQL query against a given evitaDB server and catalog.
     */
    // todo lho variables
    async executeEvitaQLQuery(dataPointer: EvitaQLDataPointer, query: string, variables?: object): Promise<string> {
        const urlCatalogName: string = (await this.labService.getCatalogSchema(dataPointer.connection, dataPointer.catalogName))
            .nameVariants
            .kebabCase

        const result: Response = await this.evitaDBClient.queryEntities(dataPointer.connection, urlCatalogName, query)
        return JSON.stringify(result, null, 2)
    }
}

export const useEvitaQLConsoleService = (): EvitaQLConsoleService => {
    return inject(key) as EvitaQLConsoleService
}
