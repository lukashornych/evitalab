<script setup lang="ts">

import VDownloadServerFileButton from '@/modules/connection/component/VDownloadServerFileButton.vue'
import { Connection } from '@/modules/connection/model/Connection'
import { ServerFile } from '@/modules/connection/model/server-file/ServerFile'
import { Toaster, useToaster } from '@/modules/notification/service/Toaster'
import { useI18n } from 'vue-i18n'

const toaster: Toaster = useToaster()
const { t } = useI18n()

const props = defineProps<{
    connection: Connection,
    backupFile: ServerFile
}>()

function onCouldNotDownloadResultFile(e: Error): void {
    toaster.error(t(
        'backupViewer.list.backup.notification.couldNotDownloadBackupFile',
        {
            fileName: props.backupFile.name,
            reason: e.message
        }
    ))
}
</script>

<template>
    <VDownloadServerFileButton
        :connection="connection"
        :file="backupFile"
        @error="onCouldNotDownloadResultFile($event)"
    >
        {{ t('backupViewer.list.backup.button.downloadBackupFile') }}
    </VDownloadServerFileButton>
</template>

<style lang="scss" scoped>

</style>
