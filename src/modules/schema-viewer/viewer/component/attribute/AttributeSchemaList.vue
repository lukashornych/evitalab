<script setup lang="ts">
import LabEditorViewerAttributesItem from './LabEditorSchemaViewerAttributesItem.vue'
import LabEditorSchemaViewerContainerSection from './LabEditorSchemaViewerContainerSection.vue'
import { AttributeSchemaUnion } from '@/model/evitadb'
import LabEditorSchemaViewerContainerSectionList
    from '@/components/lab/editor/schema-viewer/LabEditorSchemaViewerContainerSectionList.vue'
import { SchemaViewerDataPointer } from '@/model/editor/tab/schemaViewer/SchemaViewerDataPointer'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    attributes: AttributeSchemaUnion[]
}>()
</script>

<template>
    <LabEditorSchemaViewerContainerSection :name="t('schemaViewer.attributes.title')">
        <LabEditorSchemaViewerContainerSectionList
            :items="attributes"
            :nameSupplier="item => item.name"
            v-slot="{ item }"
        >
            <LabEditorViewerAttributesItem
                :data-pointer="dataPointer"
                :schema="item"
            />
        </LabEditorSchemaViewerContainerSectionList>
    </LabEditorSchemaViewerContainerSection>
</template>

<style lang="scss" scoped>

</style>
