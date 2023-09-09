<script setup lang="ts">
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import LabEditorViewerReferencesItem from './LabEditorSchemaViewerReferencesItem.vue'
import LabEditorSchemaViewerPanelGroupItem from './LabEditorSchemaViewerPanelGroupItem.vue'
import LabEditorSchemaViewerPanelGroup from './LabEditorSchemaViewerPanelGroup.vue'
import { ReferenceSchema } from '@/model/evitadb'

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    references: ReferenceSchema[]
}>()
</script>

<template>
    <LabEditorSchemaViewerPanelGroupItem name="References">
        <LabEditorSchemaViewerPanelGroup>
            <LabEditorViewerReferencesItem
                v-for="reference in references"
                :key="reference.name"
                :data-pointer="dataPointer"
                :schema="reference"
            />
        </LabEditorSchemaViewerPanelGroup>
    </LabEditorSchemaViewerPanelGroupItem>
</template>

<style lang="scss" scoped>

</style>
