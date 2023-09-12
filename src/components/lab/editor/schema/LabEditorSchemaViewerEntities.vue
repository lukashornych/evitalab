<script setup lang="ts">
import { SchemaViewerDataPointer } from '@/model/editor/schema-viewer'
import LabEditorSchemaViewerEntitiesItem from './LabEditorSchemaViewerEntitiesItem.vue'
import LabEditorSchemaViewerContainerSection from './LabEditorSchemaViewerContainerSection.vue'
import { EntitySchema } from '@/model/evitadb'
import LabEditorSchemaViewerContainerSectionList
    from '@/components/lab/editor/schema/LabEditorSchemaViewerContainerSectionList.vue'

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    entities: EntitySchema[]
}>()
</script>

<template>
    <LabEditorSchemaViewerContainerSection name="Entities">
        <LabEditorSchemaViewerContainerSectionList>
            <template
                v-for="(entity, index) in entities"
                :key="entity.name"
            >
                <LabEditorSchemaViewerEntitiesItem
                    :data-pointer="dataPointer"
                    :schema="entity"
                />
                <VDivider v-if="index < entities.length - 1" />
            </template>
        </LabEditorSchemaViewerContainerSectionList>
    </LabEditorSchemaViewerContainerSection>
</template>

<style lang="scss" scoped>

</style>
