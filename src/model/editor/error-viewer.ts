import { TabRequestComponentProps } from '@/model/editor/editor'
import { LabError } from '@/model/lab'

/**
 * Represents props of the LabEditorErrorViewer component.
 */
export interface ErrorViewerProps extends TabRequestComponentProps {
    /**
     * Short error message.
     */
    readonly error: LabError
}
