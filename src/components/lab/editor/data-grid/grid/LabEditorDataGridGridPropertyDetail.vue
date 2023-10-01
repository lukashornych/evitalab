<script setup lang="ts">
/**
 * Shows details of an entity property (table cell content) in the LabEditorDataGridGrid component.
 */

import CodemirrorFull from '@/components/base/CodemirrorFull.vue'
import VClosableCardTitle from '@/components/base/VClosableCardTitle.vue'

const props = defineProps<{
    modelValue: boolean,
    propertyName: string,
    // propertyType: string, // todo lho pass data type from schema, we could pre-select possibly correct renderer by it
    propertyValue: string
}>()
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
    <VCard class="data-grid-cell-detail">
        <VClosableCardTitle @close="emit('update:modelValue', false)">
            {{ propertyName }}
        </VClosableCardTitle>
        <VDivider />
        <VCardText class="data-grid-cell-detail__body">
            <CodemirrorFull
                :model-value="propertyValue"
                read-only
            />
        </VCardText>
    </VCard>
</template>

<style lang="scss" scoped>
.data-grid-cell-detail {
    display: grid;
    grid-template-rows: auto auto 1fr;

    &__body {
        position: relative;
    }
}
</style>
