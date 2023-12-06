<script setup lang="ts">

import { ComplexFlagValue, KeywordValue, Property, PropertyValue } from '@/model/properties-table'
import VMarkdown from '@/components/base/VMarkdown.vue'

const props = defineProps<{
    property: Property,
    propertyValue: PropertyValue | PropertyValue[]
}>()
</script>

<template>
    <VChipGroup
        v-if="Array.isArray(propertyValue)"
        dense
    >
        <template v-if="propertyValue.length > 0">
            <template v-for="item in propertyValue" :key="item.value.toString()">
                <VPropertyTableValue :property="property" :propertyValue="item" />
            </template>
        </template>
        <template v-else>
            <span class="text-disabled font-weight-light font-italic">
            &lt;empty&gt;
        </span>
        </template>
    </VChipGroup>

    <template v-else>
        <!-- missing actual value -->
        <span
            v-if="propertyValue.value == undefined"
            class="text-disabled font-weight-light font-italic"
        >
            &lt;empty&gt;
        </span>

        <!-- actual value is string -->
        <div v-else-if="typeof propertyValue.value === 'string'">
            <VMarkdown :source="propertyValue.value.toString()"/>
        </div>

        <!-- actual value is boolean -->
        <VCheckbox
            v-else-if="typeof propertyValue.value === 'boolean'"
            :model-value="propertyValue.value"
            disabled
            density="compact"
            hide-details
            @click="propertyValue.action?.(undefined)"
        />

        <!-- actual value is keyword -->
        <VChip
            v-else-if="propertyValue.value instanceof KeywordValue"
            :variant="propertyValue.action ? 'outlined' : 'plain'"
            dense
            @click="propertyValue.action?.(propertyValue.value.value)"
        >
            {{ propertyValue.value.value }}
        </VChip>

        <!-- actual value is complex flag -->
        <VChip
            v-else-if="propertyValue.value instanceof ComplexFlagValue"
            prepend-icon="mdi-check"
            :variant="propertyValue.action ? 'outlined' : 'plain'"
            dense
            @click="propertyValue.action?.(propertyValue.value.value)"
        >
            {{ propertyValue.value.value }}

            <VTooltip v-if="propertyValue.value.description" activator="parent">
                {{ propertyValue.value.description }}
            </VTooltip>
        </VChip>

        <!-- actual value is something else (number) -->
        <span v-else>
            {{ propertyValue.value.toString() }}
        </span>

        <!-- side note for the value -->
        <span v-if="propertyValue.note">
            <VIcon icon="mdi-alert-outline">
                <VTooltip activator="parent">
                    {{ propertyValue.note }}
                </VTooltip>
            </VIcon>
        </span>
    </template>

</template>

<style lang="scss" scoped>

</style>
