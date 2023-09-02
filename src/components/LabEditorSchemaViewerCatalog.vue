<script setup lang="ts">
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import { ref } from 'vue'
import LabEditorViewerNameVariants from '@/components/LabEditorSchemaViewerNameVariants.vue'
import LabEditorViewerAttributes from '@/components/LabEditorSchemaViewerAttributes.vue'
import LabEditorViewerContainer from '@/components/LabEditorSchemaViewerContainer.vue'
import LabEditorSchemaViewerEntities from '@/components/LabEditorSchemaViewerEntities.vue'
import { CatalogSchema } from '@/model/evitadb'

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    schema: CatalogSchema
}>()

const baseProperties = ref<[string, any, ((item?: string) => void)?][]>([
    // todo lho i18n
    ['Version', props.schema.version],
    ['Description', props.schema.description]
])
</script>

<template>
    <div class="catalog-schema-viewer">
        <LabEditorViewerContainer :properties="baseProperties">
            <template #nested-details>
                <LabEditorViewerNameVariants :name-variants="schema.nameVariants" />

                <LabEditorViewerAttributes
                    v-if="schema.attributes && Object.values(schema.attributes).length > 0"
                    :data-pointer="dataPointer"
                    :attributes="Object.values(schema.attributes)"
                />

                <LabEditorSchemaViewerEntities
                    v-if="schema.entitySchemas && Object.values(schema.entitySchemas).length > 0"
                    :data-pointer="dataPointer"
                    :catalog-schema="schema"
                    :entities="Object.values(schema.entitySchemas)"
                />
            </template>
        </LabEditorViewerContainer>
    </div>
</template>

<style lang="scss" scoped>
.catalog-schema-viewer {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 1rem;
    overflow-y: auto;
}
</style>
