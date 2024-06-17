import { App, inject, InjectionKey } from 'vue'
import { ToolWindow } from '@/lab/tool-windows/ToolWindow'
import { KeyboardShortcut } from '@/model/editor/keymap/KeyboardShortcut'
import { InitializationError } from '@/model/lab'
import { Map as ImmutableMap, List as ImmutableList } from 'immutable'
import { MenuRoot } from '@/lab/menus/MenuRoot'
import { MenuNode } from '@/lab/menus/MenuNode'

/**
 * Lab injection key
 */
export const labKey: InjectionKey<Lab> = Symbol()

/**
 * Represents living evitaLab instance. Holds global configuration of entire evitaLab.
 */
export class Lab {

    protected readonly app: App

    private readonly toolWindows: ImmutableList<ToolWindow>

    private readonly menuRoots: ImmutableMap<string, MenuRoot>
    private readonly menus: ImmutableMap<string, ImmutableList<MenuNode>>

    private readonly keyboardShortcutMappings: ImmutableMap<string, KeyboardShortcut>

    constructor(app: App,
                toolWindows: ImmutableList<ToolWindow>,
                menuRoots: ImmutableMap<string, MenuRoot>,
                menus: ImmutableMap<string, ImmutableList<MenuNode>>,
                keyboardShortcutMappings: ImmutableMap<string, KeyboardShortcut>) {
        this.app = app
        this.toolWindows = toolWindows
        this.menuRoots = menuRoots
        this.menus = menus
        this.keyboardShortcutMappings = keyboardShortcutMappings
    }

    /**
     * Returns all registered tool windows
     */
    getToolWindows(): ImmutableList<ToolWindow> {
        return this.toolWindows
    }

    /**
     * Returns all registered menu nodes for specified menu root id.
     *
     * @param menuRootId id of menu root resenting menu
     */
    getMenu(menuRootId: string): ImmutableList<MenuNode> {
        if (!this.menuRoots.has(menuRootId)) {
            throw new InitializationError(`Group '${menuRootId}' doesn't exist.`)
        }
        return this.menus.get(menuRootId) || ImmutableList()
    }

    /**
     * Returns all registered keyboard shortcuts
     */
    getKeyboardShortcutMappings(): ImmutableMap<string, KeyboardShortcut> {
        return this.keyboardShortcutMappings
    }
}

/**
 * Injects lab instance
 */
export function useLab(): Lab {
    return inject(labKey) as Lab
}
