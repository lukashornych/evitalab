/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import { codemirror, codemirrorDefaultOptions } from './codemirror'
import { store, key as storeKey } from '@/store'
import router from '@/router'

// Services
import { LabService, key as labServiceKey } from '@/services/lab.service'
import { EditorService, key as editorServiceKey } from '@/services/editor.service'
import { GraphQLConsoleService, key as graphQLConsoleServiceKey } from '@/services/graphql-console.service'

// Types
import type { App } from 'vue'

export function registerPlugins(app: App) {
    loadFonts()
    app
        .use(vuetify)
        .use(codemirror, codemirrorDefaultOptions)
        .use(store, storeKey)
        .use(router)
        .provide(labServiceKey, new LabService(store))
        .provide(editorServiceKey, new EditorService(store))
        .provide(graphQLConsoleServiceKey, new GraphQLConsoleService())
}
