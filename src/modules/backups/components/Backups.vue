<template>
    <TabWindowBody
        icon="mdi-cloud-download-outline"
        :path="path"
        :visible-button="true"
        @top-button-click="() => (visibleAddBackup = !visibleAddBackup)"
    >
        <JobVisualizer
            :connection="props.params.connection"
            @task-ended="getAllBackupFiles"
            :simplified-state="[
                TaskSimplifiedState.TaskRunning,
                TaskSimplifiedState.TaskQueued,
            ]"
            task-type="BackupTask"
        />
        <VList>
            <VListItem
                v-for="item in backupFiles?.filesToFetch"
                :key="item.fileId.code"
            >
                <VRow class="align-center">
                    <VCol>
                        <div class="d-flex align-center">
                            <VListItemTitle>{{ item.name }}</VListItemTitle>
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
                        v-if="item.created"
                    >
                        <VBtn icon variant="flat" @click="downloadBackup(item.fileId, item.name)">
                            <VIcon>mdi-download</VIcon>
                        </VBtn>
                        <VBtn
                            icon
                            variant="flat"
                            @click="showRestoreDialog(item.fileId)"
                        >
                            <VIcon>mdi-database-arrow-right-outline</VIcon>
                        </VBtn>
                    </VCol>
                    <VCol class="d-flex justify-end" cols="auto" v-else>
                        <VBtn icon variant="flat">
                            <VIcon>mdi-window-close</VIcon>
                        </VBtn>
                    </VCol>
                </VRow>
            </VListItem>
        </VList>
        <VPagination
            v-if="
                backupFiles?.totalNumberOfRecords &&
                Math.ceil(backupFiles?.totalNumberOfRecords / pageSize) > 1
            "
            :rounded="true"
            @update:model-value="(x) => (pageNumber = x)"
            :length="Math.ceil(backupFiles?.totalNumberOfRecords! / pageSize)"
        >
        </VPagination>
        <BackupDialog
            :catalog-name="props.params.catalogName"
            :minimal-date="minimalDate!"
            @exit="() => (visibleAddBackup = false)"
            @backup="backup"
            v-if="visibleAddBackup"
        />
        <RestoreCatalog
            @exit="() => (visibleRestoreCatalog = !visibleRestoreCatalog)"
            @restore="restoreBackup"
            v-if="visibleRestoreCatalog"
        />
    </TabWindowBody>
</template>

<script setup lang="ts">
import { TabComponentEvents } from '@/modules/workspace/tab/model/TabComponentEvents'
import { List } from 'immutable'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { VBtn, VIcon, VList } from 'vuetify/lib/components/index.mjs'
import { BackupTabParams } from '../model/BackupsTabParams'
import { TabComponentProps } from '@/modules/workspace/tab/model/TabComponentProps'
import { VoidTabData } from '@/modules/workspace/tab/model/void/VoidTabData'
import { BackupsService, useBackupsService } from '../service/BackupsService'
import { OffsetDateTime } from '@/modules/connection/model/data-type/OffsetDateTime'
import { DateTime } from 'luxon'
import { Timestamp } from '@bufbuild/protobuf'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { FilesToFetch } from '@/modules/connection/model/data/FilesToFetch'
import TabWindowBody from '@/modules/global/components/TabWindowBody.vue'
import JobVisualizer from '@/modules/jobs/components/JobVisualizer.vue'
import { TaskSimplifiedState } from '@/modules/connection/model/data/TaskSimplifiedState'
import BackupDialog from './BackupCatalog.vue'
import RestoreCatalog from './RestoreCatalog.vue'
import { Uuid } from '@/modules/connection/model/data-type/Uuid'
import { GrpcRestoreCatalogRequest } from '@/modules/connection/driver/grpc/gen/GrpcEvitaManagementAPI_pb'
import { onUnmounted } from 'vue'

const emit = defineEmits<TabComponentEvents>()
const props = defineProps<TabComponentProps<BackupTabParams, VoidTabData>>()
const { t } = useI18n()
const backupService: BackupsService = useBackupsService()

