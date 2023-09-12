<script setup lang="ts">
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import LabEditorViewerAttributesItem from './LabEditorSchemaViewerAttributesItem.vue'
import LabEditorSchemaViewerContainerSection from './LabEditorSchemaViewerContainerSection.vue'
import { AttributeSchemaUnion } from '@/model/evitadb'
import LabEditorSchemaViewerContainerSectionList
    from '@/components/lab/editor/schema/LabEditorSchemaViewerContainerSectionList.vue'

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    attributes: AttributeSchemaUnion[]
}>()
</script>

<template>
    <LabEditorSchemaViewerContainerSection name="Attributes">
        <LabEditorSchemaViewerContainerSectionList>
            <template
                v-for="(attribute, index) in attributes"
                :key="attribute.name"
            >
                <LabEditorViewerAttributesItem
                    :data-pointer="dataPointer"
                    :schema="attribute"
                />
                <VDivider v-if="index < attributes.length - 1" />
            </template>
        </LabEditorSchemaViewerContainerSectionList>
    </LabEditorSchemaViewerContainerSection>
</template>

<style lang="scss" scoped>

</style>
