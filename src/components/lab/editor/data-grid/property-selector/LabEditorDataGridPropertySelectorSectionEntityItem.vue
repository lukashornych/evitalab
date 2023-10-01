<script setup lang="ts">

import { DataGridDataPointer, EntityPropertyDescriptor } from '@/model/editor/data-grid'
import LabEditorDataGridPropertyListItem from './LabEditorDataGridPropertySelectorSectionItem.vue'
import { EditorService, useEditorService } from '@/services/editor/editor.service'
import { SchemaViewerRequest } from '@/model/editor/schema-viewer-request'
import { EntitySchemaPointer } from '@/model/editor/schema-viewer'

const editorService: EditorService = useEditorService()

const props = defineProps<{
    dataPointer: DataGridDataPointer,
    property: EntityPropertyDescriptor
}>()
const emit = defineEmits<{
    (e: 'schemaOpen'): void
}>()

function openSchema(): void {
    editorService.createTabRequest(
        new SchemaViewerRequest(
            props.dataPointer.connection,
            new EntitySchemaPointer(
                props.dataPointer.catalogName,
                props.dataPointer.entityType
            )
        )
    )
    emit('schemaOpen')
}
</script>

<template>
    <LabEditorDataGridPropertyListItem
        :value="property.key"
        :title="property.title"
        openable
        @schema-open="openSchema"
    />
</template>

<style lang="scss" scoped>

</style>
