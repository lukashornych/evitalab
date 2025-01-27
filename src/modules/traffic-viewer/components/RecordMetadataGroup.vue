<script setup lang="ts">
import {
    defaultMetadataGroupIdentifier,
    MetadataGroup
} from '@/modules/traffic-viewer/model/TrafficRecordVisualisationDefinition'
import RecordMetadataItem from '@/modules/traffic-viewer/components/RecordMetadataItem.vue'
import { computed } from 'vue'

const props = defineProps<{
    group: MetadataGroup
}>()

const withHeader = computed<boolean>(() => props.group.identifier !== defaultMetadataGroupIdentifier)
</script>

<template>
    <div :class="['record-metadata-group', { 'record-metadata-group--with-header': withHeader }]">
        <VTooltip v-if="withHeader">
            <template #activator="{ props }">
                <span class="record-metadata-group__header" v-bind="props">
                    <VIcon>{{ group.icon }}</VIcon>
                    <span v-if="group.title != undefined">{{ group.title }}:</span>
                </span>
            </template>
            <template #default>
                {{ group.tooltip }}
            </template>
        </VTooltip>

        <div class="record-metadata-group__items">
            <RecordMetadataItem
                v-for="(metadataItem, index) in group.items"
                :key="index"
                :item="metadataItem"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.record-metadata-group {
    display: grid;
    grid-template-columns: 1fr;
    column-gap: 0.75rem;
    justify-items: start;
    align-items: center;

    &--with-header {
        grid-template-columns: auto 1fr;
    }

    &__header {
        display: flex;
        column-gap: 0.25rem;
        align-items: center;
    }

    &__items {
        // simulation of proper VChipGroup
        display: flex;
        padding: 0.25rem 0;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
}
</style>
