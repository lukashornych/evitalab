<script setup lang="ts">

import { ServerFile } from '@/modules/connection/model/server-file/ServerFile'
import { Connection } from '@/modules/connection/model/Connection'
import BackupTitle from '@/modules/backup-viewer/components/BackupTitle.vue'
import DownloadBackupFileButton from '@/modules/backup-viewer/components/DownloadBackupFileButton.vue'
import RestoreBackupFileButton from '@/modules/backup-viewer/components/RestoreBackupFileButton.vue'
import DeleteBackupFileButton from '@/modules/backup-viewer/components/DeleteBackupFileButton.vue'

const props = defineProps<{
    connection: Connection,
    backupFile: ServerFile
}>()
const emit = defineEmits<{
    (e: 'filesUpdate'): void
    (e: 'tasksUpdate'): void
}>()
</script>

<template>
    <VListItem>
        <template #prepend>
            <VIcon>mdi-file-outline</VIcon>
        </template>

        <template #title>
            <BackupTitle :backup-file="backupFile" />
        </template>

        <template #append>
            <DeleteBackupFileButton
                :connection="connection"
                :backup-file="backupFile"
                @delete="emit('filesUpdate')"
            />
            <RestoreBackupFileButton
                :connection="connection"
                :backup-file="backupFile"
                @restore="emit('tasksUpdate')"
            />
            <DownloadBackupFileButton
                :connection="connection"
                :backup-file="backupFile"
            />
        </template>
    </VListItem>

</template>

<style lang="scss" scoped>

</style>
