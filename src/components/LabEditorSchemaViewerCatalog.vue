<script setup lang="ts">
import { SchemaViewerDataPointer, SchemaViewerProps } from '@/model/editor/schema-viewer'
import { onBeforeMount, ref } from 'vue'
import {
    SchemaViewerService,
    useSchemaViewerService
} from '@/services/editor/schema-viewer.service'
import { CatalogSchema } from '@/model/evitadb/schema'
import LabEditorViewerNameVariants from '@/components/LabEditorSchemaViewerNameVariants.vue'
import LabEditorViewerAttributes from '@/components/LabEditorSchemaViewerAttributes.vue'
import LabEditorViewerContainer from '@/components/LabEditorSchemaViewerContainer.vue'
import LabEditorSchemaViewerEntities from '@/components/LabEditorSchemaViewerEntities.vue'

const catalogSchemaViewerService: SchemaViewerService = useSchemaViewerService()

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    schema: CatalogSchema
}>()

const baseProperties = ref<[string, any][]>([
    // todo lho i18n
    ['Version', props.schema.version as String],
    ['Description', props.schema.description as String]
])
</script>

<template>
    <LabEditorViewerContainer :properties="baseProperties">
        <template #nested-details>
            <LabEditorViewerNameVariants :name-variants="schema.nameVariants" />

            <LabEditorViewerAttributes
                :data-pointer="dataPointer"
                :attributes="schema.allAttributes"
            />

            <LabEditorSchemaViewerEntities
                :data-pointer="dataPointer"
                :catalog-schema="schema"
                :entities="schema.allEntitySchemas"
            />
        </template>
    </LabEditorViewerContainer>
</template>

<style lang="scss" scoped>

</style>
