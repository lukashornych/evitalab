import { EvitaDBConnection } from '@/model/lab'
import { TabRequestComponentProps } from '@/model/editor/editor'
import LabEditorSchemaViewerCatalog from '@/components/LabEditorSchemaViewerCatalog.vue'
import LabEditorSchemaViewerEntity from '@/components/LabEditorSchemaViewerEntity.vue'
import { DefineComponent, markRaw, Raw } from 'vue'

/**
 * Points to concrete evitaDB schema (catalog, entity, attributes, ...)
 */
export class SchemaViewerDataPointer {
    readonly connection: EvitaDBConnection
    readonly schemaPointer: SchemaPointer

    constructor(connection: EvitaDBConnection, schemaPointer: SchemaPointer) {
        this.connection = connection
        this.schemaPointer = schemaPointer
    }
}

/**
 * Represents props of the LabEditorSchemaViewer component.
 */
export interface SchemaViewerProps extends TabRequestComponentProps {
    readonly dataPointer: SchemaViewerDataPointer
}

/**
 * Defines which concrete schema to show.
 */
export interface SchemaPointer {
    readonly catalogName: string

    /**
     * Returns component that will be used to render this schema.
     */
    component(): Raw<DefineComponent<any, any, any>>

    /**
     * Returns path to this schema.
     */
    path(): string[]
}

/**
 * Points to concrete evitaDB catalog schema
 */
export class CatalogSchemaPointer implements SchemaPointer {
    readonly catalogName: string

    constructor(catalogName: string) {
        this.catalogName = catalogName
    }

    component(): Raw<DefineComponent<any, any, any>> {
        return markRaw(LabEditorSchemaViewerCatalog as DefineComponent<any, any, any>)
    }

    path(): string[] {
        return [this.catalogName]
    }
}

/**
 * Points to concrete evitaDB entity schema nested inside a catalog schema.
 */
export class EntitySchemaPointer implements SchemaPointer {
    readonly catalogName: string
    readonly entityName: string

    constructor(catalogName: string, entityName: string) {
        this.catalogName = catalogName
        this.entityName = entityName
    }

    component(): Raw<DefineComponent<any, any, any>> {
        return markRaw(LabEditorSchemaViewerEntity as DefineComponent<any, any, any>)
    }

    path(): string[] {
        return [this.catalogName, 'entities', this.entityName]
    }
}
