import { App } from 'vue'
import { Store } from 'vuex'
import { State } from '@/store'
import { LabService, key as labServiceKey } from '@/services/lab.service'
import { EditorService, key as editorServiceKey } from '@/services/editor/editor.service'
import { GraphQLConsoleService, key as graphQLConsoleServiceKey } from '@/services/editor/graphql-console.service'
import { DataGridConsoleService, key as dataGridServiceKey } from '@/services/editor/data-grid-console.service'
import { EvitaQLConsoleService, key as evitaQLConsoleServiceKey } from '@/services/editor/evitaql-console.service'
import { SchemaViewerService, key as schemaViewerServiceKey } from '@/services/editor/schema-viewer.service'
import { EvitaDBClient } from '@/services/evitadb-client'

/**
 * Creates and registers all lab services to the application.
 */
export function registerServices(app: App, store: Store<State>): void {
    const evitaDBClient: EvitaDBClient = new EvitaDBClient()

    const labService: LabService = new LabService(store, evitaDBClient)
    const editorService: EditorService = new EditorService(store)
    const dataGridConsoleService: DataGridConsoleService = new DataGridConsoleService(labService, evitaDBClient)
    const graphQLConsoleService: GraphQLConsoleService = new GraphQLConsoleService(labService)
    const evitaQLConsoleService: EvitaQLConsoleService = new EvitaQLConsoleService(labService, evitaDBClient)
    const schemaViewerService: SchemaViewerService = new SchemaViewerService(labService)

    app
        .provide(labServiceKey, labService)
        .provide(editorServiceKey, editorService)
        .provide(dataGridServiceKey, dataGridConsoleService)
        .provide(graphQLConsoleServiceKey, graphQLConsoleService)
        .provide(evitaQLConsoleServiceKey, evitaQLConsoleService)
        .provide(schemaViewerServiceKey, schemaViewerService)
}
