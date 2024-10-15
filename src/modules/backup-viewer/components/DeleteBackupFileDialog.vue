<script setup lang="ts">

import VFormDialog from '@/modules/base/component/VFormDialog.vue'
import { ServerFile } from '@/modules/connection/model/server-file/ServerFile'
import { useI18n } from 'vue-i18n'
import { BackupViewerService, useBackupViewerService } from '@/modules/backup-viewer/service/BackupViewerService'
import { Connection } from '@/modules/connection/model/Connection'
import { Toaster, useToaster } from '@/modules/notification/service/Toaster'

const backupViewerService: BackupViewerService = useBackupViewerService()
const toaster: Toaster = useToaster()
const { t } = useI18n()

const props = defineProps<{
    modelValue: boolean,
    connection: Connection
    backupFile: ServerFile
}>()
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'delete'): void
}>()

async function deleteBackupFile(): Promise<boolean> {
    try {
        const deleted: boolean = await backupViewerService.deleteBackup(
            props.connection,
            props.backupFile.fileId
        )
        if (deleted) {
            toaster.success(t(
                'backupViewer.delete.notification.fileDeleted',
                { fileName: props.backupFile.name }
            ))
        } else {
            toaster.info(t(
                'backupViewer.delete.notification.fileNotDeleted',
                { fileName: props.backupFile.name }
            ))
        }
        emit('delete')
        return true
    } catch (e: any) {
        toaster.error(t(
            'backupViewer.delete.notification.couldNotDeleteFile',
            {
                fileName: props.backupFile.name,
                reason: e.message
            }
        ))
        return false
    }
}
</script>

<template>
    <VFormDialog
        :model-value="modelValue"
        dangerous
        changed
        confirm-button-icon="mdi-delete-outline"
        :confirm="deleteBackupFile"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <template #activator="{ props }">
            <slot name="activator" v-bind="{ props }"/>
        </template>

        <template #title>
            <I18nT keypath="backupViewer.delete.title">
                <template #fileName>
                    {{ backupFile.name }}
                </template>
            </I18nT>
        </template>

        <template #prepend-form>
            {{ t('backupViewer.delete.question') }}
        </template>

        <template #confirm-button-body>
            {{ t('common.button.delete') }}
        </template>
    </VFormDialog>
</template>

<style lang="scss" scoped>

</style>
