<script setup lang="ts">
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import LabEditorSchemaViewerEntitiesItem from './LabEditorSchemaViewerEntitiesItem.vue'
import LabEditorSchemaViewerPanelGroupItem from './LabEditorSchemaViewerPanelGroupItem.vue'
import LabEditorSchemaViewerPanelGroup from './LabEditorSchemaViewerPanelGroup.vue'
import { CatalogSchema, EntitySchema } from '@/model/evitadb'

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    catalogSchema: CatalogSchema,
    entities: EntitySchema[]
}>()
</script>

<template>
    <LabEditorSchemaViewerPanelGroupItem name="Entities">
        <LabEditorSchemaViewerPanelGroup redirecting>
            <LabEditorSchemaViewerEntitiesItem
                v-for="entity in entities"
                :key="entity.name"
                :data-pointer="dataPointer"
                :catalog-schema="catalogSchema"
                :schema="entity"
            />
        </LabEditorSchemaViewerPanelGroup>
    </LabEditorSchemaViewerPanelGroupItem>
</template>

<style lang="scss" scoped>

</style>
