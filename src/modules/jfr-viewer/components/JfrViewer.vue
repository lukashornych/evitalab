<script setup lang="ts">
import { List } from 'immutable'
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { TabComponentEvents } from '@/modules/workspace/tab/model/TabComponentEvents'
import { TabComponentProps } from '@/modules/workspace/tab/model/TabComponentProps'
import { VoidTabData } from '@/modules/workspace/tab/model/void/VoidTabData'
import { JfrViewerTabParams } from '@/modules/jfr-viewer/model/JfrViewerTabParams'
import {
    JfrViewerService,
    useJfrViewerService,
} from '@/modules/jfr-viewer/service/JfrViewerService'
import { VBtn, VIcon, VList } from 'vuetify/components'
import { onUnmounted } from 'vue'
import { ServerFile } from '@/modules/connection/model/server-file/ServerFile'
import { Toaster, useToaster } from '@/modules/notification/service/Toaster'
import VTabToolbar from '@/modules/base/component/VTabToolbar.vue'
import VTabMainActionButton from '@/modules/base/component/VTabMainActionButton.vue'
import { TaskState } from '@/modules/connection/model/task/TaskState'
import StartJfrRecordingDialog from '@/modules/jfr-viewer/components/StartJfrRecordingDialog.vue'
import EndJfrRecordingDialog from '@/modules/jfr-viewer/components/EndJfrRecordingDialog.vue'
import { PaginatedList } from '@/modules/connection/model/PaginatedList'
import { jfrRecorderTaskName } from '@/modules/jfr-viewer/model/JfrRecorderTask'
import TaskList from '@/modules/task-viewer/components/TaskList.vue'

const shownTaskStates: TaskState[] = [TaskState.Running, TaskState.Queued]
const shownTaskTypes: string[] = [jfrRecorderTaskName]

const jfrViewerService: JfrViewerService = useJfrViewerService()
const toaster: Toaster = useToaster()
const { t } = useI18n()

const props = defineProps<TabComponentProps<JfrViewerTabParams, VoidTabData>>()
const emit = defineEmits<TabComponentEvents>()

const jfrRecordingsReloadIntervalId = setInterval(loadJfrRecordings, 2000)

onUnmounted(() => {
    clearInterval(jfrRecordingsReloadIntervalId)
})

const path: List<string> = List([t('jfrViewer.path')])

const initialized = ref<boolean>(false)
const jfrRecordings = ref<PaginatedList<ServerFile> | undefined>()
const jfrRecordingsLoaded = ref<boolean>(false)
const jfrRecordingItems = computed<ServerFile[]>(() => {
    if (jfrRecordings.value == undefined) {
        return []
    }
    return jfrRecordings.value.data.toArray()
})
const runningRecordingsPresent = ref<boolean>(false)
const pageNumber = ref<number>(1)
const pageCount = computed<number>(() => {
    if (jfrRecordings.value == undefined) {
        return 1
    }
    return Math.ceil(jfrRecordings.value.totalNumberOfRecords / pageSize.value)
})
const pageSize = ref<number>(20)

const showStartRecordingDialog = ref<boolean>(false)
const showEndRecordingDialog = ref<boolean>(false)

loadJfrRecordings().then(() => {
    initialized.value = true
    emit('ready')
})

async function loadJfrRecordings() {
    jfrRecordings.value = await jfrViewerService.getRecordings(props.params.connection)
    jfrRecordingsLoaded.value = true
}

async function downloadRecording(file: ServerFile) {
    try {
        const blob = await jfrViewerService.downloadFile(props.params.connection, file.fileId)

        console.log('hej')
        const downloadUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = file.name
        document.body.appendChild(link)
        link.click()
    } catch (e: any) {
        toaster.error(t(
            'jfrViewer.notification.couldNotDownloadRecordingFile',
            {
                fileName: file.name,
                reason: e.message
            }
        ))
    }
}
</script>

<template>
    <div v-if="initialized" class="jfr-viewer">
        <VTabToolbar prepend-icon="mdi-record-circle-outline" :path="path">
            <template #append>
                <VTabMainActionButton prepend-icon="mdi-record-circle-outline" @click="showStartRecordingDialog = true">
                    {{ t('jfrViewer.button.startRecording') }}
                </VTabMainActionButton>
            </template>
        </VTabToolbar>

        <div>
            <TaskList
                v-show="runningRecordingsPresent"
                :connection="params.connection"
                :subheader="t('jfrViewer.tasks.title')"
                :states="shownTaskStates"
                :task-types="shownTaskTypes"
                :page-size="5"
                hideable-pagination
                @update:active-jobs-present="runningRecordingsPresent = $event"
            >
                <template #cancel-action="{ taskStatus }">
                    <VBtn
                        icon="mdi-stop-circle-outline"
                        density="compact"
                        variant="flat"
                        @click="showEndRecordingDialog = true"
                    />
                </template>
            </TaskList>

            <VList v-if="jfrRecordingsLoaded">
                <VListSubheader v-if="runningRecordingsPresent">
                    {{ t('jfrViewer.list.title') }}
                </VListSubheader>

                <VDataIterator :items="jfrRecordingItems" :page="pageNumber">
                    <template #default="{ items }">
                        <VListItem
                            v-for="item in items"
                            :key="item.raw.fileId.code"
                        >
                            <VRow class="align-center">
                                <!--                            todo lho revise -->
                                <VCol>
                                    <div class="d-flex align-center">
                                        <VListItemTitle>{{ item.raw.name }}</VListItemTitle>
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
                                    v-if="item.raw.created"
                                >
                                    <VBtn
                                        icon
                                        density="compact"
                                        variant="flat"
                                        @click="downloadRecording(item.raw)"
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
                        <!--                        todo lho implement -->
                        <!--                        <VListItemDivider-->
                        <!--                            v-if="index < taskStatusesItems.length - 1"-->
                        <!--                            inset-->
                        <!--                        />-->
                    </template>

                    <template #footer>
                        <VPagination v-model="pageNumber" :length="pageCount" />
                    </template>
                </VDataIterator>
            </VList>
        </div>

        <StartJfrRecordingDialog
            v-if="showStartRecordingDialog"
            v-model="showStartRecordingDialog"
            :connection="params.connection"
        />
        <EndJfrRecordingDialog
            v-if="showEndRecordingDialog"
            v-model="showEndRecordingDialog"
            :connection="params.connection"
        />
    </div>
</template>

<style lang="scss" scoped>
.jfr-viewer {
    display: grid;
    grid-template-rows: 3rem 1fr;

    &__body {
        position: relative;
    }
}
</style>
