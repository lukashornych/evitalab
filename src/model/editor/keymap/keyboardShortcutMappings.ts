import { Command } from '@/model/editor/keymap/Command'
import { KeyboardShortcut } from '@/model/editor/keymap/KeyboardShortcut'

const keyboardShortcutMappingIndex: Map<Command, KeyboardShortcut> = new Map()
function createKeyboardShortcutMapping(command: Command, baseShortcut: string, macShortcut?: string): void {
    keyboardShortcutMappingIndex.set(command, new KeyboardShortcut(baseShortcut, macShortcut))
}

// system



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
createKeyboardShortcutMapping(Command.QueryEditor_DeleteLine, 'Shift+Del', 'Shift+Del')
createKeyboardShortcutMapping(Command.QueryEditor_CursorMatchingBracket, 'Shift+Ctrl+\\', 'Shift+Cmd+\\')
createKeyboardShortcutMapping(Command.QueryEditor_ToggleComment, 'Ctrl+/', 'Cmd+/')
createKeyboardShortcutMapping(Command.QueryEditor_ToggleBlockComment, 'Shift+Alt+a')

// inline query editor

createKeyboardShortcutMapping(Command.InlineQueryEditor_OpenHistory, 'Alt+ArrowDown', 'Cmd+ArrowDown')

// entity grid

createKeyboardShortcutMapping(Command.EntityGrid_ExecuteQuery, 'Ctrl+Enter', 'Cmd+Enter')
createKeyboardShortcutMapping(Command.EntityGrid_ShareTab, 'Ctrl+L', 'Cmd+L')

createKeyboardShortcutMapping(Command.EntityGrid_ChangeQueryLanguage, 'Ctrl+D', 'Cmd+D')
createKeyboardShortcutMapping(Command.EntityGrid_FilterBy, 'Ctrl+F', 'Cmd+F')
createKeyboardShortcutMapping(Command.EntityGrid_OrderBy, 'Ctrl+G', 'Cmd+G')
createKeyboardShortcutMapping(Command.EntityGrid_ChangeDataLocale, 'Ctrl+H', 'Cmd+U')
createKeyboardShortcutMapping(Command.EntityGrid_ChangePriceType, 'Ctrl+J', 'Cmd+I')
createKeyboardShortcutMapping(Command.EntityGrid_OpenPropertySelector, 'Ctrl+P', 'Cmd+P')

createKeyboardShortcutMapping(Command.EntityGrid_PropertySelector_FindProperty, 'Ctrl+F', 'Cmd+F')

// evitaQL console

createKeyboardShortcutMapping(Command.EvitaQLConsole_ExecuteQuery, 'Ctrl+Enter', 'Cmd+Enter')
createKeyboardShortcutMapping(Command.EvitaQLConsole_ShareTab, 'Ctrl+L', 'Cmd+L')

createKeyboardShortcutMapping(Command.EvitaQLConsole_Query_QueryEditor, 'Ctrl+1', 'Ctrl+1')
createKeyboardShortcutMapping(Command.EvitaQLConsole_Query_VariablesEditor, 'Ctrl+2', 'Ctrl+2')
createKeyboardShortcutMapping(Command.EvitaQLConsole_Query_History, 'Ctrl+3', 'Ctrl+3')

createKeyboardShortcutMapping(Command.EvitaQLConsole_Result_RawResultViewer, 'Ctrl+0', 'Ctrl+0')
createKeyboardShortcutMapping(Command.EvitaQLConsole_Result_ResultVisualizer, 'Ctrl+9', 'Ctrl+9')

// GraphQL console

createKeyboardShortcutMapping(Command.GraphQLConsole_ExecuteQuery, 'Ctrl+Enter', 'Cmd+Enter')
createKeyboardShortcutMapping(Command.GraphQLConsole_ShareTab, 'Ctrl+L', 'Cmd+L')

createKeyboardShortcutMapping(Command.GraphQLConsole_Query_QueryEditor, 'Ctrl+1', 'Ctrl+1')
createKeyboardShortcutMapping(Command.GraphQLConsole_Query_VariablesEditor, 'Ctrl+2', 'Ctrl+2')
createKeyboardShortcutMapping(Command.GraphQLConsole_Query_History, 'Ctrl+3', 'Ctrl+3')
createKeyboardShortcutMapping(Command.GraphQLConsole_Query_SchemaViewer, 'Ctrl+4', 'Ctrl+4')

createKeyboardShortcutMapping(Command.GraphQLConsole_Result_RawResultViewer, 'Ctrl+0', 'Ctrl+0')
createKeyboardShortcutMapping(Command.GraphQLConsole_Result_ResultVisualizer, 'Ctrl+9', 'Ctrl+9')

// Schema viewer

createKeyboardShortcutMapping(Command.SchemaViewer_ShareTab, 'Ctrl+L', 'Cmd+L')

export { keyboardShortcutMappingIndex }
