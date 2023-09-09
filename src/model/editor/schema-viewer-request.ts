import { TabRequest } from '@/model/editor/editor'
import { SchemaPointer, SchemaViewerDataPointer, SchemaViewerProps } from '@/model/editor/schema-viewer'
import { EvitaDBConnection } from '@/model/lab'
import { DefineComponent, markRaw } from 'vue'
import LabEditorViewerCatalogSchema from '@/components/lab/editor/schema/LabEditorSchemaViewer.vue'

/**
 * Creates new schema viewer tab.
 */
export class SchemaViewerRequest extends TabRequest<SchemaViewerProps> {
    constructor(connection: EvitaDBConnection, schemaPointer: SchemaPointer) {
        super(
            `${schemaPointer.path().join(' > ')} [${connection.name}]`,
            'mdi-file-code',
            markRaw(LabEditorViewerCatalogSchema as DefineComponent<any, any, any>),
            {
                dataPointer: new SchemaViewerDataPointer(connection, schemaPointer)
            }
        )
    }
}
