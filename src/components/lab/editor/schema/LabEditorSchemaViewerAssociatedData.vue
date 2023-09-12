<script setup lang="ts">
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import LabEditorViewerAssociatedDataItem from './LabEditorSchemaViewerAssociatedDataItem.vue'
import LabEditorSchemaViewerContainerSection from './LabEditorSchemaViewerContainerSection.vue'
import { AssociatedDataSchema } from '@/model/evitadb'
import LabEditorSchemaViewerContainerSectionList
    from '@/components/lab/editor/schema/LabEditorSchemaViewerContainerSectionList.vue'

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    associatedData: AssociatedDataSchema[]
}>()
</script>

<template>
    <LabEditorSchemaViewerContainerSection name="Associated data">
        <LabEditorSchemaViewerContainerSectionList>
            <template
                v-for="(associatedDatum, index) in associatedData"
                :key="associatedDatum.name"
            >
                <LabEditorViewerAssociatedDataItem
                    :data-pointer="dataPointer"
                    :schema="associatedDatum"
                />
                <VDivider v-if="index < associatedData.length - 1" />
            </template>
        </LabEditorSchemaViewerContainerSectionList>
    </LabEditorSchemaViewerContainerSection>
</template>

<style lang="scss" scoped>

</style>
