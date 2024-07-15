<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { SchemaViewerDataPointer } from '@/modules/schema-viewer/viewer/model/SchemaViewerDataPointer'
import { EntitySchema } from '@/modules/connection/model/schema/EntitySchema'
import { Property } from '@/modules/base/model/properties-table/Property'
import { PropertyValue } from '@/modules/base/model/properties-table/PropertyValue'
import { KeywordValue } from '@/modules/base/model/properties-table/KeywordValue'
import { List } from 'immutable'
import AttributeSchemaList from '@/modules/schema-viewer/viewer/component/attribute/AttributeSchemaList.vue'
import NameVariants from '@/modules/schema-viewer/viewer/component/NameVariants.vue'
import SchemaContainer from '@/modules/schema-viewer/viewer/component/SchemaContainer.vue'
import AssociatedDataSchemaList
    from '@/modules/schema-viewer/viewer/component/associated-data/AssociatedDataSchemaList.vue'
import ReferenceSchemaList from '@/modules/schema-viewer/viewer/component/reference/ReferenceSchemaList.vue'

const { t } = useI18n()

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    schema: EntitySchema
}>()

const baseProperties = ref<Property[]>([
    { name: t('schemaViewer.entity.label.version'), value: new PropertyValue(props.schema.version.getIfSupported()!) },
    { name: t('schemaViewer.entity.label.description'), value: new PropertyValue(props.schema.description.getIfSupported()!) },
    { name: t('schemaViewer.entity.label.deprecationNotice'), value: new PropertyValue(props.schema.deprecationNotice.getIfSupported()!) },
    { name: t('schemaViewer.entity.label.locales'), value: props.schema.locales.getOrElse(List()).map(locale => new PropertyValue(new KeywordValue(locale))) },
    { name: t('schemaViewer.entity.label.currencies'), value: List(props.schema.currencies.getIfSupported()!.values()).map(currency => new PropertyValue(new KeywordValue(currency))) },
    { name: t('schemaViewer.entity.label.generatedPrimaryKey'), value: new PropertyValue(props.schema.withGeneratedPrimaryKey.getOrElse(false)) },
    { name: t('schemaViewer.entity.label.hierarchical'), value: new PropertyValue(props.schema.withHierarchy.getOrElse(false)) },
    { name: t('schemaViewer.entity.label.prices'), value: new PropertyValue(props.schema.withPrice.getOrElse(false)) },
    { name: t('schemaViewer.entity.label.indexedDecimalPlaces'), value: new PropertyValue(props.schema.indexedPricePlaces.getIfSupported()!) },
    // todo lho i18n for items
    { name: t('schemaViewer.entity.label.evolutionModes'), value: props.schema.evolutionMode.getOrElse(List()).map(mode => new PropertyValue(new KeywordValue(mode))) }
])
</script>

<template>
    <SchemaContainer :properties="baseProperties">
        <template #nested-details>
            <NameVariants :name-variants="schema.nameVariants.getIfSupported()!" />

            <AttributeSchemaList
                v-if="schema.attributes.isSupported() && schema.attributes.getIfSupported()!.size > 0"
                :data-pointer="dataPointer"
                :attributes="List(schema.attributes.getIfSupported()!.values())"
            />

            <AssociatedDataSchemaList
                v-if="schema.associatedData.isSupported() && schema.associatedData.getIfSupported()!.size > 0"
                :data-pointer="dataPointer"
                :associated-data="List(schema.associatedData.getIfSupported()!.values())"
            />

            <ReferenceSchemaList
                v-if="schema.references.isSupported() && schema.references.getIfSupported()!.size > 0"
                :data-pointer="dataPointer"
                :references="List(schema.references.getIfSupported()!.values())"
            />
        </template>
    </SchemaContainer>
</template>

<style lang="scss" scoped>

</style>
