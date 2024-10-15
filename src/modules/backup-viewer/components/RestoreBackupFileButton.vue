<script setup lang="ts">

import { ServerFile } from '@/modules/connection/model/server-file/ServerFile'
import RestoreBackupDialog from '@/modules/backup-viewer/components/RestoreBackupDialog.vue'
import { ref } from 'vue'
import { Connection } from '@/modules/connection/model/Connection'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
    connection: Connection
    backupFile: ServerFile
}>()
const emit = defineEmits<{
    (e: 'restore'): void
}>()

const showRestoreDialog = ref<boolean>(false)
</script>

<template>
    <RestoreBackupDialog
        v-model="showRestoreDialog"
        :connection="connection"
        :backup-file="backupFile"
        @restore="emit('restore')"
    >
        <template #activator="{ props }">
            <VBtn
                icon
                @click="showRestoreDialog = true"
                v-bind="props"
            >
                <VIcon>mdi-cloud-upload-outline</VIcon>

                <VTooltip activator="parent">
                    {{ t('backupViewer.list.backup.button.restoreBackupFile') }}
                </VTooltip>
            </VBtn>
        </template>
    </RestoreBackupDialog>
</template>

<style lang="scss" scoped>

</style>
