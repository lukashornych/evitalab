<script setup lang="ts">
/**
 * Renders the PropertyValue variant
 */

import { KeywordValue } from '@/modules/base/model/properties-table/KeywordValue'
import { MultiValueFlagValue } from '@/modules/base/model/properties-table/MultiValueFlagValue'
import { NotApplicableValue } from '@/modules/base/model/properties-table/NotApplicableValue'
import { RangeValue } from '@/modules/base/model/properties-table/RangeValue'
import { useI18n } from 'vue-i18n'
import { Property } from '@/modules/base/model/properties-table/Property'
import { PropertyValue } from '@/modules/base/model/properties-table/PropertyValue'
import VMarkdown from '@/modules/base/component/VMarkdown.vue'

const { t } = useI18n()

const props = defineProps<{
    property: Property,
    propertyValue: PropertyValue
}>()
</script>

<template>
    <!-- missing actual value -->
    <span
        v-if="propertyValue.value == undefined"
        class="text-disabled font-weight-light font-italic"
    >
        {{ t('common.placeholder.empty') }}
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
        class="flex-grow-0"
        @click="propertyValue.action?.(undefined)"
    />

    <!-- actual value is keyword -->
    <VChip
        v-else-if="propertyValue.value instanceof KeywordValue"
        :variant="propertyValue.action ? 'outlined' : 'plain'"
        dense
        @click="propertyValue.action?.(propertyValue.value!.value)"
    >
        {{ propertyValue.value.value }}
    </VChip>

    <!-- actual value is multi-value flag -->
    <VChip
        v-else-if="propertyValue.value instanceof MultiValueFlagValue"
        :prepend-icon="propertyValue.value.value ? 'mdi-check' : 'mdi-checkbox-blank-outline'"
        :variant="propertyValue.action ? 'outlined' : 'plain'"
        dense
        @click="propertyValue.action?.(propertyValue.value.valueSpecification)"
    >
        {{ propertyValue.value.valueSpecification }}

        <VTooltip v-if="propertyValue.value.description" activator="parent">
            {{ propertyValue.value.description }}
        </VTooltip>
    </VChip>

    <!-- actual value is not-applicable value -->
    <div v-else-if="propertyValue.value instanceof NotApplicableValue" class="d-flex align-center">
        <VCheckbox
            :model-value="false"
            disabled
            false-icon="mdi-checkbox-blank-off-outline"
            density="compact"
            hide-details
            class="flex-grow-0"
            @click="propertyValue.action?.(undefined)"
        />

        <span v-if="propertyValue.value.explanation" class="ml-2">
            <VIcon icon="mdi-information-outline" />
            <VTooltip activator="parent">
                <span>{{ propertyValue.value.explanation }}</span>
            </VTooltip>
        </span>
    </div>

    <!-- actual value is range value -->
    <div v-else-if="propertyValue.value instanceof RangeValue">
        <VChip dense>{{ propertyValue.value.toSerializable()[0] }}</VChip>
        &nbsp;-&nbsp;
        <VChip dense>{{ propertyValue.value.toSerializable()[1] }}</VChip>
    </div>

    <!-- actual value is something else (number) -->
    <span v-else>
        {{ propertyValue.value.toString() }}
    </span>

    <!-- side note for the value -->
    <div v-if="propertyValue.note">
        <span class="ml-2">
            <VIcon icon="mdi-alert-outline" color="warning" />
            <VTooltip activator="parent">
                <span>{{ propertyValue.note }}</span>
            </VTooltip>
        </span>
    </div>
</template>

<style lang="scss" scoped>

</style>
