<script setup lang="ts">
import { CatalogSchema, EntitySchema } from '@/model/evitadb/schema'
import { EntitySchemaPointer, SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import { EditorService, useEditorService } from '@/services/editor/editor.service'
import { SchemaViewerRequest } from '@/model/editor/schema-viewer-request'

const editorService: EditorService = useEditorService()

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    catalogSchema: CatalogSchema,
    schema: EntitySchema
}>()

function openEntitySchema(): void {
    editorService.createTabRequest(new SchemaViewerRequest(
        props.dataPointer.connection,
        new EntitySchemaPointer(
            props.catalogSchema.name,
            props.schema.name
        )
    ))
}
</script>

<template>
    <VExpansionPanel @click.stop="openEntitySchema">
        <VExpansionPanelTitle expand-icon="mdi-open-in-new">
            <span :class="['mr-5', { 'text-decoration-line-through': schema.deprecationNotice }]">
                {{ schema.name }}
            </span>
        </VExpansionPanelTitle>
    </VExpansionPanel>
</template>

<style lang="scss" scoped>

</style>
