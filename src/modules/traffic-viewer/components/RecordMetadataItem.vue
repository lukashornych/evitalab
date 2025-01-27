<script setup lang="ts">

import { MetadataItem, MetadataItemSeverity } from '@/modules/traffic-viewer/model/TrafficRecordVisualisationDefinition'

const props = defineProps<{
    item: MetadataItem
}>()
</script>

<template>
    <VTooltip>
        <template #activator="{ props }">
            <VChip
                :prepend-icon="item.icon"
                :color="item.severity !== MetadataItemSeverity.Info ? item.severity : undefined"
                v-bind="props"
            >
                <span>{{ item.value }}</span>
                <span v-if="item.details != undefined" class="text-disabled ml-1">{{ item.details }}</span>
            </VChip>
        </template>

        <template #default>
            {{ item.tooltip }}
        </template>
    </VTooltip>
</template>

<style lang="scss" scoped>

</style>
