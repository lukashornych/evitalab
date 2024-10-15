<script setup lang="ts">

import BackupListItem from '@/modules/backup-viewer/components/BackupListItem.vue'
import VListItemDivider from '@/modules/base/component/VListItemDivider.vue'
import VMissingDataIndicator from '@/modules/base/component/VMissingDataIndicator.vue'
import { computed, onUnmounted, ref, watch } from 'vue'
import { PaginatedList } from '@/modules/connection/model/PaginatedList'
import { ServerFile } from '@/modules/connection/model/server-file/ServerFile'
import { BackupViewerService, useBackupViewerService } from '@/modules/backup-viewer/service/BackupViewerService'
import { Toaster, useToaster } from '@/modules/notification/service/Toaster'
import { useI18n } from 'vue-i18n'
import { Connection } from '@/modules/connection/model/Connection'

const backupViewerService: BackupViewerService = useBackupViewerService()
const toaster: Toaster = useToaster()
const { t } = useI18n()

const props = defineProps<{
    connection: Connection
    backupsInPreparationPresent: boolean
}>()
const emit = defineEmits<{
    (e: 'tasksUpdate'): void
}>()

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
            props.connection,
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
loadBackupFiles().then()

let canReload: boolean = true
let reloadBackupFilesTimeoutId: ReturnType<typeof setTimeout> | undefined = undefined
async function reload(manual: boolean = false): Promise<void> {
    if (!canReload && !manual) {
        return
    }

    const loaded: boolean = await loadBackupFiles()
    if (loaded) {
        if (manual && canReload) {
            // do nothing if the reloading process is working and user
            // requests additional reload in between
        } else {
            // set new timeout only for automatic reload or reload recovery
            reloadBackupFilesTimeoutId = setTimeout(reload, 5000)
        }
        canReload = true
    } else {
        // we don't want to spam user server is down, user needs to refresh manually
        canReload = false
    }
}
reloadBackupFilesTimeoutId = setTimeout(reload, 5000)

onUnmounted(() => clearInterval(reloadBackupFilesTimeoutId))

defineExpose<{
    reload(manual: boolean): Promise<void>
}>({
    reload
})
</script>

<template>
    <VList v-if="backupFilesLoaded && backupFileItems.length > 0">
        <VListSubheader v-if="backupsInPreparationPresent">
            {{ t('backupViewer.list.title') }}
        </VListSubheader>

        <VDataIterator
            :items="backupFileItems"
            :page="pageNumber"
            :items-per-page="pageSize"
        >
            <template #default="{ items }">
                <template v-for="(item, index) in items" :key="item.raw.fileId.code">
                    <BackupListItem
                        :connection="connection"
                        :backup-file="item.raw"
                        @files-update="reload(true)"
                        @tasks-update="emit('tasksUpdate')"
                    />

                    <VListItemDivider
                        v-if="index < backupFileItems.length - 1"
                        inset
                    />
                </template>
            </template>

            <template #footer>
                <VPagination v-model="pageNumber" :length="pageCount" />
            </template>
        </VDataIterator>
    </VList>

    <VMissingDataIndicator
        v-else
        icon="mdi-cloud-download-outline"
        :title="t('backupViewer.list.noFiles')"
    />
</template>

<style lang="scss" scoped>

</style>
