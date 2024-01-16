<script setup lang="ts">

import {
    DataGridData,
    DataGridParams,
    EntityPropertyDescriptor
} from '@/model/editor/data-grid'
import { LabService, useLabService } from '@/services/lab.service'
import LabEditorDataGridPropertySelectorSectionItem from './LabEditorDataGridPropertySelectorSectionItem.vue'
import { EditorService, useEditorService } from '@/services/editor/editor.service'
import { SchemaViewerRequest } from '@/model/editor/schema-viewer-request'
import { EntityAttributeSchemaPointer } from '@/model/editor/schema-viewer'
import { TabComponentProps } from '@/model/editor/editor'

const labService: LabService = useLabService()
const editorService: EditorService = useEditorService()

const props = defineProps<{
    gridProps: TabComponentProps<DataGridParams, DataGridData>,
    propertyDescriptor: EntityPropertyDescriptor
}>()
const emit = defineEmits<{
    (e: 'schemaOpen'): void
}>()

const flags: string[] = labService.getAttributeSchemaFlags(props.propertyDescriptor.schema)

function openSchema(): void {
    editorService.createTabRequest(
        SchemaViewerRequest.createNew(
            props.gridProps.params.dataPointer.connection,
            new EntityAttributeSchemaPointer(
                props.gridProps.params.dataPointer.catalogName,
                props.gridProps.params.dataPointer.entityType,
                props.propertyDescriptor.schema.name
            )
        )
    )
    emit('schemaOpen')
}
</script>

<template>
    <LabEditorDataGridPropertySelectorSectionItem
        :value="propertyDescriptor.key"
        :title="propertyDescriptor.title"
        :description="propertyDescriptor.schema?.description"
        :flags="flags"
        openable
        @schema-open="openSchema"
    />
</template>

<style lang="scss" scoped>

</style>
