<script setup lang="ts">
import LabEditorViewerNameVariants from './LabEditorSchemaViewerNameVariants.vue'
import LabEditorViewerContainer from './LabEditorSchemaViewerContainer.vue'
import { AssociatedDataSchema, Scalar } from '@/model/evitadb'
import { KeywordValue, Property, PropertyValue } from '@/model/properties-table'
import { SchemaViewerDataPointer } from '@/model/editor/tab/schemaViewer/SchemaViewerDataPointer'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    schema: AssociatedDataSchema
}>()

const properties: Property[] = [
    { name: t('schemaViewer.associatedDatum.label.type'), value: new PropertyValue(new KeywordValue(props.schema.type.replace(Scalar.ComplexDataObject, 'Object'))) },
    { name: t('schemaViewer.associatedDatum.label.description'), value: new PropertyValue(props.schema.description) },
    { name: t('schemaViewer.associatedDatum.label.deprecationNotice'), value: new PropertyValue(props.schema.deprecationNotice) },
    { name: t('schemaViewer.associatedDatum.label.localized'), value: new PropertyValue(props.schema.localized as boolean) },
    { name: t('schemaViewer.associatedDatum.label.nullable'), value: new PropertyValue(props.schema.nullable as boolean) }
]

</script>

<template>
    <LabEditorViewerContainer :properties="properties">
        <template #nested-details>
            <LabEditorViewerNameVariants :name-variants="schema.nameVariants" />
        </template>
    </LabEditorViewerContainer>
</template>

<style lang="scss" scoped>

</style>
