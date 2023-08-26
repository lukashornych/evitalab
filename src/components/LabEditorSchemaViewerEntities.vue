<script setup lang="ts">
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import LabEditorSchemaViewerEntitiesItem from '@/components/LabEditorSchemaViewerEntitiesItem.vue'
import LabEditorSchemaViewerPanelGroupItem from '@/components/LabEditorSchemaViewerPanelGroupItem.vue'
import LabEditorSchemaViewerPanelGroup from '@/components/LabEditorSchemaViewerPanelGroup.vue'
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
