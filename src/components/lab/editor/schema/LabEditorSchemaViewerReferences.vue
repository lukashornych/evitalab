<script setup lang="ts">
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import LabEditorViewerReferencesItem from './LabEditorSchemaViewerReferencesItem.vue'
import LabEditorSchemaViewerContainerSection from './LabEditorSchemaViewerContainerSection.vue'
import { ReferenceSchema } from '@/model/evitadb'
import LabEditorSchemaViewerContainerSectionList
    from '@/components/lab/editor/schema/LabEditorSchemaViewerContainerSectionList.vue'

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    references: ReferenceSchema[]
}>()
</script>

<template>
    <LabEditorSchemaViewerContainerSection name="References">
        <LabEditorSchemaViewerContainerSectionList>
            <template
                v-for="(reference, index) in references"
                :key="reference.name"
            >
                <LabEditorViewerReferencesItem
                    :data-pointer="dataPointer"
                    :schema="reference"
                />
                <VDivider v-if="index < references.length - 1" />
            </template>
        </LabEditorSchemaViewerContainerSectionList>
    </LabEditorSchemaViewerContainerSection>
</template>

<style lang="scss" scoped>

</style>
