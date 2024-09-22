<script setup lang="ts">
import { TabComponentEvents } from '@/modules/workspace/tab/model/TabComponentEvents'
import { List } from 'immutable'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { VBtn, VIcon, VList } from 'vuetify/lib/components/index.mjs'
import { TabComponentProps } from '@/modules/workspace/tab/model/TabComponentProps'
import { VoidTabData } from '@/modules/workspace/tab/model/void/VoidTabData'
import { backupTaskName, restoreTaskName, BackupViewerService, useBackupViewerService } from '../service/BackupViewerService'
import { onUnmounted } from 'vue'
import { BackupViewerTabParams } from '@/modules/backup-viewer/model/BackupViewerTabParams'
import { FilesToFetch } from '@/modules/connection/model/file/FilesToFetch'
import { TaskState } from '@/modules/connection/model/task/TaskState'
import BackupCatalogDialog from '@/modules/backup-viewer/components/BackupCatalogDialog.vue'
import VTabToolbar from '@/modules/base/component/VTabToolbar.vue'
import VTabMainActionButton from '@/modules/base/component/VTabMainActionButton.vue'
import { Command } from '@/modules/keymap/model/Command'
import VActionTooltip from '@/modules/base/component/VActionTooltip.vue'
import { Toaster, useToaster } from '@/modules/notification/service/Toaster'
import TasksVisualizer from '@/modules/task-viewer/components/TasksVisualizer.vue'
import { File } from '@/modules/connection/model/file/File'
import RestoreCatalogDialog from '@/modules/backup-viewer/components/RestoreCatalogDialog.vue'

const backupViewerService: BackupViewerService = useBackupViewerService()
const toaster: Toaster = useToaster()
const { t } = useI18n()

const emit = defineEmits<TabComponentEvents>()
const props = defineProps<TabComponentProps<BackupViewerTabParams, VoidTabData>>()

const path: List<string> = List([t('backupViewer.path')])

const initialized = ref<boolean>(false)

const backupsIntervalId = setInterval(loadBackupFiles, 2000)

onUnmounted(() => {
    clearInterval(backupsIntervalId)
})

const showBackupCatalogDialog = ref<boolean>(false)
const showRestoreCatalogDialog = ref<boolean>(false)
const restoreBackupFile = ref<File | undefined>()

const backupsInPreparationPresent = ref<boolean>(false)
const backupFilesLoaded = ref<boolean>(false)
const backupFiles = ref<FilesToFetch>()
const backupFileItems = computed<File[]>(() => {
    if (backupFiles.value == undefined) {
        return []
    }
    return backupFiles.value.filesToFetch.toArray()
})
const pageNumber = ref<number>(1)
const pageCount = computed<number>(() => {
    if (backupFiles.value == undefined) {
        return 1
    }
    return Math.ceil(backupFiles.value.totalNumberOfRecords / pageSize.value)
})
const pageSize = ref<number>(20)
const file = ref<File>()

loadBackupFiles().then(() => {
    initialized.value = true
    emit('ready')
})

watch(pageNumber, async () => {
    await loadBackupFiles()
})

async function loadBackupFiles(): Promise<void> {
    try {
        backupFiles.value = await backupViewerService.getBackupFiles(
            props.params.connection,
            pageNumber.value,
            pageSize.value
        )
        backupFilesLoaded.value = true
    } catch (e: any) {
        toaster.error(t(
            'backupViewer.notification.couldNotLoadBackupFiles',
            { reason: e.message }
        ))
    }
}

function showRestoreDialog(file: File): void {
    restoreBackupFile.value = file
    showRestoreCatalogDialog.value = true
}

function hideRestoreDialog(): void {
    showRestoreCatalogDialog.value = false
    restoreBackupFile.value = undefined
}

async function downloadBackup(file: File){
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

// todo lho prototype for local file restore
// async function upload(){
//     await backupViewerService.uploadBackup(props.params.connection, sendCatalogChunks())
// }
//
// async function* sendCatalogChunks(): AsyncIterable<GrpcRestoreCatalogRequest> {
//     if (!file.value) {
//         return;
//     }
//
//     const CHUNK_SIZE = 64 * 1024; // 64 KB chunks
//     const fileReader = new FileReader();
//     let offset = 0;
//     const totalSize = file.value.size;
//
//     // Helper function to read a chunk
//     function readChunk() {
//         if (offset >= totalSize) {
//             fileReader.abort();
//             return;
//         }
//         const chunk = file.value!.slice(offset, offset + CHUNK_SIZE);
//         fileReader.readAsArrayBuffer(chunk);
//     }
//
//     // Promise to handle the load of one chunk
//     const onLoadPromise = () => {
//         return new Promise<Uint8Array>((resolve, reject) => {
//             fileReader.onload = (event: ProgressEvent<FileReader>) => {
//                 if (event.target?.result) {
//                     const arrayBuffer = event.target.result as ArrayBuffer;
//                     const fileChunk = new Uint8Array(arrayBuffer);
//                     offset += CHUNK_SIZE;
//                     resolve(fileChunk);
//                 }
//             };
//
//             fileReader.onerror = () => {
//                 console.error('Error reading file.');
//                 fileReader.abort();
//                 reject(new Error('Error reading file'));
//             };
//         });
//     };
//
//     try {
//         while (offset < totalSize) {
//             readChunk();
//             const chunk = await onLoadPromise();
//             yield new GrpcRestoreCatalogRequest({
//                 catalogName: 'random',
//                 backupFile: chunk
//             }); // Yield the chunk here
//         }
//     } catch (error) {
//         console.error('Error during file upload:', error);
//     }
// }
</script>

<template>
    <div v-if="initialized" class="backup-viewer">
        <VTabToolbar prepend-icon="mdi-cloud-download-outline" :path="path">
            <template #append>
                <VTabMainActionButton @click="showBackupCatalogDialog = true">
                    <VIcon>mdi-cloud-download-outline</VIcon>

                    {{ t('backupViewer.button.backupCatalog') }}
                </VTabMainActionButton>
            </template>
        </VTabToolbar>

        <div>
            <!--        todo lho add restore tasks -->
            <TasksVisualizer
                v-show="backupsInPreparationPresent"
                :connection="params.connection"
                :subheader="t('backupViewer.tasks.title')"
                :states="[TaskState.Running, TaskState.Queued]"
                :task-type="backupTaskName"
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
