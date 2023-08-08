<script setup lang="ts">
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import { ref } from 'vue'
import { CatalogSchema } from '@/model/evitadb/schema'
import LabEditorViewerNameVariants from '@/components/LabEditorSchemaViewerNameVariants.vue'
import LabEditorViewerAttributes from '@/components/LabEditorSchemaViewerAttributes.vue'
import LabEditorViewerContainer from '@/components/LabEditorSchemaViewerContainer.vue'
import LabEditorSchemaViewerEntities from '@/components/LabEditorSchemaViewerEntities.vue'

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    schema: CatalogSchema
}>()

const baseProperties = ref<[string, any][]>([
    // todo lho i18n
    ['Version', props.schema.version],
    ['Description', props.schema.description]
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

            <LabEditorSchemaViewerEntities
                v-if="schema.allEntitySchemas && schema.allEntitySchemas.length > 0"
                :data-pointer="dataPointer"
                :catalog-schema="schema"
                :entities="schema.allEntitySchemas"
            />
        </template>
    </LabEditorViewerContainer>
</template>

<style lang="scss" scoped>

</style>
