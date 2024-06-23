import { App, createApp } from 'vue'
import Lab from '*.vue'
import { loadFonts } from '@/lab/plugin/webfontloader'
import vuetify from '@/lab/plugin/vuetify'
import { defaultToastOptions, toast } from '@/lab/plugin/toastification'
import VueApexCharts from 'vue3-apexcharts'
import { codemirror, defaultCodemirrorOptions } from '@/vue-plugins/codemirror'
import { i18n } from '@/vue-plugins/i18n'
import router from '@/vue-plugins/router'
import pinia from '@/vue-plugins/pinia'
import { EvitaLabConfig } from '@/modules/config/EvitaLabConfig'
import { ConnectionManager } from '@/modules/connection/service/ConnectionManager'
import { EvitaDBServerProbe } from '@/modules/connection/service/EvitaDBServerProbe'
import { EvitaDBDriverResolver } from '@/modules/connection/driver/EvitaDBDriverResolver'

/**
 * Bootstraps the entire evitaLab.
 */
const app: App<Element> = createApp(Lab)

await loadFonts()
app
    .use(vuetify)
    .use(codemirror, defaultCodemirrorOptions)
    .use(toast, defaultToastOptions)
    .use(pinia)
    .use(VueApexCharts)
    .use(i18n)
    .use(router)

// todo lho

const keymap: Keymap = new Keymap()

const evitaDBClient: EvitaDBClient = new EvitaDBClient()
const graphQLClient: GraphQLClient = new GraphQLClient()
const evitaDBDocsClient: EvitaDBDocsClient = new EvitaDBDocsClient()

const labService: LabService = new LabService(store, evitaDBClient, evitaDBDocsClient)
const editorService: EditorService = new EditorService(store, labService)
const demoSnippetResolver: DemoSnippetResolver = new DemoSnippetResolver(labService)
const sharedTabResolver: SharedTabResolver = new SharedTabResolver(labService)
const dataGridService: DataGridService = new DataGridService(labService, evitaDBClient, graphQLClient)
const evitaQLConsoleService: EvitaQLConsoleService = new EvitaQLConsoleService(evitaDBClient)
const schemaViewerService: SchemaViewerService = new SchemaViewerService(labService)

const graphQLResultVisualizerService: GraphQLResultVisualiserService = new GraphQLResultVisualiserService(labService)
const evitaQLResultVisualizerService: EvitaQLResultVisualiserService = new EvitaQLResultVisualiserService(labService)

app
    .provide(EvitaLabConfig.load())
    .provide(keymapKey, keymap)
    .provide(labServiceKey, labService)
    .provide(editorServiceKey, editorService)
    .provide(demoSnippetResolverKey, demoSnippetResolver)
    .provide(sharedTabResolverKey, sharedTabResolver)
    .provide(dataGridServiceKey, dataGridService)
    .provide(graphQLConsoleServiceKey, graphQLConsoleService)
    .provide(evitaQLConsoleServiceKey, evitaQLConsoleService)
    .provide(schemaViewerServiceKey, schemaViewerService)
    .provide(graphqlResultVisualiserServiceKey, graphQLResultVisualizerService)
    .provide(evitaQLResultVisualiserServiceKey, evitaQLResultVisualizerService)
    .provide(ConnectionManager.load(labStorage, evitaDBClient))
    .provide(new EvitaDBServerProbe())
    .provide(new EvitaDBDriverResolver())

app.mount('#app')
