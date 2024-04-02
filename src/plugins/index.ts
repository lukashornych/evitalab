/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import { codemirror, defaultCodemirrorOptions } from './codemirror'
import { toast, defaultToastOptions } from './toastification'
import { store, key as storeKey } from '@/store'
import VueApexCharts from 'vue3-apexcharts'
import router from '@/router'
import { i18n } from './i18n'
import { registerServices } from '@/plugins/services'

// Types
import type { App } from 'vue'

export function registerPlugins(app: App) {
    loadFonts()

    app
        .use(vuetify)
        .use(codemirror, defaultCodemirrorOptions)
        .use(toast, defaultToastOptions)
        .use(store, storeKey)
        .use(VueApexCharts)
        .use(router)
        .use(i18n)

    registerServices(app, store)
}
