<script setup lang="ts">
/**
 * Toolbar for the LabEditorDataGrid component.
 */
import VExecuteQueryButton from '@/components/base/VExecuteQueryButton.vue'
import VTabToolbar from '@/components/base/VTabToolbar.vue'
import { computed, inject } from 'vue'
import { TabType } from '@/model/editor/share-tab-object'
import LabEditorTabShareButton from '@/components/lab/editor/tab/LabEditorTabShareButton.vue'
import { TabComponentProps } from '@/model/editor/editor'
import { DataGridData, DataGridParams } from '@/model/editor/data-grid'
import { dataLocaleKey } from '@/model/editor/data-grid'

const props = defineProps<{
    gridProps: TabComponentProps<DataGridParams, DataGridData>,
    currentData: DataGridData,
    path: string[],
    loading: boolean
}>()
const emit = defineEmits<{
    (e: 'executeQuery'): void
}>()
const dataLocale = inject(dataLocaleKey)

const flags = computed<any>(() => {
    const flags: any[] = []
    if (dataLocale?.value != undefined) {
        flags.push({
            title: dataLocale.value,
            prependIcon: 'mdi-translate',
        })
    }
    return flags
})

</script>

<template>
    <VTabToolbar
        prepend-icon="mdi-text-box-edit-outline"
        :path="path"
        :flags="flags"
    >
        <template #append>
            <LabEditorTabShareButton
                :tab-type="TabType.DataGrid"
                :tab-params="gridProps.params"
                :tab-data="currentData"
                :disabled="!gridProps.params.dataPointer.connection.preconfigured"
            />

            <VExecuteQueryButton :loading="loading" @click="emit('executeQuery')" />
        </template>

        <template #extension>
            <slot name="query" />
        </template>
    </VTabToolbar>
</template>

<style lang="scss" scoped>

</style>
