import { Command } from '@/model/editor/keymap/Command'
import { KeyboardShortcut } from '@/model/editor/keymap/KeyboardShortcut'

const keyboardShortcutMappingIndex: Map<Command, KeyboardShortcut> = new Map()
function createKeyboardShortcutMapping(command: Command, baseShortcut: string, macShortcut?: string): void {
    keyboardShortcutMappingIndex.set(command, new KeyboardShortcut(baseShortcut, macShortcut))
}

// system

createKeyboardShortcutMapping(Command.System_Keymap, 'Ctrl+Alt+K', 'Cmd+Alt+K')

createKeyboardShortcutMapping(Command.System_Panels_ConnectionsExplorer, 'Alt+1', 'Option+1')

createKeyboardShortcutMapping(Command.System_Editor_PreviousTab, 'Ctrl+Alt+PageDown', 'Cmd+Option+PageDown')
createKeyboardShortcutMapping(Command.System_Editor_NextTab, 'Ctrl+Alt+PageUp', 'Cmd+Option+PageUp')
createKeyboardShortcutMapping(Command.System_Editor_CloseTab, 'Ctrl+Q', 'Cmd+Q')
createKeyboardShortcutMapping(Command.System_Editor_CloseAllTabs, 'Ctrl+Shift+Q', 'Cmd+Shift+Q')

// query editor

createKeyboardShortcutMapping(Command.QueryEditor_MoveLineUp, 'Alt+ArrowUp')
createKeyboardShortcutMapping(Command.QueryEditor_MoveLineDown, 'Alt+ArrowDown')
createKeyboardShortcutMapping(Command.QueryEditor_CopyLineUp, 'Shift+Alt+ArrowUp')
createKeyboardShortcutMapping(Command.QueryEditor_CopyLineDown, 'Shift+Alt+ArrowDown')
createKeyboardShortcutMapping(Command.QueryEditor_SimplifySelection, 'Escape')
createKeyboardShortcutMapping(Command.QueryEditor_SelectLine, 'Alt+l', 'Ctrl+l')
createKeyboardShortcutMapping(Command.QueryEditor_SelectParentSyntax, 'Ctrl+i', 'Cmd+i')
createKeyboardShortcutMapping(Command.QueryEditor_IndentLess, 'Ctrl+[', 'Cmd+[')
createKeyboardShortcutMapping(Command.QueryEditor_IndentMore, 'Ctrl+]', 'Cmd+]')
createKeyboardShortcutMapping(Command.QueryEditor_IndentSelection, 'Ctrl+Alt+\\', 'Cmd+Alt+\\')
createKeyboardShortcutMapping(Command.QueryEditor_DeleteLine, 'Shift+Ctrl+k', 'Shift+Cmd+k')
createKeyboardShortcutMapping(Command.QueryEditor_CursorMatchingBracket, 'Shift+Ctrl+\\', 'Shift+Cmd+\\')
createKeyboardShortcutMapping(Command.QueryEditor_ToggleComment, 'Ctrl+/', 'Cmd+/')
createKeyboardShortcutMapping(Command.QueryEditor_ToggleBlockComment, 'Shift+Alt+a')

// inline query editor

createKeyboardShortcutMapping(Command.InlineQueryEditor_OpenHistory, 'Alt+ArrowDown', 'Option+ArrowDown')

// entity grid

createKeyboardShortcutMapping(Command.EntityGrid_ExecuteQuery, 'Ctrl+Enter', 'Cmd+Enter')
createKeyboardShortcutMapping(Command.EntityGrid_ShareTab, 'Ctrl+L', 'Cmd+L')

createKeyboardShortcutMapping(Command.EntityGrid_ChangeQueryLanguage, 'Ctrl+D', 'Cmd+D')
createKeyboardShortcutMapping(Command.EntityGrid_FocusFilterInput, 'Ctrl+F', 'Cmd+F')
createKeyboardShortcutMapping(Command.EntityGrid_FocusOrderInput, 'Ctrl+G', 'Cmd+G')
createKeyboardShortcutMapping(Command.EntityGrid_ChangeDataLocale, 'Ctrl+H', 'Cmd+H')
createKeyboardShortcutMapping(Command.EntityGrid_ChangePriceType, 'Ctrl+J', 'Cmd+J')
createKeyboardShortcutMapping(Command.EntityGrid_OpenPropertySelector, 'Ctrl+P', 'Cmd+P')

createKeyboardShortcutMapping(Command.EntityGrid_PropertySelector_FindProperty, 'Ctrl+F', 'Cmd+F')

// evitaQL console

createKeyboardShortcutMapping(Command.EvitaQLConsole_ExecuteQuery, 'Ctrl+Enter', 'Cmd+Enter')
createKeyboardShortcutMapping(Command.EvitaQLConsole_ShareTab, 'Ctrl+L', 'Cmd+L')

createKeyboardShortcutMapping(Command.EvitaQLConsole_Query_SwitchToQueryEditor, 'Ctrl+1', 'Cmd+1')
createKeyboardShortcutMapping(Command.EvitaQLConsole_Query_SwitchToVariablesEditor, 'Ctrl+2', 'Cmd+2')
createKeyboardShortcutMapping(Command.EvitaQLConsole_Query_SwitchToHistory, 'Ctrl+3', 'Cmd+3')

createKeyboardShortcutMapping(Command.EvitaQLConsole_Result_SwitchToRawResultViewer, 'Ctrl+0', 'Cmd+0')
createKeyboardShortcutMapping(Command.EvitaQLConsole_Result_SwitchToResultVisualizer, 'Ctrl+9', 'Cmd+9')

// GraphQL console

createKeyboardShortcutMapping(Command.GraphQLConsole_ExecuteQuery, 'Ctrl+Enter', 'Cmd+Enter')
createKeyboardShortcutMapping(Command.GraphQLConsole_ShareTab, 'Ctrl+L', 'Cmd+L')

createKeyboardShortcutMapping(Command.GraphQLConsole_Query_SwitchToQueryEditor, 'Ctrl+1', 'Cmd+1')
createKeyboardShortcutMapping(Command.GraphQLConsole_Query_SwitchToVariablesEditor, 'Ctrl+2', 'Cmd+2')
createKeyboardShortcutMapping(Command.GraphQLConsole_Query_SwitchToHistory, 'Ctrl+3', 'Cmd+3')
createKeyboardShortcutMapping(Command.GraphQLConsole_Query_SwitchToSchemaViewer, 'Ctrl+4', 'Cmd+4')

createKeyboardShortcutMapping(Command.GraphQLConsole_Result_SwitchToRawResultViewer, 'Ctrl+0', 'Cmd+0')
createKeyboardShortcutMapping(Command.GraphQLConsole_Result_SwitchToResultVisualizer, 'Ctrl+9', 'Cmd+9')

// Schema viewer

createKeyboardShortcutMapping(Command.SchemaViewer_ShareTab, 'Ctrl+L', 'Cmd+L')

export { keyboardShortcutMappingIndex }
