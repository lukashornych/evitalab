<script setup lang="ts">
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import LabEditorSchemaViewerAttribute from './LabEditorSchemaViewerAttribute.vue'
import LabEditorSchemaViewerPanelGroupItem from './LabEditorSchemaViewerPanelGroupItem.vue'
import { AttributeSchemaUnion, GlobalAttributeSchema } from '@/model/evitadb'

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    schema: AttributeSchemaUnion
}>()

const globalAttribute = 'uniqueGlobally' in props.schema

const flags: string[] = []
if (globalAttribute && (props.schema as GlobalAttributeSchema).uniqueGlobally) {
    flags.push('unique globally')
} else if (props.schema.unique) {
    flags.push('unique')
}
if (props.schema.unique || props.schema.filterable) flags.push('filterable')
if (props.schema.sortable) flags.push('sortable')
if (props.schema.localized) flags.push('localized')

</script>

<template>
    <LabEditorSchemaViewerPanelGroupItem
        :name="schema.name"
        :deprecated="!!schema.deprecationNotice"
        :flags="flags"
    >
        <LabEditorSchemaViewerAttribute
            :data-pointer="dataPointer"
            :schema="schema"
        />
    </LabEditorSchemaViewerPanelGroupItem>
</template>

<style lang="scss" scoped>

</style>
