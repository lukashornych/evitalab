import { App } from 'vue'
import { Store } from 'vuex'
import { State } from '@/store'
import { LabService, key as labServiceKey } from '@/services/lab.service'
import { EditorService, key as editorServiceKey } from '@/services/editor/editor.service'
import { GraphQLConsoleService, key as graphQLConsoleServiceKey } from '@/services/editor/graphql-console.service'
import { DataGridConsoleService, key as dataGridServiceKey } from '@/services/editor/data-grid-console.service'
import { EvitaQLConsoleService, key as evitaQLConsoleServiceKey } from '@/services/editor/evitaql-console.service'
import { SchemaViewerService, key as schemaViewerServiceKey } from '@/services/editor/schema-viewer.service'

/**
 * Creates and registers all lab services to the application.
 */
export function registerServices(app: App, store: Store<State>): void {
    const labService: LabService = new LabService(store)
    const editorService: EditorService = new EditorService(store)
    const dataGridConsoleService: DataGridConsoleService = new DataGridConsoleService(labService)
    const graphQLConsoleService: GraphQLConsoleService = new GraphQLConsoleService(labService)
    const evitaQLConsoleService: EvitaQLConsoleService = new EvitaQLConsoleService(labService)
    const schemaViewerService: SchemaViewerService = new SchemaViewerService(labService)

    app
        .provide(labServiceKey, labService)
        .provide(editorServiceKey, editorService)
        .provide(dataGridServiceKey, dataGridConsoleService)
        .provide(graphQLConsoleServiceKey, graphQLConsoleService)
        .provide(evitaQLConsoleServiceKey, evitaQLConsoleService)
        .provide(schemaViewerServiceKey, schemaViewerService)
}
