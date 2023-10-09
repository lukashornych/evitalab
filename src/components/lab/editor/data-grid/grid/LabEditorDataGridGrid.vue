<script setup lang="ts">
/**
 * Grid with actual data for the LabEditorDataGrid component.
 */

import { Pane, Splitpanes } from 'splitpanes'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import LabEditorDataGridGridPropertyDetail from './LabEditorDataGridGridPropertyDetail.vue'
import { ref } from 'vue'
import LabEditorDataGridGridCell from '@/components/lab/editor/data-grid/grid/LabEditorDataGridGridCell.vue'
import {
    DataGridConsoleData,
    DataGridConsoleParams,
    EntityPropertyDescriptor,
    EntityPropertyType, StaticEntityProperties
} from '@/model/editor/data-grid'
import { Toaster, useToaster } from '@/services/editor/toaster'
import { QueryLanguage, UnexpectedError } from '@/model/lab'
import { EditorService, useEditorService } from '@/services/editor/editor.service'
import { DataGridRequest } from '@/model/editor/data-grid-request'
import { TabComponentProps } from '@/model/editor/editor'
import { DataGridConsoleService, useDataGridConsoleService } from '@/services/editor/data-grid-console.service'
import LabEditorDataGridGridColumnHeader
    from '@/components/lab/editor/data-grid/grid/LabEditorDataGridGridColumnHeader.vue'

const editorService: EditorService = useEditorService()
const dataGridConsoleService: DataGridConsoleService = useDataGridConsoleService()
const toaster: Toaster = useToaster()

const pageSizeOptions: any[] = [10, 25, 50, 100, 250, 500, 1000].map(it => ({ title: it.toString(10), value: it }))

const props = defineProps<{
    gridProps: TabComponentProps<DataGridConsoleParams, DataGridConsoleData>,
    entityPropertyDescriptors: EntityPropertyDescriptor[],
    dataLocale: string | undefined,
    queryLanguage: QueryLanguage,
    displayedGridHeaders: any[],
    loading: boolean,
    resultEntities: any[],
    totalResultCount: number,
    pageNumber: number,
    pageSize: number
}>()
const emit = defineEmits<{
    (e: 'gridUpdated', value: { page: number, itemsPerPage: number, sortBy: any[] }): void
}>()

const entityPropertyDescriptorIndex: Map<string, EntityPropertyDescriptor> = new Map<string, EntityPropertyDescriptor>()
props.entityPropertyDescriptors.forEach(it => entityPropertyDescriptorIndex.set(it.key.toString(), it))

const showPropertyDetail = ref<boolean>(false)
const propertyDetailDescriptor = ref<EntityPropertyDescriptor | undefined>()
const propertyDetailValue = ref<string>('')

function getPropertyDescriptor(key: string): EntityPropertyDescriptor | undefined {
    const descriptor = entityPropertyDescriptorIndex.get(key)
    if (descriptor == undefined) {
        toaster.error(new UnexpectedError(props.gridProps.params.dataPointer.connection, 'Failed to find property descriptor for key: ' + key))
    }
    return descriptor
}

function handlePropertyClicked(propertyKey: string, value: any): void {
    if (!value) {
        return
    }
    const propertyDescriptor: EntityPropertyDescriptor | undefined = getPropertyDescriptor(propertyKey)
    if (!value || (value instanceof Array && value.length === 0)){
        // do nothing with empty value
        return
    } else if (propertyDescriptor &&
        propertyDescriptor.type === EntityPropertyType.Entity &&
        propertyDescriptor.key.name === StaticEntityProperties.ParentPrimaryKey) {
        // we want to open parent entity in appropriate new grid
        editorService.createTabRequest(new DataGridRequest(
            props.gridProps.params.dataPointer.connection,
            props.gridProps.params.dataPointer.catalogName,
            props.gridProps.params.dataPointer.entityType,
            {
                dataLocale: props.dataLocale,
                queryLanguage: props.queryLanguage,
                pageNumber: props.pageNumber,
                pageSize: props.pageSize,
                filterBy: dataGridConsoleService.buildParentEntityFilterBy(props.queryLanguage, value)
            },
            true
        ))
    } else if (propertyDescriptor && propertyDescriptor.type === EntityPropertyType.References) {
        // we want references to open referenced entities in appropriate new grid for referenced collection
        editorService.createTabRequest(new DataGridRequest(
            props.gridProps.params.dataPointer.connection,
            props.gridProps.params.dataPointer.catalogName,
            propertyDescriptor.schema.referencedEntityType,
            {
                dataLocale: props.dataLocale,
                queryLanguage: props.queryLanguage,
                pageNumber: props.pageNumber,
                pageSize: props.pageSize,
                filterBy: dataGridConsoleService.buildReferencedEntityFilterBy(props.queryLanguage, value)
            },
            true
        ))
    } else {
        // for other values, show detail of the value
        propertyDetailDescriptor.value = propertyDescriptor
        propertyDetailValue.value = value
        showPropertyDetail.value = true
    }
}

function closePropertyDetail(): void {
    showPropertyDetail.value = false
    propertyDetailDescriptor.value = undefined
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
                <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
                    <tr>
                        <LabEditorDataGridGridColumnHeader
                            v-for="column in columns"
                            :key="column.key"
                            :column="column"
                            :is-sorted="isSorted"
                            :get-sort-icon="getSortIcon"
                            :toggle-sort="toggleSort"
                        />
                    </tr>
                </template>
                <template #item="{ item }">
                    <tr>
                        <LabEditorDataGridGridCell
                            v-for="(propertyValue, propertyKey) in item.columns"
                            :key="propertyKey"
                            :property-descriptor="entityPropertyDescriptorIndex.get(propertyKey as string)"
                            :data-locale="dataLocale"
                            :property-value="propertyValue"
                            @click="handlePropertyClicked(propertyKey as string, propertyValue)"
                        />
                    </tr>
                </template>
            </VDataTableServer>
        </Pane>
        <Pane
            v-if="showPropertyDetail"
            size="30"
            min-size="30"
        >
            <LabEditorDataGridGridPropertyDetail
                :model-value="showPropertyDetail"
                :property-descriptor="propertyDetailDescriptor"
                :property-value="propertyDetailValue"
                @update:model-value="closePropertyDetail"
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
        border-right: thin solid rgba(#5A5B51, 1);
    }

    & :deep(td) {
        border-right: thin solid rgba(#5A5B51, 1);
        border-bottom: thin solid rgba(#5A5B51, 1);
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