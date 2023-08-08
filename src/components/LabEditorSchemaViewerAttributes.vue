<script setup lang="ts">
import { AttributeSchemaUnion } from '@/model/evitadb/schema'
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import LabEditorViewerAttributesItem from '@/components/LabEditorSchemaViewerAttributesItem.vue'

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    attributes: AttributeSchemaUnion[]
}>()
</script>

<template>
    <VExpansionPanel title="Attributes">
        <VExpansionPanelText>
            <VExpansionPanels multiple>
                <LabEditorViewerAttributesItem
                    v-for="attribute in attributes"
                    :key="attribute.name"
                    :data-pointer="dataPointer"
                    :schema="attribute"
                />
            </VExpansionPanels>
        </VExpansionPanelText>
    </VExpansionPanel>
</template>

<style lang="scss" scoped>

</style>
