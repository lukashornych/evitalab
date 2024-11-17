import { DefineComponent, markRaw, Raw } from 'vue'
import { SchemaPointer } from '@/modules/schema-viewer/viewer/model/SchemaPointer'
import AttributeSchemaViewer from '@/modules/schema-viewer/viewer/component/attribute/AttributeSchemaViewer.vue'
import { SchemaType } from '@/modules/schema-viewer/viewer/model/SchemaType'

/**
 * Points to evitaDB attribute schema nested inside an entity schema.
 */
export class EntityAttributeSchemaPointer implements SchemaPointer {
    readonly catalogName: string
    readonly entityType: string
    readonly attributeName: string

    constructor(catalogName: string, entityType: string, attributeName: string) {
        this.catalogName = catalogName
        this.entityType = entityType
        this.attributeName = attributeName
    }

    get component(): Raw<DefineComponent<any, any, any>> {
        return markRaw(AttributeSchemaViewer as DefineComponent<any, any, any>)
    }

    get schemaName(): string {
        return this.attributeName
    }

    get schemaType(): SchemaType {
        return SchemaType.Attribute
    }
}
