<script setup lang="ts">
import { TabComponentEvents } from '@/modules/workspace/tab/model/TabComponentEvents'
import { List } from 'immutable'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { VBtn, VIcon, VList } from 'vuetify/lib/components/index.mjs'
import { TabComponentProps } from '@/modules/workspace/tab/model/TabComponentProps'
import { VoidTabData } from '@/modules/workspace/tab/model/void/VoidTabData'
import { BackupViewerService, useBackupViewerService } from '../service/BackupViewerService'
import { onUnmounted } from 'vue'
import { BackupViewerTabParams } from '@/modules/backup-viewer/model/BackupViewerTabParams'
import { TaskState } from '@/modules/connection/model/task/TaskState'
import BackupCatalogDialog from '@/modules/backup-viewer/components/BackupCatalogDialog.vue'
import VTabToolbar from '@/modules/base/component/VTabToolbar.vue'
import VTabMainActionButton from '@/modules/base/component/VTabMainActionButton.vue'
import { Toaster, useToaster } from '@/modules/notification/service/Toaster'
import { ServerFile } from '@/modules/connection/model/server-file/ServerFile'
import RestoreCatalogDialog from '@/modules/backup-viewer/components/RestoreCatalogDialog.vue'
import { PaginatedList } from '@/modules/connection/model/PaginatedList'
import { backupTaskName } from '@/modules/backup-viewer/model/BackupTask'
import { restoreTaskName } from '@/modules/backup-viewer/model/RestoreTask'
import TaskList from '@/modules/task-viewer/components/TaskList.vue'
import VListItemDivider from '@/modules/base/component/VListItemDivider.vue'

const shownTaskStates: TaskState[] = [TaskState.Running, TaskState.Queued, TaskState.Failed]
const shownTaskTypes: string[] = [backupTaskName, restoreTaskName]

const backupViewerService: BackupViewerService = useBackupViewerService()
const toaster: Toaster = useToaster()
const { t } = useI18n()

const emit = defineEmits<TabComponentEvents>()
const props = defineProps<TabComponentProps<BackupViewerTabParams, VoidTabData>>()

const taskListRef = ref<typeof TaskList>()

const path: List<string> = List([props.params.catalogName])

const initialized = ref<boolean>(false)

const showBackupCatalogDialog = ref<boolean>(false)
const showRestoreCatalogDialog = ref<boolean>(false)
const restoreBackupFile = ref<ServerFile | undefined>()

const backupsInPreparationPresent = ref<boolean>(false)
const backupFilesLoaded = ref<boolean>(false)
const backupFiles = ref<PaginatedList<ServerFile>>()
const backupFileItems = computed<ServerFile[]>(() => {
    if (backupFiles.value == undefined) {
        return []
    }
    return backupFiles.value.data.toArray()
})
const pageNumber = ref<number>(1)
watch(pageNumber, async () => {
    await loadBackupFiles()
})
const pageCount = computed<number>(() => {
    if (backupFiles.value == undefined) {
        return 1
    }
    return Math.ceil(backupFiles.value.totalNumberOfRecords / pageSize.value)
})
const pageSize = ref<number>(20)

async function loadBackupFiles(): Promise<boolean> {
    try {
        backupFiles.value = await backupViewerService.getBackupFiles(
            props.params.connection,
            pageNumber.value,
            pageSize.value
        )
        backupFilesLoaded.value = true
        return true
    } catch (e: any) {
        toaster.error(t(
            'backupViewer.notification.couldNotLoadBackupFiles',
            { reason: e.message }
        ))
        return false
    }
}
loadBackupFiles().then(() => {
    initialized.value = true
    emit('ready')
})

let canReloadBackupFiles: boolean = true
async function reloadBackupFiles(manual: boolean = false): Promise<void> {
    if (!canReloadBackupFiles && !manual) {
        return
    }

    const loaded: boolean = await loadBackupFiles()
    if (loaded) {
        canReloadBackupFiles = true
        setTimeout(reloadBackupFiles, 2000)
    } else {
        // we don't want to spam user server is down, user needs to refresh manually
        canReloadBackupFiles = false
    }
}
setTimeout(reloadBackupFiles, 2000)

