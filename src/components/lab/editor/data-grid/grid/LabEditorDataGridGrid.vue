<script setup lang="ts">
/**
 * Grid with actual data for the LabEditorDataGrid component.
 */

import { Pane, Splitpanes } from 'splitpanes'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import LabEditorDataGridGridPropertyDetail from './LabEditorDataGridGridPropertyDetail.vue'
import { ref } from 'vue'

const pageSizeOptions: any[] = [10, 25, 50, 100, 250, 500, 1000].map(it => ({ title: it.toString(10), value: it }))

const props = defineProps<{
    displayedGridHeaders: any[],
    loading: boolean,
    resultEntities: any[],
    totalResultCount: number,
    pageSize: number
}>()
const emit = defineEmits<{
    (e: 'gridUpdated', value: { page: number, itemsPerPage: number, sortBy: any[] }): void
}>()

const showPropertyDetail = ref<boolean>(false)
const propertyDetailName = ref<string>('')
const propertyDetailValue = ref<string>('')

function openPropertyDetail(property: string, value: string): void {
    if (!value) {
        return
    }
    propertyDetailName.value = property
    propertyDetailValue.value = value
    showPropertyDetail.value = true
}

function closePropertyDetail(): void {
    showPropertyDetail.value = false
    propertyDetailName.value = ''
    propertyDetailValue.value = ''
}
</script>

<template>
    <Splitpanes
        vertical
        class="data-grid__body"
    >
        <Pane
            size="70"
            min-size="30"
        >
            <VDataTableServer
                :headers="displayedGridHeaders"
                :loading="loading"
                :items="resultEntities"
                :items-length="totalResultCount"
                density="compact"
                fixed-header
                fixed-footer
                multi-sort
                :items-per-page="pageSize"
                :items-per-page-Options="pageSizeOptions"
                @update:options="emit('gridUpdated', $event)"
            >
                <template #item="{ item }">
                    <tr>
                        <td
                            v-for="(propertyValue, propertyName) in item.columns"
                            :key="propertyName"
                            @click="openPropertyDetail(propertyName as string, propertyValue)"
                        >
                                <span class="data-grid-cell__body">
                                    <template v-if="!propertyValue">
                                        <span class="text-disabled">&lt;null&gt;</span>
                                    </template>
                                    <template v-else>
                                        {{ propertyValue }}
                                    </template>
                                </span>
                        </td>
                    </tr>
                </template>
            </VDataTableServer>
        </Pane>
        <Pane
            v-if="showPropertyDetail"
            size="30"
        >
            <LabEditorDataGridGridPropertyDetail
                :model-value="showPropertyDetail"
                :propertyName="propertyDetailName"
                :propertyValue="propertyDetailValue"
                @update:modelValue="closePropertyDetail"
            />
        </Pane>
    </Splitpanes>
</template>

<style lang="scss" scoped>
.data-grid__body {
    // we need to force table to be stretched to a window borders
    & :deep(.v-table) {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr;
        overflow-x: auto;
    }

    & :deep(th) {
        border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
    }

    & :deep(td) {
        border-right: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
        border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
    }
}

.data-grid-cell__body {
    line-height: 2.25rem;
    overflow-x: hidden;
    overflow-y: hidden;
    display: block;
    min-width: 5rem;
    max-width: 15rem;
    height: 2.25rem;
    text-overflow: clip;
    text-wrap: nowrap;
}
</style>
