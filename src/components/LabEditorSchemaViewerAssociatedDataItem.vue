<script setup lang="ts">
import { AssociatedDataSchema } from '@/model/evitadb/schema'
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import LabEditorSchemaViewerAssociatedDatum from '@/components/LabEditorSchemaViewerAssociatedDatum.vue'
import LabEditorSchemaViewerPanelGroupItem from '@/components/LabEditorSchemaViewerPanelGroupItem.vue'

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    schema: AssociatedDataSchema
}>()

const flags: string[] = []
if (props.schema.localized) flags.push('localized')

</script>

<template>
    <LabEditorSchemaViewerPanelGroupItem
        :name="schema.name"
        :deprecated="!!schema.deprecationNotice"
        :flags="flags"
    >
        <LabEditorSchemaViewerAssociatedDatum
            :data-pointer="dataPointer"
            :schema="schema"
        />
    </LabEditorSchemaViewerPanelGroupItem>
</template>

<style lang="scss" scoped>

</style>
