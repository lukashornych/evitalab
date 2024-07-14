<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Property } from '@/modules/base/model/properties-table/Property'
import { PropertyValue } from '@/modules/base/model/properties-table/PropertyValue'
import { NamingConvention } from '@/modules/connection/model/NamingConvetion'
import { Map } from 'immutable'
import SchemaContainerSection from '@/modules/schema-viewer/viewer/component/SchemaContainerSection.vue'
import VPropertiesTable from '@/modules/base/component/VPropertiesTable.vue'

const { t } = useI18n()

const props = withDefaults(defineProps<{
    prefix?: string,
    nameVariants: Map<NamingConvention, string>
}>(), {
    prefix: ''
})

const name = props.prefix
    ? t('schemaViewer.nameVariants.prefixedTitle', { prefix: props.prefix })
    : t('schemaViewer.nameVariants.title')

const properties: Property[] = [
    { name: t('schemaViewer.nameVariants.label.camelCase'), value: new PropertyValue(props.nameVariants.get(NamingConvention.CamelCase)) },
    { name: t('schemaViewer.nameVariants.label.kebabCase'), value: new PropertyValue(props.nameVariants.get(NamingConvention.KebabCase)) },
    { name: t('schemaViewer.nameVariants.label.pascalCase'), value: new PropertyValue(props.nameVariants.get(NamingConvention.PascalCase)) },
    { name: t('schemaViewer.nameVariants.label.snakeCase'), value: new PropertyValue(props.nameVariants.get(NamingConvention.SnakeCase)) },
    { name: t('schemaViewer.nameVariants.label.upperSnakeCase'), value: new PropertyValue(props.nameVariants.get(NamingConvention.UpperSnakeCase)) }
]
</script>

<template>
    <SchemaContainerSection :name="name">
        <VPropertiesTable :properties="properties"/>
    </SchemaContainerSection>
</template>

<style lang="scss" scoped>

</style>
