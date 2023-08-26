<script setup lang="ts">
import VPropertiesTable from '@/components/VPropertiesTable.vue'
import LabEditorSchemaViewerPanelGroup from '@/components/LabEditorSchemaViewerPanelGroup.vue'

const props = defineProps<{
    properties: [string, any, ((item?: string) => void)?][]
}>()
</script>

<template>
    <VSheet>
        <VPropertiesTable :properties="properties"/>

        <LabEditorSchemaViewerPanelGroup
            v-if="$slots['nested-details']"
            class="mt-5"
        >
            <slot name="nested-details"/>
        </LabEditorSchemaViewerPanelGroup>
    </VSheet>
</template>

<style lang="scss" scoped>

</style>
