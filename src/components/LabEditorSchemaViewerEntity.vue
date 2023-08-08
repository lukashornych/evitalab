<script setup lang="ts">
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import { ref } from 'vue'
import { EntitySchema } from '@/model/evitadb/schema'
import LabEditorViewerNameVariants from '@/components/LabEditorSchemaViewerNameVariants.vue'
import LabEditorViewerAttributes from '@/components/LabEditorSchemaViewerAttributes.vue'
import LabEditorViewerContainer from '@/components/LabEditorSchemaViewerContainer.vue'
import LabEditorSchemaViewerAssociatedData from '@/components/LabEditorSchemaViewerAssociatedData.vue'
import LabEditorSchemaViewerReferences from '@/components/LabEditorSchemaViewerReferences.vue'

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    schema: EntitySchema
}>()

const baseProperties = ref<[string, any][]>([
    // todo lho i18n
    ['Version', props.schema.version],
    ['Description', props.schema.description],
    ['Deprecation notice', props.schema.deprecationNotice],
    ['Locales', props.schema.locales],
    ['Currencies', props.schema.currencies],
    ['Generated primary key', props.schema.withGeneratedPrimaryKey],
    ['Hierarchical', props.schema.withHierarchy],
    ['Prices', props.schema.withPrice],
    ['Indexed decimal places', props.schema.indexedPricePlaces],
    ['Evolution modes', props.schema.evolutionMode]
])
</script>

<template>
    <LabEditorViewerContainer :properties="baseProperties">
        <template #nested-details>
            <LabEditorViewerNameVariants :name-variants="schema.nameVariants" />

            <LabEditorViewerAttributes
                v-if="schema.allAttributes && schema.allAttributes.length > 0"
                :data-pointer="dataPointer"
                :attributes="schema.allAttributes"
            />

            <LabEditorSchemaViewerAssociatedData
                v-if="schema.allAssociatedData && schema.allAssociatedData.length > 0"
                :data-pointer="dataPointer"
                :associated-data="schema.allAssociatedData"
            />

            <LabEditorSchemaViewerReferences
                v-if="schema.allReferences && schema.allReferences.length > 0"
                :data-pointer="dataPointer"
                :references="schema.allReferences"
            />
        </template>
    </LabEditorViewerContainer>
</template>

<style lang="scss" scoped>

</style>
