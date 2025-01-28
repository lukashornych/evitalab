<script setup lang="ts">

/**
 * Lists traffic recording history
 */

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
import {
    TrafficRecordVisualisationDefinition
} from '@/modules/traffic-viewer/model/TrafficRecordVisualisationDefinition'
import RecordHistoryItem from '@/modules/traffic-viewer/components/RecordHistoryItem.vue'
import { TrafficRecordType } from '@/modules/connection/model/traffic/TrafficRecordType'
import { convertUserToSystemRecordType } from '@/modules/traffic-viewer/model/UserTrafficRecordType'

// note: this is enum from vuetify, but vuetify doesn't export it
type InfiniteScrollStatus = 'ok' | 'empty' | 'loading' | 'error';

const pageSize: number = 20

const trafficViewerService: TrafficViewerService = useTrafficViewerService()
const toaster: Toaster = useToaster()
const { t } = useI18n()

const props = defineProps<{
    dataPointer: TrafficRecordHistoryDataPointer,
    criteria: TrafficRecordHistoryCriteria
}>()


const historyLoaded = ref<boolean>(false)
let historyRecords: TrafficRecord[] = []
const history = ref<TrafficRecordVisualisationDefinition[]>([])

const sinceSessionSequenceId = ref<bigint | undefined>(1n)
const sinceRecordSessionOffset = ref<number | undefined>(1)
const limit = ref<number>(pageSize)
const lastPage = ref<boolean>(false)

const trafficRecordingCaptureRequest = computed<TrafficRecordingCaptureRequest>(() => {
    return new TrafficRecordingCaptureRequest(
        TrafficRecordContent.Body,
        props.criteria.since,
        sinceSessionSequenceId.value,
        sinceRecordSessionOffset.value,
        props.criteria.types != undefined
            ? Immutable.List([
                ...(props.criteria.types.flatMap(userType => convertUserToSystemRecordType(userType)!))
            ])
            : undefined,
        props.criteria.sessionId,
        props.criteria.longerThan,
        props.criteria.fetchingMoreBytesThan,
        Immutable.List(props.criteria.labels)
    )
})

async function loadNextHistory(): Promise<boolean> {
    try {
        const fetchedRecords: Immutable.List<TrafficRecord> = await trafficViewerService.getRecordHistoryList(
            props.dataPointer,
            trafficRecordingCaptureRequest.value,
            limit.value
        )

        if (fetchedRecords.size === 0) {
            lastPage.value = true
            return true
        }
        if (fetchedRecords.size < pageSize) {
            // todo lho not working
            lastPage.value = true
        }

        for (const fetchedRecord of fetchedRecords) {
            historyRecords.push(fetchedRecord)
        }
        const lastFetchedRecord: TrafficRecord = fetchedRecords.last()
        if (lastFetchedRecord.recordSessionOffset < (lastFetchedRecord.sessionRecordsCount - 1)) {
            sinceSessionSequenceId.value = lastFetchedRecord.sessionSequenceOrder
            sinceRecordSessionOffset.value = lastFetchedRecord.recordSessionOffset + 1
        } else {
            sinceSessionSequenceId.value = lastFetchedRecord.sessionSequenceOrder + 1n
            sinceRecordSessionOffset.value = 0
        }
        lastPage.value = false
        if (!historyLoaded.value) {
            historyLoaded.value = true
        }
        // note: we compute the history manually here because for some reason, computed ref wasn't working
        history.value = trafficViewerService.processRecords(props.dataPointer, historyRecords).toArray()
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
    historyRecords = []

    await loadNextHistory()
}

async function loadScroller({ done }: { done: (status: InfiniteScrollStatus) => void }): Promise<void> {
    const result: boolean = await loadNextHistory()
    if (result) {
        done('ok')
    } else {
        done('error')
    }
}

defineExpose<{
    reload(): Promise<void>
}>({
    reload: () => reloadHistory()
})
</script>

<template>
    <VList v-if="historyLoaded && history.length > 0">
        <VInfiniteScroll
            mode="manual"
            side="end"
            @load="loadScroller"
        >
            <template
                v-for="(visualisationDefinition, index) in history"
                :key="index"
            >
                <RecordHistoryItem :visualisation-definition="visualisationDefinition as TrafficRecordVisualisationDefinition" />
                <VListItemDivider v-if="index < history.length - 1"/>
            </template>

            <template #load-more="{ props }">
                <VBtn v-if="!lastPage" v-bind="props">
                    {{ t('common.button.showMore') }}
                </VBtn>
            </template>
        </VInfiniteScroll>
    </VList>

    <VMissingDataIndicator
        v-else
        icon="mdi-record-circle-outline"
        :title="t('trafficViewer.recordHistory.list.noRecords', { catalogName: dataPointer.catalogName })"
    />
</template>

<style lang="scss" scoped>

</style>