function reloadBackups(): void {
    reloadBackupFiles(true)
    taskListRef.value?.reload(true)
}

function showRestoreDialog(file: ServerFile): void {
    restoreBackupFile.value = file
    showRestoreCatalogDialog.value = true
}

function hideRestoreDialog(): void {
    showRestoreCatalogDialog.value = false
    restoreBackupFile.value = undefined
}

// todo lho download button instead
async function downloadBackup(file: ServerFile){
    try {
        const blob = await backupViewerService.downloadBackup(props.params.connection, file.fileId)

        const downloadUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = file.name
        document.body.appendChild(link)
        link.click()
    } catch (e: any) {
        toaster.error(t(
            'backupViewer.notification.couldNotDownloadBackupFile',
            {
                fileName: file.name,
                reason: e.message
            }
        ))
    }
}
</script>

<template>
    <div v-if="initialized" class="backup-viewer">
        <VTabToolbar prepend-icon="mdi-cloud-download-outline" :path="path">
            <template #append>
                <VBtn icon @click="reloadBackups">
                    <VIcon>mdi-refresh</VIcon>
                    <VTooltip activator="parent">
                        {{ t('backupViewer.button.reloadBackups') }}
                    </VTooltip>
                </VBtn>
                <VTabMainActionButton prepend-icon="mdi-cloud-download-outline" @click="showBackupCatalogDialog = true">
                    {{ t('backupViewer.button.backupCatalog') }}
                </VTabMainActionButton>
            </template>
        </VTabToolbar>

        <div>
            <TaskList
                ref="taskListRef"
                v-show="backupsInPreparationPresent"
                :connection="params.connection"
                :subheader="t('backupViewer.tasks.title')"
                :states="shownTaskStates"
                :task-types="shownTaskTypes"
                :page-size="5"
                hideable-pagination
                @update:active-jobs-present="backupsInPreparationPresent = $event"
            />

            <VList v-if="backupFilesLoaded">
                <VListSubheader v-if="backupsInPreparationPresent">
                    {{ t('backupViewer.list.title') }}
                </VListSubheader>

                <VDataIterator :items="backupFileItems" :page="pageNumber">
                    <template #default="{ items }">
                        <!--                    todo lho revise -->
                        <VListItem v-for="item in items" :key="item.raw.fileId.code">
                            <VRow class="align-center">
                                <VCol>
                                    <div class="d-flex align-center">
                                        <VListItemTitle>{{ item.raw.name }}</VListItemTitle>
                                        <VChip
                                            color="grey"
                                            text-color="white"
                                            class="ml-2 small-chip"
                                        >finished
                                        </VChip
                                        >
                                    </div>
                                </VCol>
                                <VCol
                                    class="d-flex justify-end"
                                    cols="auto"
                                    v-if="item.raw.created"
                                >
                                    <VBtn
                                        icon="mdi-download"
                                        variant="flat"
                                        @click="downloadBackup(item.raw)"
                                    />
                                    <VBtn
                                        icon="mdi-database-arrow-right-outline"
                                        variant="flat"
                                        @click="showRestoreDialog(item.raw)"
                                    />
                                </VCol>
                                <VCol class="d-flex justify-end" cols="auto" v-else>
                                    <!--                                todo lho what is this?-->
                                    <VBtn
                                        icon="mdi-window-close"
                                        variant="flat"
                                    />
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

        <BackupCatalogDialog
            v-if="showBackupCatalogDialog"
            v-model="showBackupCatalogDialog"
            :connection="params.connection"
            :catalog-name="params.catalogName"
        />
        <RestoreCatalogDialog
            v-if="showRestoreCatalogDialog"
            :model-value="showRestoreCatalogDialog"
            :connection="params.connection"
            :file="restoreBackupFile!"
            @update:model-value="hideRestoreDialog()"
        />
    </div>
</template>

<style lang="scss" scoped>
.backup-viewer {
    display: grid;
    grid-template-rows: 3rem 1fr;

    &__body {
        position: relative;
    }
}
</style>
