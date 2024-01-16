<script setup lang="ts">

import {
    DataGridData,
    DataGridParams,
    EntityPropertyDescriptor
} from '@/model/editor/data-grid'
import LabEditorDataGridPropertyListItem from './LabEditorDataGridPropertySelectorSectionItem.vue'
import { EditorService, useEditorService } from '@/services/editor/editor.service'
import { SchemaViewerRequest } from '@/model/editor/schema-viewer-request'
import { EntitySchemaPointer } from '@/model/editor/schema-viewer'
import { TabComponentProps } from '@/model/editor/editor'

const editorService: EditorService = useEditorService()

const props = defineProps<{
    gridProps: TabComponentProps<DataGridParams, DataGridData>,
    propertyDescriptor: EntityPropertyDescriptor
}>()
const emit = defineEmits<{
    (e: 'schemaOpen'): void
}>()

function openSchema(): void {
    editorService.createTabRequest(
        SchemaViewerRequest.createNew(
            props.gridProps.params.dataPointer.connection,
            new EntitySchemaPointer(
                props.gridProps.params.dataPointer.catalogName,
                props.gridProps.params.dataPointer.entityType
            )
        )
    )
    emit('schemaOpen')
}
</script>

<template>
    <LabEditorDataGridPropertyListItem
        :value="propertyDescriptor.key"
        :title="propertyDescriptor.title"
        openable
        @schema-open="openSchema"
    />
</template>

<style lang="scss" scoped>

</style>
