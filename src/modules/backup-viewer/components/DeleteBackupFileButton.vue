<script setup lang="ts">

import { Connection } from '@/modules/connection/model/Connection'
import { ServerFile } from '@/modules/connection/model/server-file/ServerFile'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import DeleteBackupFileDialog from '@/modules/backup-viewer/components/DeleteBackupFileDialog.vue'

const { t } = useI18n()

const props = defineProps<{
    connection: Connection
    backupFile: ServerFile
}>()
const emit = defineEmits<{
    (e: 'delete'): void
}>()

const showDeleteDialog = ref<boolean>(false)
</script>

<template>
    <DeleteBackupFileDialog
        v-model="showDeleteDialog"
        :connection="connection"
        :backup-file="backupFile"
        @delete="emit('delete')"
    >
        <template #activator="{ props }">
            <VBtn
                icon
                @click="showDeleteDialog = true"
                v-bind="props"
            >
                <VIcon>mdi-delete-outline</VIcon>

                <VTooltip activator="parent">
                    {{ t('backupViewer.list.backup.button.deleteBackupFile') }}
                </VTooltip>
            </VBtn>
        </template>
    </DeleteBackupFileDialog>
</template>

<style lang="scss" scoped>

</style>
