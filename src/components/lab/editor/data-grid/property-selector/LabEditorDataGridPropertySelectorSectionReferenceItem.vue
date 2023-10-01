<script setup lang="ts">

import { DataGridDataPointer, EntityPropertyDescriptor } from '@/model/editor/data-grid'
import { LabService, useLabService } from '@/services/lab.service'
import LabEditorDataGridPropertyListItem from './LabEditorDataGridPropertySelectorSectionItem.vue'
import { EditorService, useEditorService } from '@/services/editor/editor.service'
import { SchemaViewerRequest } from '@/model/editor/schema-viewer-request'
import { ReferenceSchemaPointer } from '@/model/editor/schema-viewer'

const labService: LabService = useLabService()
const editorService: EditorService = useEditorService()

const props = defineProps<{
    dataPointer: DataGridDataPointer,
    property: EntityPropertyDescriptor
}>()
const emit = defineEmits<{
    (e: 'schemaOpen'): void
}>()

const flags: string[] = labService.getReferenceSchemaFlags(props.property.schema)

function openSchema(): void {
    editorService.createTabRequest(
        new SchemaViewerRequest(
            props.dataPointer.connection,
            new ReferenceSchemaPointer(
                props.dataPointer.catalogName,
                props.dataPointer.entityType,
                props.property.schema.name
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
        :description="property.schema?.description"
        :flags="flags"
        openable
        @schema-open="openSchema"
    />
</template>

<style lang="scss" scoped>

</style>
