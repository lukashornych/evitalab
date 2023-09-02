import { useToast as baseUseToast } from 'vue-toastification'
import { ToastInterface } from 'vue-toastification/src/ts/interface'
import { ToastOptions } from 'vue-toastification/dist/types/types'
import { TYPE } from 'vue-toastification/src/ts/constants'
import { EditorService, useEditorService } from '@/services/editor/editor.service'
import { EvitaDBConnection } from '@/model/lab'
import { v4 as uuidv4 } from 'uuid'
import { LabError, UnexpectedError } from '@/model/editor/editor'
import { ErrorViewerRequest } from '@/model/editor/error-viewer-request'

/**
 * Wrapper around the toastification plugin. Provides a more convenient API for firing toast notifications
 * with built-in features specific to evitaLab needs.
 */
export class Toaster {
    readonly toast: ToastInterface
    readonly editorService: EditorService

    constructor(toast: ToastInterface, editorService: EditorService) {
        this.toast = toast
        this.editorService = editorService
    }

    success(title: string): void {
        this.toast.success(title)
    }

    info(title: string): void {
        this.toast.info(title)
    }

    warning(title: string): void {
        this.toast.warning(title)
    }

    error(error: Error) {
        if (error instanceof LabError) {
            if (error.detail === undefined) {
                this.toast.error(error.message)
            } else {
                this.toast.error(
                    error.message,
                    this.createErrorOptions(error.connection, error.message, error.detail + '\n\n' + error.stack)
                )
            }
        } else {
            this.error(new UnexpectedError(undefined, error.message))
        }
    }

    private createErrorOptions(connection: EvitaDBConnection | undefined, message: string, detail: string): ToastOptions & { type?: TYPE.ERROR } {
        const id: string = uuidv4()
        return {
            id,
            onClick: () => {
                this.editorService.createTabRequest(
                    new ErrorViewerRequest(
                        connection,
                        message,
                        detail
                    )
                )
                this.toast.dismiss(id)
            }
        }
    }
}

export function useToaster() {
    const toast: ToastInterface = baseUseToast()
    const editorService: EditorService = useEditorService()
    return new Toaster(toast, editorService)
}
