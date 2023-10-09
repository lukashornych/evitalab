<script setup lang="ts">
/**
 * Query input for the LabEditorDataGrid component.
 */

import CodemirrorOneLine from '@/components/base/CodemirrorOneLine.vue'
import { QueryLanguage } from '@/model/lab'
import { ref } from 'vue'
import LabEditorDataGridEntityPropertiesSelector
    from '@/components/lab/editor/data-grid/property-selector/LabEditorDataGridPropertySelector.vue'
import {
    DataGridConsoleData, DataGridConsoleParams,
    EntityPropertyDescriptor,
    EntityPropertyKey
} from '@/model/editor/data-grid'
import LabEditorDataGridDataLocaleSelector
    from '@/components/lab/editor/data-grid/LabEditorDataGridDataLocaleSelector.vue'
import LabEditorDataGridQueryLanguageSelector
    from '@/components/lab/editor/data-grid/LabEditorDataGridQueryLanguageSelector.vue'
import { TabComponentProps } from '@/model/editor/editor'

const props = defineProps<{
    gridProps: TabComponentProps<DataGridConsoleParams, DataGridConsoleData>,
    selectedQueryLanguage: QueryLanguage,
    filterBy: string,
    orderBy: string,
    dataLocales: string[],
    selectedDataLocale: string | undefined,
    entityPropertyDescriptors: EntityPropertyDescriptor[],
    selectedEntityPropertyKeys: EntityPropertyKey[]
}>()
const emit = defineEmits<{
    (e: 'executeQuery'): void
    (e: 'update:selectedQueryLanguage', value: QueryLanguage | undefined): void
    (e: 'update:filterBy', value: string): void
    (e: 'update:orderBy', value: string): void
    (e: 'update:selectedDataLocale', value: string | undefined): void
    (e: 'update:selectedEntityPropertyKeys', value: EntityPropertyKey[]): void
}>()

const showPropertiesSelect = ref<boolean>(false)
</script>

<template>
    <div class="query-input">
        <LabEditorDataGridQueryLanguageSelector
            :selected="selectedQueryLanguage"
            @update:selected="emit('update:selectedQueryLanguage', $event)"
        />

        <CodemirrorOneLine
            :model-value="filterBy"
            prepend-inner-icon="mdi-filter-outline"
            placeholder="Filter by"
            @update:model-value="emit('update:filterBy', $event)"
            @execute="emit('executeQuery')"
            class="text-gray-light"
        />

        <CodemirrorOneLine
            :model-value="orderBy"
            prepend-inner-icon="mdi-sort"
            placeholder="Order by"
            @update:model-value="emit('update:orderBy', $event)"
            @execute="emit('executeQuery')"
            class="text-gray-light"
        />

        <LabEditorDataGridDataLocaleSelector
            :selected="selectedDataLocale"
            @update:selected="emit('update:selectedDataLocale', $event)"
            :data-locales="dataLocales"
        />

        <LabEditorDataGridEntityPropertiesSelector
            v-model="showPropertiesSelect"
            :grid-props="gridProps"
            :property-descriptors="entityPropertyDescriptors"
            :selected="selectedEntityPropertyKeys"
            @update:selected="emit('update:selectedEntityPropertyKeys', $event)"
            @schema-open="showPropertiesSelect = false"
        />
    </div>
</template>

<style lang="scss" scoped>
.query-input {
    width: 100%;
    height: 100%;
    min-height: 60px;
    display: grid;
    grid-template-columns: 2.25rem 0.65fr 0.35fr 2.25rem 2.25rem;
    column-gap: 0.5rem;
    margin: 0 0.5rem;
    align-items: center;
    justify-items: stretch;
}
</style>