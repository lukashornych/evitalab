<script setup lang="ts">
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import LabEditorViewerAssociatedDataItem from '@/components/LabEditorSchemaViewerAssociatedDataItem.vue'
import LabEditorSchemaViewerPanelGroupItem from '@/components/LabEditorSchemaViewerPanelGroupItem.vue'
import LabEditorSchemaViewerPanelGroup from '@/components/LabEditorSchemaViewerPanelGroup.vue'
import { AssociatedDataSchema } from '@/model/evitadb'

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    associatedData: AssociatedDataSchema[]
}>()
</script>

<template>
    <LabEditorSchemaViewerPanelGroupItem name="Associated data">
        <LabEditorSchemaViewerPanelGroup>
            <LabEditorViewerAssociatedDataItem
                v-for="associatedDatum in associatedData"
                :key="associatedDatum.name"
                :data-pointer="dataPointer"
                :schema="associatedDatum"
            />
        </LabEditorSchemaViewerPanelGroup>
    </LabEditorSchemaViewerPanelGroupItem>
</template>

<style lang="scss" scoped>

</style>
