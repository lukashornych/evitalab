import { TabRequest, VoidTabRequestComponentData } from '@/model/editor/editor'
import { SchemaPointer, SchemaViewerDataPointer, SchemaViewerProps } from '@/model/editor/schema-viewer'
import { EvitaDBConnection } from '@/model/lab'
import { DefineComponent, markRaw } from 'vue'
import LabEditorSchemaViewer from '@/components/lab/editor/schema-viewer/LabEditorSchemaViewer.vue'

/**
 * Creates new schema viewer tab.
 */
export class SchemaViewerRequest extends TabRequest<SchemaViewerProps, VoidTabRequestComponentData> {
    constructor(connection: EvitaDBConnection, schemaPointer: SchemaPointer) {
        super(
            `${schemaPointer.path().slice(-1)[0]} [${connection.name}]`,
            'mdi-file-code',
            markRaw(LabEditorSchemaViewer as DefineComponent<any, any, any>),
            {
                dataPointer: new SchemaViewerDataPointer(connection, schemaPointer)
            }
        )
    }
}
