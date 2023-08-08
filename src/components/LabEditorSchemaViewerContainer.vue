<script setup lang="ts">
import VPropertiesTable from '@/components/VPropertiesTable.vue'

const props = defineProps<{
    properties: [string, any][]
}>()
</script>

<template>
    <VSheet>
        <VPropertiesTable :properties="properties"/>

        <VExpansionPanels
            v-if="$slots['nested-details']"
            multiple
            class="mt-5"
        >
            <slot name="nested-details"/>
        </VExpansionPanels>
    </VSheet>
</template>

<style lang="scss" scoped>

</style>
