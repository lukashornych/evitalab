import { Lab, labKey } from '@/lab/Lab'
import { KeyboardShortcut } from '@/model/editor/keymap/KeyboardShortcut'
import { MenuRoot } from '@/lab/menus/MenuRoot'
import { InitializationError } from '@/model/lab'
import { MenuNode } from '@/lab/menus/MenuNode'
import { ToolWindow } from '@/lab/tool-windows/ToolWindow'
import { Map as ImmutableMap, List as ImmutableList } from 'immutable'
import { App, InjectionKey } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import { loadFonts } from '@/lab/vue-plugins/webfontloader'
import vuetify from '@/lab/vue-plugins/vuetify'
import { codemirror, defaultCodemirrorOptions } from '@/lab/vue-plugins/codemirror'
import { defaultToastOptions, toast } from '@/lab/vue-plugins/toastification'
import { key as storeKey, store } from '@/store'
import VueApexCharts from 'vue3-apexcharts'
import { buildI18n } from '@/lab/vue-plugins/i18n'
import { buildRouter } from '@/lab/vue-plugins/router'
import { deepMerge } from '@/utils/object'

/**
 * Helps to construct the {@link Lab} at the lab initialization.
 */
// todo try prebuilding this into the LabBootstrap to speed up booting using Vite plugins https://vitejs.dev/guide/api-plugin
export class LabBuilder {

    private readonly _app: App

    private readonly _routes: RouteRecordRaw[] = []

    private readonly _i18nTexts: Map<string, any> = new Map<string, any>()

    private readonly _publicServices: [InjectionKey<any>, any][] = []

    private readonly _toolWindows: Map<string, ToolWindow> = new Map<string, ToolWindow>()

    private readonly _menuRoots: Map<string, MenuRoot> = new Map<string, MenuRoot>()
    private readonly _menus: Map<string, MenuNode[]> = new Map<string, MenuNode[]>()

    private readonly _keyboardShortcutMappings: Map<string, KeyboardShortcut> = new Map<string, KeyboardShortcut>()

    constructor(app: App) {
        this._app = app
    }

    /**
     * Adds a router route to the main app.
     *
     * @param route route (view) to add
     */
    addRoute(route: RouteRecordRaw): void {
        this._routes.push(route)
    }

    /**
     * Merges localization texts with other texts with other modules.
     *
     * @param textsForLocales texts for the section for each locale
     */
    addI18nTexts(textsForLocales: Map<string, any>): void {
        textsForLocales.forEach((texts, locale) => {
            const textsForLocale = this._i18nTexts.get(locale)
            deepMerge(textsForLocale, texts)
        })
    }

    /**
     * Registers public service for other modules.
     *
     * @param injectionKey injection key of the service
     * @param service actual service
     */
    addPublicService<S>(injectionKey: InjectionKey<S>, service: S): void {
        this._publicServices.push([injectionKey, service])

    }

    /**
     * Adds tool window to the main lab panel.
     *
     * @param toolWindow tool window to add
     */
    addToolWindow(toolWindow: ToolWindow): void {
        if (this._toolWindows.has(toolWindow.id)) {
            throw new InitializationError(`Tool window '${toolWindow.id}' already exists.`)
        }
        this._toolWindows.set(toolWindow.id, toolWindow)
    }

    /**
     * Registers new menu root (context menus, toolbars) where a module exposes place for other modules to register their
     * actions and so on.
     *
     * @param menuRoot menu root definition
     */
    addMenuRoot(menuRoot: MenuRoot): void {
        if (this._menuRoots.has(menuRoot.id)) {
            throw new InitializationError(`Menu root '${menuRoot.id}' is already registered.`)
        }
        this._menuRoots.set(menuRoot.id, menuRoot)
        this._menus.set(menuRoot.id, [])
    }

    /**
     * Adds new menu node to a menu root as the first menu node.
     *
     * @param menuRootId menu root to add the node into
     * @param menuNode menu node to add
     */
    addFirstMenuNode(menuRootId: string, menuNode: MenuNode): void {
        const menu: MenuNode[] | undefined = this._menus.get(menuRootId)
        if (menu == undefined) {
            throw new InitializationError(`Menu '${menuRootId}' is not registered.`)
        }
        menu.unshift(menuNode)
    }

