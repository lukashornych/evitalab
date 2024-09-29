<script setup lang="ts">
import { OffsetDateTime } from '@/modules/connection/model/data-type/OffsetDateTime'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import VFormDialog from '@/modules/base/component/VFormDialog.vue'
import { DateTime } from 'luxon'
import { Timestamp } from '@bufbuild/protobuf'
import { BackupViewerService, useBackupViewerService } from '@/modules/backup-viewer/service/BackupViewerService'
import { Connection } from '@/modules/connection/model/Connection'
import { Toaster, useToaster } from '@/modules/notification/service/Toaster'
import { CatalogVersionAtResponse } from '@/modules/connection/model/CatalogVersionAtResponse'

const backupViewerService: BackupViewerService = useBackupViewerService()
const toaster: Toaster = useToaster()
const { t } = useI18n()

const props = defineProps<{
    modelValue: boolean,
    connection: Connection,
    catalogName: string
}>()
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void,
    (e: 'backup', date: string): void
}>()

const pastMomentRules = [
    (value: any): any => {
        if (value != undefined && value.trim().length > 0) return true
        return t('backupViewer.backup.form.pastMoment.validations.required')
    }
]

const minimalDate = ref<string | undefined>()
const minimalDateLoaded = ref<boolean>(false)

const pastMoment = ref<string>()
const includeWal = ref<boolean>(false)
const changed = computed<boolean>(() => pastMoment.value != undefined)

async function loadMinimalDate(): Promise<CatalogVersionAtResponse> {
    return await backupViewerService.getMinimalBackupDate(
        props.connection,
        props.catalogName
    )
}

function reset(): void {
    pastMoment.value = ''
    includeWal.value = false
}

async function backup(): Promise<boolean> {
    try {
        // todo lho simplify
        // todo lho verify date data type
        const jsDate = new Date(pastMoment.value!)
        const offsetDateTime: DateTime = DateTime.fromJSDate(jsDate)
        const timestamp: Timestamp = Timestamp.fromDate(jsDate)

        await backupViewerService.backupCatalog(
            props.connection,
            props.catalogName,
            includeWal.value,
            new OffsetDateTime(timestamp, offsetDateTime.toFormat('ZZ'))
        )
        toaster.success(t(
            'backupViewer.backup.notification.backupRequested',
            { catalogName: props.catalogName }
        ))
        return true
    } catch (e: any) {
        toaster.error(t(
            'backupViewer.backup.notification.couldNotRequestBackup',
            {
                catalogName: props.catalogName,
                reason: e.message
            }
        ))
        return false
    }
}

loadMinimalDate().then((catalogVersionAt) => {
    minimalDate.value = catalogVersionAt.introducedAt.toString()
    minimalDateLoaded.value = true
})
</script>

<template>
    <VFormDialog
        :model-value="modelValue"
        :changed="changed"
        confirm-button-icon="mdi-cloud-download-outline"
        :confirm="backup"
        :reset="reset"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <template #title>
            <I18nT keypath="backupViewer.backup.title">
                <template #catalogName>
                    <strong>{{ catalogName }}</strong>
                </template>
            </I18nT>
        </template>

        <template #prepend-form>
            {{ t('backupViewer.backup.description') }}
        </template>

        <template #default>
            <VDateInput
                v-model="pastMoment"
                :label="t('backupViewer.backup.form.pastMoment.label')"
                :disabled="!minimalDateLoaded"
                :min="minimalDate"
                :max="new Date().toISOString()"
                :rules="pastMomentRules"
            />
            <VCheckbox
                v-model="includeWal"
                :label="t('backupViewer.backup.form.includeWal.label')"
                :messages="t('backupViewer.backup.form.includeWal.description')"
            />
        </template>

        <template #append-form>
            <VAlert type="info" icon="mdi-information-outline">
                {{ t('backupViewer.backup.info') }}
            </VAlert>
        </template>

        <template #confirm-button-body>
            {{ t('backupViewer.backup.button.backup') }}
        </template>
    </VFormDialog>
</template>

<style scoped>

</style>
