import { TabRequestComponentProps } from '@/model/editor/editor'

/**
 * Represents props of the LabEditorErrorViewer component.
 */
export interface ErrorViewerProps extends TabRequestComponentProps {
    /**
     * Short error message.
     */
    readonly message: string
    /**
     * Detailed of error.
     */
    readonly detail: string
}