    /**
     * Adds new menu node to a menu root before another existing menu node.
     *
     * @param menuRootId menu root to add the node into
     * @param nextMenuNodeId menu node to precede
     * @param menuNode menu node to add
     */
    addBeforeMenuNode(menuRootId: string, nextMenuNodeId: string, menuNode: MenuNode): void {
        const menu: MenuNode[] | undefined = this._menus.get(menuRootId)
        if (menu == undefined) {
            throw new InitializationError(`Menu '${menuRootId}' is not registered.`)
        }
        const indexOfNextMenuNode: number = menu.findIndex(node => node.id === nextMenuNodeId)
        if (indexOfNextMenuNode === -1) {
            throw new InitializationError(`Could not find menu node '${nextMenuNodeId}' to insert '${menuNode.id}' before it.`)
        } else if (indexOfNextMenuNode === 0) {
            menu.unshift(menuNode)
        } else {
            menu.splice(indexOfNextMenuNode, 0, menuNode)
        }
    }

    /**
     * Adds new menu node to a menu root after another existing menu node.
     *
     * @param menuRootId menu root to add the node into
     * @param prevMenuNodeId menu node to follow
     * @param menuNode menu node to add
     */
    addAfterMenuNode(menuRootId: string, prevMenuNodeId: string, menuNode: MenuNode): void {
        const menu: MenuNode[] | undefined = this._menus.get(menuRootId)
        if (menu == undefined) {
            throw new InitializationError(`Menu '${menuRootId}' is not registered.`)
        }
        const indexOfPrevMenuNode: number = menu.findIndex(node => node.id === prevMenuNodeId)
        if (indexOfPrevMenuNode === -1) {
            throw new InitializationError(`Could not find menu node '${prevMenuNodeId}' to insert '${menuNode.id}' after it.`)
        } else if (indexOfPrevMenuNode === menu.length - 1) {
            menu.push(menuNode)
        } else {
            menu.splice(indexOfPrevMenuNode + 1, 0, menuNode)
        }
    }

    /**
     * Adds new menu node to a menu root as the last menu node.
     *
     * @param menuRootId menu root to add the node into
     * @param menuNode menu node to add
     */
    addLastMenuNode(menuRootId: string, menuNode: MenuNode): void {
        const menu: MenuNode[] | undefined = this._menus.get(menuRootId)
        if (menu == undefined) {
            throw new InitializationError(`Menu '${menuRootId}' is not registered.`)
        }
        menu.push(menuNode)
    }

    /**
     * Registers keyboard shortcut to command mapping.
     *
     * @param command command identifying the shortcut
     * @param baseShortcut base shortcut (also fallback)
     * @param macShortcut specific shortcut for macOS (if applicable)
     */
    addKeyboardShortcutMapping(command: string, baseShortcut: string, macShortcut?: string): void {
        if (this._keyboardShortcutMappings.has(command)) {
            throw new InitializationError(`Duplicate keyboard command '${command}'.`)
        }
        this._keyboardShortcutMappings.set(command, new KeyboardShortcut(baseShortcut, macShortcut))
    }

    /**
     * Build a final immutable lab instance and registers it into the app.
     */
    async buildAndRegister(): Promise<void> {
        const lab: Lab = this.constructLabInstance()

        await loadFonts()
        this.createAndRegisterVuePlugins()
        this.provideServicesAndConfigs(lab)
    }

    private constructLabInstance(): Lab {
        const menusWithImmutableNodes: Map<string, ImmutableList<MenuNode>> = new Map<string, Immutable.List<MenuNode>>()
        this._menus.forEach((nodes, menuRootId) => menusWithImmutableNodes.set(menuRootId, ImmutableList(nodes)))
        return new Lab(
            this._app,
            ImmutableList(this._toolWindows.values()),
            ImmutableMap(this._menuRoots),
            ImmutableMap(menusWithImmutableNodes),
            ImmutableMap(this._keyboardShortcutMappings)
        )
    }

    private createAndRegisterVuePlugins(): void {
        this._app
            .use(vuetify)
            .use(codemirror, defaultCodemirrorOptions)
            .use(toast, defaultToastOptions)
            .use(store, storeKey)
            .use(VueApexCharts)
            .use(buildI18n(this._i18nTexts))
            .use(buildRouter(this._routes))
    }

    private provideServicesAndConfigs(lab: Lab): void {
        this._app.provide(labKey, lab)
        this._publicServices.forEach(([injectionKey, service]) => this._app.provide(injectionKey, service))
    }
}
