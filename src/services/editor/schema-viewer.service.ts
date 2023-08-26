import { LabService } from '@/services/lab.service'
import { inject, InjectionKey } from 'vue'
import {
    CatalogSchemaPointer,
    EntitySchemaPointer,
    SchemaPointer,
    SchemaViewerDataPointer
} from '@/model/editor/schema-viewer'
import { CatalogSchema, EntitySchema } from '@/model/evitadb'

export const key: InjectionKey<SchemaViewerService> = Symbol()

/**
 * Service for handling schema viewer tab component.
 */
export class SchemaViewerService {
    readonly labService: LabService

    constructor(labService: LabService) {
        this.labService = labService
    }

    async getSchema(dataPointer: SchemaViewerDataPointer): Promise<CatalogSchema | EntitySchema> {
        const schemaPointer: SchemaPointer = dataPointer.schemaPointer
        if (schemaPointer instanceof CatalogSchemaPointer) {
            return this.labService.getCatalogSchema(dataPointer.connection, schemaPointer.catalogName)
        } else if (schemaPointer instanceof EntitySchemaPointer) {
            return this.labService.getEntitySchema(dataPointer.connection, schemaPointer.catalogName, schemaPointer.entityName)
        } else {
            throw new Error(`Unsupported type of schema ${schemaPointer}`)
        }
    }
}

export const useSchemaViewerService = (): SchemaViewerService => {
    return inject(key) as SchemaViewerService
}

