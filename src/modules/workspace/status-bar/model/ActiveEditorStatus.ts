import Immutable from 'immutable'

/**
 * Hold status info about active editor, i.e. editor which is being written in.
 */
export class ActiveEditorStatus {
    readonly language: string
    readonly tabSize: number
    selections: Immutable.List<EditorSelection>

    constructor(language: string, tabSize: number) {
        this.language = language
        this.tabSize = tabSize
        this.selections = Immutable.List()
    }
}

/**
 * Defines a single text selection in an active editor
 */
export class EditorSelection {
    readonly line: number
    readonly column: number
    readonly selectedCharacterCount: number
    readonly lineBreaks: number

    constructor(line: number, headPositionInLine: number, selectedCharacterCount: number, lineBreaks: number) {
        this.line = line
        this.column = headPositionInLine
        this.selectedCharacterCount = selectedCharacterCount
        this.lineBreaks = lineBreaks
    }
}
