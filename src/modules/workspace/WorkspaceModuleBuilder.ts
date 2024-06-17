import { ModuleBuilder } from '@/lab/ModuleBuilder'
import { LabBuilder } from '@/lab/LabBuilder'
import { SupportedLocale } from '@/lab/vue-plugins/i18n'
import i18nEn from '@/modules/workspace/i18n/en.json'
import { Command } from '@/modules/workspace/keymap/Command'

/**
 * Initializes workspace module. Workspace module provides the base UI (main view, tabs, toolbars, ...) for the entire evitaLab.
 */
export class WorkspaceModuleBuilder implements ModuleBuilder {

    build(builder: LabBuilder): void {
        this.registerRoutes(builder)
        this.registerI18n(builder)
        this.registerKeyboardShortcutMappings(builder)
    }

    private registerRoutes(builder: LabBuilder): void {
        // main evitaLab view
        builder.addRoute({
            path: '/lab',
            component: () => import('@/modules/workspace/view/Layout.vue'),
            children: [
                {
                    path: '',
                    name: 'evitaLab',
                    // route level code-splitting
                    // this generates a separate chunk (about.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () => import(/* webpackChunkName: "home" */ '@/modules/workspace/view/MainView.vue'),
                },
            ],
        })
    }

    private registerI18n(builder: LabBuilder): void {
        builder.addI18nTexts(new Map<string, any>([[SupportedLocale.En, i18nEn]]))
    }

    private registerKeyboardShortcutMappings(builder: LabBuilder): void {
        builder.addKeyboardShortcutMapping(Command.System_Keymap, 'Ctrl+Alt+K', 'Cmd+Option+K')

        builder.addKeyboardShortcutMapping(Command.System_Panels_ConnectionsExplorer, 'Alt+1', 'Ctrl+Shift+1')

        builder.addKeyboardShortcutMapping(Command.System_Editor_PreviousTab, 'Ctrl+Alt+PageUp', 'Cmd+Option+PageUp')
        builder.addKeyboardShortcutMapping(Command.System_Editor_NextTab, 'Ctrl+Alt+PageDown', 'Cmd+Option+PageDown')
        builder.addKeyboardShortcutMapping(Command.System_Editor_CloseTab, 'Ctrl+Q', 'Cmd+E')
        builder.addKeyboardShortcutMapping(Command.System_Editor_CloseAllTabs, 'Ctrl+Shift+Q', 'Cmd+Shift+E')
    }
}
