import { App } from 'vue'
import { State } from '@/store'
import { LabService, key as labServiceKey } from '@/services/lab.service'
import { EditorService, key as editorServiceKey } from '@/services/editor.service'
import { GraphQLConsoleService, key as graphQLConsoleServiceKey } from '@/services/tab/graphql-console.service'
import { DataGridConsoleService, key as dataGridServiceKey } from '@/services/tab/data-grid-console.service'
import { EvitaQLConsoleService, key as evitaQLConsoleServiceKey } from '@/services/tab/evitaql-console.service'
import { Store } from 'vuex'

/**
 * Creates and registers all lab services to the application.
 */
export function registerServices(app: App, store: Store<State>): void {
    const labService: LabService = new LabService(store)
    const editorService: EditorService = new EditorService(store)
    const dataGridConsoleService: DataGridConsoleService = new DataGridConsoleService(labService)
    const graphQLConsoleService: GraphQLConsoleService = new GraphQLConsoleService(labService)
    const evitaQLConsoleService: EvitaQLConsoleService = new EvitaQLConsoleService(labService)

    app
        .provide(labServiceKey, labService)
        .provide(editorServiceKey, editorService)
        .provide(dataGridServiceKey, dataGridConsoleService)
        .provide(graphQLConsoleServiceKey, graphQLConsoleService)
        .provide(evitaQLConsoleServiceKey, evitaQLConsoleService)
}
