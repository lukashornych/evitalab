<script setup lang="ts">
import { ref } from 'vue'
import LabEditorViewerNameVariants from './LabEditorSchemaViewerNameVariants.vue'
import LabEditorViewerAttributes from './LabEditorSchemaViewerAttributes.vue'
import LabEditorViewerContainer from './LabEditorSchemaViewerContainer.vue'
import LabEditorSchemaViewerAssociatedData from './LabEditorSchemaViewerAssociatedData.vue'
import LabEditorSchemaViewerReferences from './LabEditorSchemaViewerReferences.vue'
import { EntitySchema } from '@/model/evitadb'
import { KeywordValue, Property, PropertyValue } from '@/model/properties-table'
import { SchemaViewerDataPointer } from '@/model/editor/tab/schemaViewer/SchemaViewerDataPointer'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    schema: EntitySchema
}>()

const baseProperties = ref<Property[]>([
    { name: t('schemaViewer.entity.label.version'), value: new PropertyValue(props.schema.version) },
    { name: t('schemaViewer.entity.label.description'), value: new PropertyValue(props.schema.description) },
    { name: t('schemaViewer.entity.label.deprecationNotice'), value: new PropertyValue(props.schema.deprecationNotice) },
    { name: t('schemaViewer.entity.label.locales'), value: props.schema.locales.map(locale => new PropertyValue(new KeywordValue(locale))) },
    { name: t('schemaViewer.entity.label.currencies'), value: props.schema.currencies.map(currency => new PropertyValue(new KeywordValue(currency))) },
    { name: t('schemaViewer.entity.label.generatedPrimaryKey'), value: new PropertyValue(props.schema.withGeneratedPrimaryKey) },
    { name: t('schemaViewer.entity.label.hierarchical'), value: new PropertyValue(props.schema.withHierarchy) },
    { name: t('schemaViewer.entity.label.prices'), value: new PropertyValue(props.schema.withPrice) },
    { name: t('schemaViewer.entity.label.indexedDecimalPlaces'), value: new PropertyValue(props.schema.indexedPricePlaces) },
    { name: t('schemaViewer.entity.label.evolutionModes'), value: props.schema.evolutionMode.map(mode => new PropertyValue(new KeywordValue(mode))) }
])
</script>

<template>
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
</template>

<style lang="scss" scoped>

</style>
