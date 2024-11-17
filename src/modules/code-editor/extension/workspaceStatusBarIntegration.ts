import { EditorView } from 'codemirror'
import { AnnotationType, Extension, Line, StateField, Annotation, EditorState } from '@codemirror/state'
import Immutable from 'immutable'
import { language, Language } from '@codemirror/language'
import { jsonLanguage } from '@codemirror/lang-json'
import { evitaQLQueryLanguage, evitaQLConstraintListLanguage } from '@lukashornych/codemirror-lang-evitaql'
import { graphqlLanguage } from 'cm6-graphql'
import { xmlLanguage } from '@codemirror/lang-xml'
import { yamlLanguage } from '@codemirror/lang-yaml'
import { WorkspaceService } from '@/modules/workspace/service/WorkspaceService'
import { EditorSelection } from '@/modules/workspace/status-bar/model/editor-status/EditorSelection'

/**
 * Resolves editor language. It is kind of a hack because CodeMirror doesn't
 * provide way to name language extensions.
 */
function resolveLanguageCode(view: EditorView): string {
    const currentLanguage: Language | null = view.state.facet(language)
    let languageCode: string = 'plain'
    if (currentLanguage === jsonLanguage) {
        languageCode = 'JSON'
    } else if (currentLanguage === yamlLanguage) {
        languageCode = 'YAML'
    } else if (currentLanguage === xmlLanguage) {
        languageCode = 'XML'
    } else if (currentLanguage === evitaQLQueryLanguage) {
        languageCode = 'evitaQL'
    } else if (currentLanguage === evitaQLConstraintListLanguage) {
        languageCode = 'evitaQL (constraint mode)'
    } else if (currentLanguage === graphqlLanguage) {
        languageCode = 'GraphQL'
    }
    return languageCode
}

/**
 * Integration of global workspace status bar for an editor. It injects
 * info into the global workspace status bar if the editor is active.
 *
 * @param workspaceService workspace service instance to access status bar API
 */
export function workspaceStatusBarIntegration(workspaceService: WorkspaceService): Extension[] {
    const activationAnnotation: AnnotationType<boolean> = Annotation.define<boolean>()

    const activatedField: StateField<boolean> = StateField.define({
        create() { return false },
        update(value, tr) {
            const activation: boolean | undefined = tr.annotation<boolean>(activationAnnotation)
            if (activation != undefined) {
                return activation
            } else {
                return value
            }
        }
    })

    const lifecycleHandler: Extension = EditorView.domEventObservers({
        focus(event, view) {
            if (!view.state.field(activatedField)) {
                workspaceService.activateEditorStatus(
                    resolveLanguageCode(view),
                    view.state.facet(EditorState.tabSize)
                )
                view.dispatch({
                    annotations: activationAnnotation.of(true)
                })
            }
        },
        blur(event, view) {
            if (view.state.field(activatedField)) {
                workspaceService.deactivateEditorStatus()
                view.dispatch({
                    annotations: activationAnnotation.of(false)
                })
            }
        }
    })

    const updatePropagator: Extension = EditorView.updateListener.of((update) => {
        const newSelections: EditorSelection[] = update.state.selection.ranges.map(range => {
            const headLine: Line = update.state.doc.lineAt(range.head)
            const anchorLine: Line = update.state.doc.lineAt(range.anchor)
            const headPositionInLine: number = range.head - headLine.from + 1
            const selectedCharacterCount: number = Math.abs(range.anchor - range.head)
            const lineBreaks: number =  Math.abs(anchorLine.number - headLine.number)

            return new EditorSelection(
                headLine.number,
                headPositionInLine,
                selectedCharacterCount,
                lineBreaks
            )
        })

        if (update.state.field(activatedField)) {
            workspaceService.updateEditorStatus(Immutable.List(newSelections))
        }
    })

    return [
        activatedField,
        lifecycleHandler,
        updatePropagator
    ]
}
