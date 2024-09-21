<template>
    <TabWindowBody
        :path="path"
        icon="mdi-record-circle-outline"
        :visible-button="true"
        button-text="Start recording"
        @top-button-click="showStartRecording"
    >
        <JobVisualizer
            :connection="props.params.connection"
            task-type="JfrRecorderTask"
            :simplified-state="[
                TaskSimplifiedState.TaskRunning,
                TaskSimplifiedState.TaskQueued,
            ]"
            @stop-jfr="stopJfrRecording"
        />
        <VList>
            <VListItem
                v-for="(item, index) in result?.filesToFetch"
                :key="index"
            >
                <VRow class="align-center">
                    <VCol>
                        <div class="d-flex align-center">
                            <VListItemTitle>{{ item.name }}</VListItemTitle>
                            <VChip
                                color="grey"
                                text-color="white"
                                class="ml-2 small-chip"
                                >finished</VChip
                            >
                        </div>
                    </VCol>
                    <VCol
                        class="d-flex justify-end"
                        cols="auto"
                        v-if="item.created"
                    >
                        <VBtn
                            icon
                            variant="flat"
                            @click="downloadFile(item.fileId, item.name)"
                        >
                            <VIcon>mdi-download</VIcon>
                        </VBtn>
                        <!--
                        TODO: Implement
                        <VBtn icon variant="flat">
                            <VIcon>mdi-delete-outline</VIcon>
                        </VBtn>
                        -->
                    </VCol>
                </VRow>
            </VListItem>
        </VList>
        <JfrStartRecord
            :connection="params.connection"
            :jfr-service="jfrService"
            @exit="closeStartRecording"
            v-if="visibleStartRecording"
        />
        <JfrEndRecord v-if="visibleEndRecording" />
    </TabWindowBody>
</template>

<script setup lang="ts">
import TabWindowBody from '@/modules/global/components/TabWindowBody.vue'
import { List } from 'immutable'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { TabComponentEvents } from '@/modules/workspace/tab/model/TabComponentEvents'
import JobVisualizer from '@/modules/jobs/components/JobVisualizer.vue'
import { TabComponentProps } from '@/modules/workspace/tab/model/TabComponentProps'
import { VoidTabData } from '@/modules/workspace/tab/model/void/VoidTabData'
import { JfrVisualizerTabParams } from '@/modules/jfr-recording/model/JfrVisualizerTabParams'
import { TaskSimplifiedState } from '@/modules/connection/model/data/TaskSimplifiedState'
import {
    JfrService,
    useJfrService,
} from '@/modules/jfr-recording/service/JfrService'
import { VBtn, VIcon, VList } from 'vuetify/components'
import { FilesToFetch } from '@/modules/connection/model/data/FilesToFetch'
import { Uuid } from '@/modules/connection/model/data-type/Uuid'
import JfrStartRecord from './JfrStartRecord.vue'
import JfrEndRecord from '@/modules/jfr-recording/components/JfrEndRecord.vue'
import { onUnmounted } from 'vue'

const emit = defineEmits<TabComponentEvents>()
const props =
    defineProps<TabComponentProps<JfrVisualizerTabParams, VoidTabData>>()
const jfrService: JfrService = useJfrService()
const result = ref<FilesToFetch>()
const visibleStartRecording = ref<boolean>(false)
const visibleEndRecording = ref<boolean>(false)

const { t } = useI18n()
const path: List<string> = List([t('jfr.path')])

getAllJfrs().then(() => emit('ready'))

async function getAllJfrs() {
    result.value = await jfrService.getAllJfrs(props.params.connection)
}

async function stopJfrRecording(){
    await jfrService.stopRecording(props.params.connection)
}

function showStartRecording() {
    visibleStartRecording.value = true
}

async function downloadFile(fileId: Uuid, name: string) {
    const blob = await jfrService.downloadFile(props.params.connection, fileId)
    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = name
    document.body.appendChild(link)
    link.click()
}

function closeStartRecording() {
    visibleStartRecording.value = false
}

const jfrIntervalId = setInterval(getAllJfrs, 2000)

onUnmounted(() => {
    clearInterval(jfrIntervalId)
})
</script>

<style scoped></style>
