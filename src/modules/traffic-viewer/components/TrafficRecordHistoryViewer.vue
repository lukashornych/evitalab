<script setup lang="ts">

import VTabToolbar from '@/modules/base/component/VTabToolbar.vue'
import {
    TrafficRecordHistoryViewerTabDefinition
} from '@/modules/traffic-viewer/model/TrafficRecordHistoryViewerTabDefinition'
import { TabType } from '@/modules/workspace/tab/model/TabType'
import ShareTabButton from '@/modules/workspace/tab/component/ShareTabButton.vue'
import { TabComponentProps } from '@/modules/workspace/tab/model/TabComponentProps'
import { TrafficRecordHistoryViewerTabParams } from '@/modules/traffic-viewer/model/TrafficRecordHistoryViewerTabParams'
import { TrafficRecordHistoryViewerTabData } from '@/modules/traffic-viewer/model/TrafficRecordHistoryViewerTabData'
import { TabComponentEvents } from '@/modules/workspace/tab/model/TabComponentEvents'
import { TabComponentExpose } from '@/modules/workspace/tab/model/TabComponentExpose'
import { SubjectPath } from '@/modules/workspace/status-bar/model/subject-path-status/SubjectPath'
import {
    ConnectionSubjectPath
} from '@/modules/connection/workspace/status-bar/model/subject-path-status/ConnectionSubjectPath'
import { SubjectPathItem } from '@/modules/workspace/status-bar/model/subject-path-status/SubjectPathItem'
import { useI18n } from 'vue-i18n'
import { computed, onBeforeMount, onMounted, onUnmounted, ref, watch } from 'vue'
import { List } from 'immutable'
import { Command } from '@/modules/keymap/model/Command'
import { Keymap, useKeymap } from '@/modules/keymap/service/Keymap'
import RecordHistoryList from '@/modules/traffic-viewer/components/RecordHistoryList.vue'
import { TrafficRecordHistoryCriteria } from '@/modules/traffic-viewer/model/TrafficRecordHistoryCriteria'
import RecordHistoryFilter from '@/modules/traffic-viewer/components/RecordHistoryFilter.vue'

const keymap: Keymap = useKeymap()
const { t } = useI18n()

const props = defineProps<TabComponentProps<TrafficRecordHistoryViewerTabParams, TrafficRecordHistoryViewerTabData>>()
const emit = defineEmits<TabComponentEvents>()
defineExpose<TabComponentExpose>({
    path(): SubjectPath | undefined {
        return new ConnectionSubjectPath(
            props.params.dataPointer.connection,
            [
                SubjectPathItem.plain(props.params.dataPointer.catalogName),
                SubjectPathItem.significant(
                    TrafficRecordHistoryViewerTabDefinition.icon(),
                    t('trafficViewer.recordHistory.title')
                )
            ]
        )
    }
})

const title: List<string> = List.of(
    props.params.dataPointer.catalogName,
    t('trafficViewer.recordHistory.title')
)

const shareTabButtonRef = ref<InstanceType<typeof ShareTabButton> | undefined>()
const historyListRef = ref<InstanceType<typeof RecordHistoryList> | undefined>()
const criteria = ref<TrafficRecordHistoryCriteria>(new TrafficRecordHistoryCriteria())

const initialized = ref<boolean>(false)

const currentData = computed<TrafficRecordHistoryViewerTabData>(() => {
    return new TrafficRecordHistoryViewerTabData(
        // todo lho filters
    )
})
watch(currentData, (data) => {
    emit('update:data', data)
})

// todo lho fix
watch(
    historyListRef,
    () => {
        if (!initialized.value) {
            historyListRef.value
                ?.reload()
                // .then(() => {
                //     initialized.value = true
                //     emit('ready')
                // })
        }
    },
    { immediate: true }
)
onBeforeMount(() => {
    // todo lho ref is not ready
    initialized.value = true
    emit('ready')
    // historyListRef.value
    //     ?.reload()
        // .then(() => {
        //
        // })
})
onMounted(() => {
    // register viewer specific keyboard shortcuts
    keymap.bind(Command.TrafficRecordHistoryViewer_ShareTab, props.id, () => shareTabButtonRef.value?.share())
    keymap.bind(Command.TrafficRecordHistoryViewer_Reload, props.id, () => historyListRef.value?.reload())
})
onUnmounted(() => {
    // unregister console specific keyboard shortcuts
    keymap.unbind(Command.TrafficRecordHistoryViewer_ShareTab, props.id)
    keymap.unbind(Command.TrafficRecordHistoryViewer_Reload, props.id)
})

async function reloadHistoryList(): Promise<void> {
    historyListRef.value?.reload()
}
</script>

<template>
    <div v-if="initialized" class="traffic-recording-viewer">
        <VTabToolbar :prepend-icon="TrafficRecordHistoryViewerTabDefinition.icon()" :title="title">
            <template #append>
                <ShareTabButton
                    ref="shareTabButtonRef"
                    :tab-type="TabType.TrafficRecordHistoryViewer"
                    :tab-params="params"
                    :tab-data="currentData"
                    :disabled="!params.dataPointer.connection.preconfigured"
                />

                <VBtn icon @click="reloadHistoryList">
                    <!--            todo lho new data indicator-->
                    <VIcon>mdi-refresh</VIcon>
                    <VTooltip activator="parent">
                        {{ t('trafficViewer.recordHistory.button.reloadRecordHistory') }}
                    </VTooltip>
                </VBtn>
            </template>
        </VTabToolbar>

        <VSheet class="traffic-recording-viewer__body">
            <RecordHistoryFilter v-model="criteria" />
            <RecordHistoryList
                ref="historyListRef"
                :data-pointer="params.dataPointer"
                :criteria="criteria"
            />
        </VSheet>
    </div>
</template>

<style lang="scss" scoped>
.traffic-recording-viewer {
    display: grid;
    grid-template-rows: 3rem 1fr;

    &__body {
        position: absolute;
        left: 0;
        right: 0;
        top: 3rem;
        bottom: 0;
        overflow-y: auto;

        // todo lho validate
        display: grid;
        grid-template-rows: 3rem 1fr;
    }
}
</style>
