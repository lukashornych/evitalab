<script setup lang="ts">
/**
 * Query input for the LabEditorDataGrid component.
 */

import CodemirrorOneLine from '@/components/base/CodemirrorOneLine.vue'
import { QueryLanguage } from '@/model/lab'
import { ref } from 'vue'
import LabEditorDataGridEntityPropertiesSelector
    from '@/components/lab/editor/data-grid/property-selector/LabEditorDataGridPropertySelector.vue'
import { DataGridDataPointer, EntityPropertyDescriptor, EntityPropertyKey } from '@/model/editor/data-grid'

const queryLanguages = [
    {
        title: 'EvitaQL',
        value: QueryLanguage.EvitaQL
    },
    {
        title: 'GraphQL',
        value: QueryLanguage.GraphQL
    }
]

const props = defineProps<{
    dataPointer: DataGridDataPointer,
    selectedQueryLanguage: QueryLanguage,
    filterBy: string,
    orderBy: string,
    dataLocales: string[],
    selectedDataLocale: string,
    entityProperties: EntityPropertyDescriptor[],
    selectedEntityPropertyKeys: EntityPropertyKey[]
}>()
const emit = defineEmits<{
    (e: 'executeQuery'): void
    (e: 'update:selectedQueryLanguage', value: QueryLanguage): void
    (e: 'update:filterBy', value: string): void
    (e: 'update:orderBy', value: string): void
    (e: 'update:selectedDataLocale', value: string): void
    (e: 'update:selectedEntityPropertyKeys', value: EntityPropertyKey[]): void
}>()

const showPropertiesSelect = ref<boolean>(false)
</script>

<template>
    <div class="query-input">
        <VBtn
            icon
            density="comfortable"
        >
            <VIcon>mdi-code-braces</VIcon>
            <VTooltip activator="parent">Select query language</VTooltip>

            <VMenu activator="parent">
                <VList
                    :selected="[selectedQueryLanguage]"
                    density="compact"
                    @update:selected="emit('update:selectedQueryLanguage', $event.length > 0 ? $event[0] : undefined)"
                >
                    <VListItem
                        v-for="language in queryLanguages"
                        :key="language.value"
                        :value="language.value"
                    >
                        <VListItemTitle>{{ language.title }}</VListItemTitle>
                    </VListItem>
                </VList>
            </VMenu>
        </VBtn>

        <CodemirrorOneLine
            :model-value="filterBy"
            prepend-inner-icon="mdi-filter"
            placeholder="Filter by"
            @update:model-value="emit('update:filterBy', $event)"
            @execute="emit('executeQuery')"
        />

        <CodemirrorOneLine
            :model-value="orderBy"
            prepend-inner-icon="mdi-sort"
            placeholder="Order by"
            @update:model-value="emit('update:orderBy', $event)"
            @execute="emit('executeQuery')"
        />

        <VBtn
            icon
            density="comfortable"
        >
            <VIcon>mdi-translate</VIcon>
            <VTooltip activator="parent">
                Select data locale
            </VTooltip>

            <VMenu activator="parent">
                <VList
                    :selected="[selectedDataLocale]"
                    density="compact"
                    min-width="100"
                    @update:selected="emit('update:selectedDataLocale', $event.length > 0 ? $event[0] : undefined)"
                >
                    <VListItem
                        value="none"
                    >
                        <VListItemTitle>None</VListItemTitle>
                    </VListItem>

                    <VDivider class="mt-2 mb-2" />

                    <VListItem
                        v-for="locale in dataLocales"
                        :key="locale"
                        :value="locale"
                    >
                        <VListItemTitle>{{ locale }}</VListItemTitle>
                    </VListItem>
                </VList>
            </VMenu>
        </VBtn>

        <LabEditorDataGridEntityPropertiesSelector
            v-model="showPropertiesSelect"
            :data-pointer="dataPointer"
            :properties="entityProperties"
            :selected="selectedEntityPropertyKeys"
            @update:selected="emit('update:selectedEntityPropertyKeys', $event)"
            @schema-open="showPropertiesSelect = false"
        />

        <VBtn
            icon
            density="comfortable"
            @click="showPropertiesSelect = true"
        >
            <VIcon>mdi-view-column</VIcon>
            <VTooltip activator="parent">
                Select displayed properties
            </VTooltip>
        </VBtn>
    </div>
</template>

<style lang="scss" scoped>
.query-input {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 2.25rem 0.65fr 0.35fr 2.25rem 2.25rem;
    column-gap: 0.5rem;
    margin: 0 0.5rem;
    align-items: center;
    justify-items: stretch;
}
</style>
