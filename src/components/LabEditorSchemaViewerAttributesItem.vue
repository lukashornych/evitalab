<script setup lang="ts">
import { AttributeSchemaUnion, GlobalAttributeSchema } from '@/model/evitadb/schema'
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import LabEditorSchemaViewerAttribute from '@/components/LabEditorSchemaViewerAttribute.vue'

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
    <VExpansionPanel>
        <VExpansionPanelTitle>
            <span :class="['mr-5', { 'text-decoration-line-through': schema.deprecationNotice }]">
                {{ schema.name }}
            </span>

            <VChipGroup>
                <VChip
                    v-for="flag in flags"
                    :key="flag"
                >
                    {{ flag }}
                </VChip>
            </VChipGroup>
        </VExpansionPanelTitle>

        <VExpansionPanelText>
            <LabEditorSchemaViewerAttribute
                :data-pointer="dataPointer"
                :schema="schema"
            />
        </VExpansionPanelText>
    </VExpansionPanel>
</template>

<style lang="scss" scoped>

</style>
