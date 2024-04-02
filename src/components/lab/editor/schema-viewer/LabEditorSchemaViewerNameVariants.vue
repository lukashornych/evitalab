<script setup lang="ts">
import LabEditorSchemaViewerContainerSection from './LabEditorSchemaViewerContainerSection.vue'
import { NameVariants } from '@/model/evitadb'
import VPropertiesTable from '@/components/base/VPropertiesTable.vue'
import { Property, PropertyValue } from '@/model/properties-table'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = withDefaults(defineProps<{
    prefix?: string,
    nameVariants: NameVariants
}>(), {
    prefix: ''
})

const name = props.prefix
    ? t('schemaViewer.nameVariants.prefixedTitle', { prefix: props.prefix })
    : t('schemaViewer.nameVariants.title')

const properties: Property[] = [
    { name: t('schemaViewer.nameVariants.label.camelCase'), value: new PropertyValue(props.nameVariants.camelCase) },
    { name: t('schemaViewer.nameVariants.label.kebabCase'), value: new PropertyValue(props.nameVariants.kebabCase) },
    { name: t('schemaViewer.nameVariants.label.pascalCase'), value: new PropertyValue(props.nameVariants.pascalCase) },
    { name: t('schemaViewer.nameVariants.label.snakeCase'), value: new PropertyValue(props.nameVariants.snakeCase) },
    { name: t('schemaViewer.nameVariants.label.upperSnakeCase'), value: new PropertyValue(props.nameVariants.upperSnakeCase) }
]
</script>

<template>
    <LabEditorSchemaViewerContainerSection :name="name">
        <VPropertiesTable :properties="properties"/>
    </LabEditorSchemaViewerContainerSection>
</template>

<style lang="scss" scoped>

</style>
