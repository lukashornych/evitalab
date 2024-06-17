<script setup lang="ts">
import LabEditorViewerNameVariants from './LabEditorSchemaViewerNameVariants.vue'
import LabEditorViewerContainer from './LabEditorSchemaViewerContainer.vue'
import {
    AttributeSchemaUnion,
    AttributeUniquenessType,
    EntityAttributeSchema,
    GlobalAttributeSchema,
    GlobalAttributeUniquenessType
} from '@/model/evitadb'
import {
    MultiValueFlagValue,
    KeywordValue,
    Property,
    PropertyValue,
    NotApplicableValue
} from '@/model/properties-table'
import { SchemaViewerDataPointer } from '@/model/editor/tab/schemaViewer/SchemaViewerDataPointer'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    schema: AttributeSchemaUnion
}>()

const globalAttribute = 'globalUniquenessType' in props.schema
const entityAttribute = 'representative' in props.schema

const properties: Property[] = []
properties.push({ name: t('schemaViewer.attribute.label.type'), value: new PropertyValue(new KeywordValue(props.schema.type)) })
properties.push({ name: t('schemaViewer.attribute.label.description'), value: new PropertyValue(props.schema.description) })
properties.push({ name: t('schemaViewer.attribute.label.deprecationNotice'), value: new PropertyValue(props.schema.deprecationNotice) })
if (entityAttribute) properties.push({ name: t('schemaViewer.attribute.label.representative'), value: new PropertyValue((props.schema as EntityAttributeSchema).representative as boolean ) })
switch (props.schema.uniquenessType) {
    case AttributeUniquenessType.NotUnique:
        properties.push({
            name: t('schemaViewer.attribute.label.unique'),
            value: new PropertyValue(false)
        });
        break
    case AttributeUniquenessType.UniqueWithinCollection:
        properties.push({
            name: t('schemaViewer.attribute.label.unique'),
            value: new PropertyValue(new MultiValueFlagValue(
                true,
                t('schemaViewer.attribute.placeholder.uniqueWithinCollection'),
                t('schemaViewer.attribute.help.uniqueWithinCollection')
            ))
        });
        break
    case AttributeUniquenessType.UniqueWithinCollectionLocale:
        properties.push({
            name: t('schemaViewer.attribute.label.unique'),
            value: new PropertyValue(new MultiValueFlagValue(
                true,
                t('schemaViewer.attribute.placeholder.uniqueWithinLocaleOfCollection'),
                t('schemaViewer.attribute.help.uniqueWithinLocaleOfCollection')
            ))
        });
        break
}
if (globalAttribute) {
    switch ((props.schema as GlobalAttributeSchema).globalUniquenessType) {
        case GlobalAttributeUniquenessType.NotUnique:
            properties.push({
                name: t('schemaViewer.attribute.label.globallyUnique'),
                value: new PropertyValue(false)
            });
            break
        case GlobalAttributeUniquenessType.UniqueWithinCatalog:
            properties.push({
                name: t('schemaViewer.attribute.label.globallyUnique'),
                value: new PropertyValue(new MultiValueFlagValue(
                    true,
                    t('schemaViewer.attribute.placeholder.globallyUniqueWithinCatalog'),
                    t('schemaViewer.attribute.help.globallyUniqueWithinCatalog')
                ))
            });
            break
        case GlobalAttributeUniquenessType.UniqueWithinCatalogLocale:
            properties.push({
                name: t('schemaViewer.attribute.label.globallyUnique'),
                value: new PropertyValue(new MultiValueFlagValue(
                    true,
                    t('schemaViewer.attribute.placeholder.globallyUniqueWithinLocaleOfCatalog'),
                    t('schemaViewer.attribute.help.globallyUniqueWithinLocaleOfCatalog')
                ))
            });
            break
    }
}
if (props.schema.filterable) {
    properties.push({ name: t('schemaViewer.attribute.label.filterable'), value: new PropertyValue(true) })
} else if ((globalAttribute && (props.schema as GlobalAttributeSchema).globalUniquenessType != GlobalAttributeUniquenessType.NotUnique) ||
    props.schema.uniquenessType != AttributeUniquenessType.NotUnique) {
    // implicitly filterable because of unique index
    properties.push({
        name: t('schemaViewer.attribute.label.filterable'),
        value: new PropertyValue(new NotApplicableValue(t('schemaViewer.attribute.help.implicitlyFilterable')))
    })
} else {
    properties.push({ name: t('schemaViewer.attribute.label.filterable'), value: new PropertyValue(false) })
}
properties.push({ name: t('schemaViewer.attribute.label.sortable'), value: new PropertyValue(props.schema.sortable as boolean) })
properties.push({ name: t('schemaViewer.attribute.label.localized'), value: new PropertyValue(props.schema.localized as boolean) })
properties.push({ name: t('schemaViewer.attribute.label.nullable'), value: new PropertyValue(props.schema.nullable as boolean) })
properties.push({ name: t('schemaViewer.attribute.label.defaultValue'), value: new PropertyValue(props.schema.defaultValue) })
properties.push({ name: t('schemaViewer.attribute.label.indexedDecimalPlaces'), value: new PropertyValue(props.schema.indexedDecimalPlaces) })

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
