<script setup lang="ts">
import VPropertiesTableValue from '@/components/base/VPropertiesTableValue.vue'

import { Property } from '@/model/properties-table'

const props = withDefaults(defineProps<{
    title?: string
    properties: Property[]
}>(), {
    title: undefined
})
</script>

<template>
    <table class="properties-table">
        <caption v-if="title != undefined" class="text-high-emphasis text-left">{{ title }}</caption>
        <tr
            v-for="property in properties"
            :key="property.name"
            class="properties-table__row"
        >
            <td class="text-medium-emphasis">{{ property.name }}</td>
            <td class="d-flex align-center">
                <VPropertiesTableValue :property="property" :property-value="property.value" />
            </td>
        </tr>
    </table>
</template>

<style lang="scss" scoped>
.properties-table {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;

    &__row {
        display: inline-grid;
        grid-template-columns: 15rem 1fr;
        column-gap: 0.5rem;
        align-items: center;
    }
}
</style>
