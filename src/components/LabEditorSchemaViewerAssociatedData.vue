<script setup lang="ts">
import { AssociatedDataSchema } from '@/model/evitadb/schema'
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import LabEditorViewerAssociatedDataItem from '@/components/LabEditorSchemaViewerAssociatedDataItem'
import LabEditorSchemaViewerPanelGroupItem from '@/components/LabEditorSchemaViewerPanelGroupItem.vue'
import LabEditorSchemaViewerPanelGroup from '@/components/LabEditorSchemaViewerPanelGroup.vue'

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
