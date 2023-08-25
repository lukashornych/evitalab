<script setup lang="ts">
import { EntitySchemaPointer, SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import { EditorService, useEditorService } from '@/services/editor/editor.service'
import { SchemaViewerRequest } from '@/model/editor/schema-viewer-request'
import LabEditorSchemaViewerPanelGroupItem from '@/components/LabEditorSchemaViewerPanelGroupItem.vue'
import { CatalogSchema, EntitySchema } from '@/model/evitadb'

const editorService: EditorService = useEditorService()

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    catalogSchema: CatalogSchema,
    schema: EntitySchema
}>()

const flags: string[] = []
if (props.schema.withHierarchy) flags.push('hierarchical')

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
    <LabEditorSchemaViewerPanelGroupItem
        :name="schema.name"
        :deprecated="!!schema.deprecationNotice"
        :flags="flags"
        @open="openEntitySchema"
    />
</template>

<style lang="scss" scoped>

</style>
