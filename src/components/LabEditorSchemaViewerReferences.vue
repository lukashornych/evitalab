<script setup lang="ts">
import { ReferenceSchema } from '@/model/evitadb/schema'
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import LabEditorViewerReferencesItem from '@/components/LabEditorSchemaViewerReferencesItem.vue'
import LabEditorSchemaViewerPanelGroupItem from '@/components/LabEditorSchemaViewerPanelGroupItem.vue'
import LabEditorSchemaViewerPanelGroup from '@/components/LabEditorSchemaViewerPanelGroup.vue'

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
