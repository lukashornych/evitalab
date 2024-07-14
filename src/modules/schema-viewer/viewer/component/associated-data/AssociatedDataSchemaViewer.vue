<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { SchemaViewerDataPointer } from '@/modules/schema-viewer/viewer/model/SchemaViewerDataPointer'
import { AssociatedDataSchema } from '@/modules/connection/model/schema/AssociatedDataSchema'
import { Property } from '@/modules/base/model/properties-table/Property'
import { PropertyValue } from '@/modules/base/model/properties-table/PropertyValue'
import { KeywordValue } from '@/modules/base/model/properties-table/KeywordValue'
import { Scalar } from '@/modules/connection/driver/2024_8/model/model'
import SchemaContainer from '@/modules/schema-viewer/viewer/component/SchemaContainer.vue'
import NameVariants from '@/modules/schema-viewer/viewer/component/NameVariants.vue'

const { t } = useI18n()

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    schema: AssociatedDataSchema
}>()

const properties: Property[] = [
    { name: t('schemaViewer.associatedDatum.label.type'), value: new PropertyValue(new KeywordValue(props.schema.type.getIfSupported()!.replace(Scalar.ComplexDataObject, 'Object'))) },
    { name: t('schemaViewer.associatedDatum.label.description'), value: new PropertyValue(props.schema.description.getIfSupported()!) },
    { name: t('schemaViewer.associatedDatum.label.deprecationNotice'), value: new PropertyValue(props.schema.deprecationNotice.getIfSupported()!) },
    { name: t('schemaViewer.associatedDatum.label.localized'), value: new PropertyValue(props.schema.localized.getOrElse(false)) },
    { name: t('schemaViewer.associatedDatum.label.nullable'), value: new PropertyValue(props.schema.nullable.getOrElse(false)) }
]

</script>

<template>
    <SchemaContainer :properties="properties">
        <template #nested-details>
            <NameVariants :name-variants="schema.nameVariants.getIfSupported()!" />
        </template>
    </SchemaContainer>
</template>

<style lang="scss" scoped>

</style>