const path: List<string> = List([t('backups.path')])
const visibleAddBackup = ref<boolean>(false)
const visibleRestoreCatalog = ref<boolean>(false)
const restoreBackupFileId = ref<Uuid>()
const minimalDateLoaded = ref<boolean>(false)
const minimalDate = ref<OffsetDateTime>()
const backupFilesLoaded = ref<boolean>(false)
const backupFiles = ref<FilesToFetch>()
const includingWAL = ref<boolean>(false)
const pageNumber = ref<number>(1)
const pageSize = ref<number>(10)
const file = ref<File>()

getMinimalDate().then(() => checkAllDataLoaded())
getAllBackupFiles().then(() => checkAllDataLoaded())

watch(pageNumber, async () => {
    await getAllBackupFiles()
})

async function getMinimalDate(): Promise<void> {
    const minimalDateResponse = await backupService.getMinimalBackupDate(
        props.params.connection,
        props.params.catalogName
    )
    minimalDate.value = minimalDateResponse.introducedAt
    minimalDateLoaded.value = true
}

async function getAllBackupFiles(): Promise<void> {
    const files = await backupService.getAllBackups(
        props.params.connection,
        pageNumber.value,
        pageSize.value
    )
    backupFiles.value = files
    backupFilesLoaded.value = true
}

async function backup(selectedDate: string): Promise<void> {
    const jsDate = new Date(selectedDate)
    const offsetDateTime = DateTime.fromJSDate(jsDate)
    const timestamp = Timestamp.fromDate(jsDate)
    const result = await backupService.backupCatalog(
        props.params.connection,
        props.params.catalogName,
        includingWAL.value,
        new OffsetDateTime(timestamp, offsetDateTime.toFormat('ZZ'))
    )
    if (!result.exception) {
        visibleAddBackup.value = false
    } else throw new UnexpectedError(result.exception)
}

function checkAllDataLoaded(): void {
    if (backupFilesLoaded.value && minimalDateLoaded.value) emit('ready')
}

function showRestoreDialog(fileId: Uuid): void {
    restoreBackupFileId.value = fileId
    visibleRestoreCatalog.value = true
}

async function restoreBackup(catalogName: string) {
    const result = await backupService.restoreCatalog(
        props.params.connection,
        catalogName,
        restoreBackupFileId.value!
    )
    if (!result.exception) {
        visibleRestoreCatalog.value = false
    } else throw new UnexpectedError(result.exception)
}

async function downloadBackup(fileId: Uuid, name: string){
    const blob = await backupService.downloadBackup(props.params.connection, fileId)
    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = name;
    document.body.appendChild(link);
    link.click();
}

async function upload(){
    await backupService.uploadBackup(props.params.connection, sendCatalogChunks())
}

async function* sendCatalogChunks(): AsyncIterable<GrpcRestoreCatalogRequest> {
    if (!file.value) {
        return;
    }

    const CHUNK_SIZE = 64 * 1024; // 64 KB chunks
    const fileReader = new FileReader();
    let offset = 0;
    const totalSize = file.value.size;

    // Helper function to read a chunk
    function readChunk() {
        if (offset >= totalSize) {
            fileReader.abort();
            return;
        }
        const chunk = file.value!.slice(offset, offset + CHUNK_SIZE);
        fileReader.readAsArrayBuffer(chunk);
    }

    // Promise to handle the load of one chunk
    const onLoadPromise = () => {
        return new Promise<Uint8Array>((resolve, reject) => {
            fileReader.onload = (event: ProgressEvent<FileReader>) => {
                if (event.target?.result) {
                    const arrayBuffer = event.target.result as ArrayBuffer;
                    const fileChunk = new Uint8Array(arrayBuffer);
                    offset += CHUNK_SIZE;
                    resolve(fileChunk);
                }
            };

            fileReader.onerror = () => {
                console.error('Error reading file.');
                fileReader.abort();
                reject(new Error('Error reading file'));
            };
        });
    };

    try {
        while (offset < totalSize) {
            readChunk();
            const chunk = await onLoadPromise();
            yield new GrpcRestoreCatalogRequest({
                catalogName: 'random',
                backupFile: chunk
            }); // Yield the chunk here
        }
    } catch (error) {
        console.error('Error during file upload:', error);
    }
}

const backupsIntervalId = setInterval(getAllBackupFiles, 2000)

onUnmounted(() => {
    clearInterval(backupsIntervalId)
})
</script>

<style scoped></style>
