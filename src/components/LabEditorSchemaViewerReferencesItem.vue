<script setup lang="ts">
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import LabEditorSchemaViewerReference from '@/components/LabEditorSchemaViewerReference.vue'
import LabEditorSchemaViewerPanelGroupItem from '@/components/LabEditorSchemaViewerPanelGroupItem.vue'
import { ReferenceSchema } from '@/model/evitadb'

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    schema: ReferenceSchema
}>()

const flags: string[] = []
if (!props.schema.referencedEntityTypeManaged) flags.push('external')
if (props.schema.indexed) flags.push('indexed')
if (props.schema.faceted) flags.push('faceted')

</script>

<template>
    <LabEditorSchemaViewerPanelGroupItem
        :name="schema.name"
        :deprecated="!!schema.deprecationNotice"
        :flags="flags"
    >
        <LabEditorSchemaViewerReference
            :data-pointer="dataPointer"
            :schema="schema"
        />
    </LabEditorSchemaViewerPanelGroupItem>
</template>

<style lang="scss" scoped>

</style>
