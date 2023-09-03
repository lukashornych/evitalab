<script setup lang="ts">
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import { ref } from 'vue'
import LabEditorViewerNameVariants from '@/components/LabEditorSchemaViewerNameVariants.vue'
import LabEditorViewerAttributes from '@/components/LabEditorSchemaViewerAttributes.vue'
import LabEditorViewerContainer from '@/components/LabEditorSchemaViewerContainer.vue'
import LabEditorSchemaViewerAssociatedData from '@/components/LabEditorSchemaViewerAssociatedData.vue'
import LabEditorSchemaViewerReferences from '@/components/LabEditorSchemaViewerReferences.vue'
import { EntitySchema } from '@/model/evitadb'

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    schema: EntitySchema
}>()

const baseProperties = ref<[string, any, ((item?: string) => void)?][]>([
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
    <div class="entity-schema-viewer">
        <LabEditorViewerContainer :properties="baseProperties">
            <template #nested-details>
                <LabEditorViewerNameVariants :name-variants="schema.nameVariants" />

                <LabEditorViewerAttributes
                    v-if="schema.attributes && Object.values(schema.attributes).length > 0"
                    :data-pointer="dataPointer"
                    :attributes="Object.values(schema.attributes)"
                />

                <LabEditorSchemaViewerAssociatedData
                    v-if="schema.associatedData && Object.values(schema.associatedData).length > 0"
                    :data-pointer="dataPointer"
                    :associated-data="Object.values(schema.associatedData)"
                />

                <LabEditorSchemaViewerReferences
                    v-if="schema.references && Object.values(schema.references).length > 0"
                    :data-pointer="dataPointer"
                    :references="Object.values(schema.references)"
                />
            </template>
        </LabEditorViewerContainer>
    </div>
</template>

<style lang="scss" scoped>
.entity-schema-viewer {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 1rem;
    overflow-y: auto;
}
</style>
