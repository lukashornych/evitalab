import { SchemaPointerDto } from '@/model/editor/tab/schemaViewer/SchemaPointerDto'

/**
 * Serializable DTO for storing {@link SchemaViewerParams} in a storage or link.
 */
export type SchemaViewerTabParamsDto = {
    readonly connectionId: string
    readonly schemaPointer: SchemaPointerDto
}
