<script setup lang="ts">

import {
    DataGridDataPointer,
    EntityPropertyDescriptor,
    EntityPropertyKey,
    EntityPropertySectionSelection,
    EntityPropertyType
} from '@/model/editor/data-grid'
import LabEditorDataGridPropertySelectorSectionEmptyItem from './LabEditorDataGridPropertySelectorSectionEmptyItem.vue'

const props = defineProps<{
    title: string, // todo lho this could be deleted when i18n is implemented, we could use the property type to resolve title
    propertyType: EntityPropertyType,
    selected: EntityPropertyKey[],
    filteredProperties: EntityPropertyDescriptor[],
    properties: EntityPropertyDescriptor[],
    selection: EntityPropertySectionSelection,
    dataPointer: DataGridDataPointer
}>()
const emit = defineEmits<{
    (e: 'toggle', value: EntityPropertySectionSelection)
}>()

function resolveNewSelection() {
    if (props.selection !== EntityPropertySectionSelection.None) {
        emit('toggle', EntityPropertySectionSelection.None)
    } else {
        emit('toggle', EntityPropertySectionSelection.All)
    }
}

</script>

<template>
    <VListGroup
        v-if="properties.length > 0"
        :value="propertyType"
    >
        <template #activator="{ props }">
            <VListItem v-bind="props">
                <template v-slot:prepend>
                    <VListItemAction start>
                        <VBtn
                            icon
                            variant="text"
                            @click.stop="resolveNewSelection"
                        >
                            <VIcon
                                v-if="selection === EntityPropertySectionSelection.None"
                                class="partial-selection"
                            >
                                mdi-checkbox-blank-outline
                            </VIcon>
                            <VIcon
                                v-else-if="selection === EntityPropertySectionSelection.Some"
                                class="partial-selection"
                            >
                                mdi-minus-box
                            </VIcon>
                            <VIcon v-else-if="selection === EntityPropertySectionSelection.All">mdi-checkbox-marked</VIcon>
                        </VBtn>
                    </VListItemAction>
                </template>

                <template #title>
                    {{ title }} ({{selected.length || 0 }}/{{ properties.length }})
                </template>
            </VListItem>
        </template>

        <template v-if="filteredProperties.length > 0">
            <template
                v-for="(property, index) in filteredProperties"
                :key="property.key.toString()"
            >
                <slot :property="property" />
                <VDivider
                    v-if="index < filteredProperties.length - 1"
                    inset
                />
            </template>
        </template>
        <template v-else>
            <LabEditorDataGridPropertySelectorSectionEmptyItem />
        </template>
    </VListGroup>
</template>

<style lang="scss" scoped>
.partial-selection {
    opacity: var(--v-medium-emphasis-opacity);
}
</style>
