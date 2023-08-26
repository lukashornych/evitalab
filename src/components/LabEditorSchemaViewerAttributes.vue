<script setup lang="ts">
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import LabEditorViewerAttributesItem from '@/components/LabEditorSchemaViewerAttributesItem.vue'
import LabEditorSchemaViewerPanelGroupItem from '@/components/LabEditorSchemaViewerPanelGroupItem.vue'
import LabEditorSchemaViewerPanelGroup from '@/components/LabEditorSchemaViewerPanelGroup.vue'
import { AttributeSchemaUnion } from '@/model/evitadb'

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    attributes: AttributeSchemaUnion[]
}>()
</script>

<template>
    <LabEditorSchemaViewerPanelGroupItem name="Attributes">
        <LabEditorSchemaViewerPanelGroup>
            <LabEditorViewerAttributesItem
                v-for="attribute in attributes"
                :key="attribute.name"
                :data-pointer="dataPointer"
                :schema="attribute"
            />
        </LabEditorSchemaViewerPanelGroup>
    </LabEditorSchemaViewerPanelGroupItem>
</template>

<style lang="scss" scoped>

</style>
