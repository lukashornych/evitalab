<script setup lang="ts">
import { CatalogSchema, EntitySchema } from '@/model/evitadb/schema'
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import LabEditorSchemaViewerEntitiesItem from '@/components/LabEditorSchemaViewerEntitiesItem.vue'
import { ref, watch } from 'vue'

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    catalogSchema: CatalogSchema,
    entities: EntitySchema[]
}>()

const openedEntities = ref<string[]>([])
watch(openedEntities, (newVal) => {
    if (newVal.length === 0) {
        return
    }
    openedEntities.value = []
})
</script>

<template>
    <VExpansionPanel title="Entities">
        <VExpansionPanelText>
            <VExpansionPanels v-model="openedEntities">
                <LabEditorSchemaViewerEntitiesItem
                    v-for="entity in entities"
                    :key="entity.name"
                    :data-pointer="dataPointer"
                    :catalog-schema="catalogSchema"
                    :schema="entity"
                />
            </VExpansionPanels>
        </VExpansionPanelText>
    </VExpansionPanel>
</template>

<style lang="scss" scoped>

</style>
