<script setup lang="ts">

import VMissingDataIndicator from '@/modules/base/component/VMissingDataIndicator.vue'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { Toaster, useToaster } from '@/modules/notification/service/Toaster'
import { TrafficViewerService, useTrafficViewerService } from '@/modules/traffic-viewer/service/TrafficViewerService'
import { TrafficRecordHistoryDataPointer } from '@/modules/traffic-viewer/model/TrafficRecordHistoryDataPointer'
import Immutable from 'immutable'
import { TrafficRecord } from '@/modules/connection/model/traffic/TrafficRecord'
import { TrafficRecordingCaptureRequest } from '@/modules/connection/model/traffic/TrafficRecordingCaptureRequest'
import { TrafficRecordContent } from '@/modules/connection/model/traffic/TrafficRecordContent'
import VListItemDivider from '@/modules/base/component/VListItemDivider.vue'
import { TrafficRecordHistoryCriteria } from '@/modules/traffic-viewer/model/TrafficRecordHistoryCriteria'

const trafficViewerService: TrafficViewerService = useTrafficViewerService()
const toaster: Toaster = useToaster()
const { t } = useI18n()

const props = defineProps<{
    dataPointer: TrafficRecordHistoryDataPointer,
    criteria: TrafficRecordHistoryCriteria
}>()

const historyLoaded = ref<boolean>(false)
const history = ref<Immutable.List<TrafficRecord> | undefined>()

const sinceSessionSequenceId = ref<bigint | undefined>(undefined)
const sinceRecordSessionOffset = ref<number | undefined>(undefined)
const limit = ref<number>(20)
const lastPage = ref<boolean>(false)

const trafficRecordingCaptureRequest = computed<TrafficRecordingCaptureRequest>(() => {
    return new TrafficRecordingCaptureRequest(
        TrafficRecordContent.Body,
        props.criteria.since,
        sinceSessionSequenceId.value,
        sinceRecordSessionOffset.value,
        Immutable.List(props.criteria.types),
        props.criteria.sessionId,
        props.criteria.longerThan,
        props.criteria.fetchingMoreBytesThen,
        Immutable.List(props.criteria.labels)
    )
})

async function loadNextHistory(): Promise<boolean> {
    try {
        const fetchedHistory: Immutable.List<TrafficRecord> = await trafficViewerService.getRecordHistoryList(
            props.dataPointer.connection,
            props.dataPointer.catalogName,
            trafficRecordingCaptureRequest.value,
            limit.value
        )
        if (fetchedHistory.size === 0) {
            lastPage.value = true
            return true
        }

        history.value = fetchedHistory
        const lastFetchedRecord: TrafficRecord = fetchedHistory.last()
        sinceSessionSequenceId.value = lastFetchedRecord.sessionSequenceOrder
        sinceRecordSessionOffset.value = lastFetchedRecord.recordSessionOffset
        lastPage.value = false
        if (!historyLoaded.value) {
            historyLoaded.value = true
        }
        return true
    } catch (e: any) {
        toaster.error(t(
            'trafficViewer.recordings.notification.couldNotLoadRecordings',
            { reason: e.message }
        ))
        return false
    }
}

async function reloadHistory(): Promise<void> {
    sinceSessionSequenceId.value = undefined
    sinceRecordSessionOffset.value = undefined

    await loadNextHistory()
}

defineExpose<{
    reload(): Promise<void>
}>({
    reload: () => reloadHistory()
})
</script>

<template>
    <VList v-if="historyLoaded && history!.size > 0">
        <VInfiniteScroll
            mode="manual"
            @load="loadNextHistory"
        >
            <template v-for="(trafficRecord, index) in history" :key="`${trafficRecord.sessionSequenceOrder}:${trafficRecord.recordSessionOffset}`">
<!--                todo lho impl list items-->
                <VListItem>
                    {{ trafficRecord.type }}
                </VListItem>

                <VListItemDivider v-if="index < history!.size - 1"/>
            </template>

<!--            todo lho only when not last page-->
<!--            <template #load-more>-->
<!--                -->
<!--            </template>-->
        </VInfiniteScroll>
    </VList>

    <VMissingDataIndicator
        v-else
        icon="mdi-record-circle-outline"
        :title="t('trafficViewer.recordHistory.list.noRecords')"
    />
</template>

<style lang="scss" scoped>

</style>
