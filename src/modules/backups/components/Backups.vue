<template>
    <div>
        <VTabToolbar prepend-icon="mdi mdi-cloud-download-outline" :path="path">
            <template #append>
                <VBtn
                    density="compact"
                    variant="outlined"
                    @click="changeVisibility"
                >
                    <VIcon>mdi mdi-cloud-download-outline</VIcon>
                </VBtn>
            </template>
        </VTabToolbar>
        <div v-if="!visibleAddBackup">
            <VList>
                <VListItem v-for="item in backupFiles?.filesToFetch" :key="item.fileId.code">
                    <VRow class="align-center">
                        <VCol>
                            <div class="d-flex align-center">
                                <VListItemTitle
                                    >{{ item.name }}</VListItemTitle
                                >
                                <VChip
                                    color="grey"
                                    text-color="white"
                                    class="ml-2 small-chip"
                                    v-if="item.created"
                                    >finished</VChip
                                >
                                <VChip
                                    color="amber"
                                    text-color="white"
                                    class="ml-2 small-chip"
                                    v-else
                                    >backing up</VChip
                                >
                            </div>
                        </VCol>
                        <VCol class="d-flex justify-end" cols="auto" v-if="item.created">
                            <VBtn icon variant="flat">
                                <VIcon>mdi-download</VIcon>
                            </VBtn>
                            <VBtn icon variant="flat">
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
                <!--
                <VListItem>
                    <VRow  class="align-center">
                        <VCol>
                            <div class="d-flex align-center">
                                <VListItemTitle
                                    >evita-2024-06-11T12:22:30</VListItemTitle
                                >
                                <VChip
                                    color="grey"
                                    text-color="white"
                                    class="ml-2 small-chip"
                                    >finished</VChip
                                >
                            </div>
                        </VCol>
                        <VCol class="d-flex justify-end" cols="auto">
                            <VBtn icon class="v-btn--icon--round">
                                <VIcon>mdi-download</VIcon>
                            </VBtn>
                            <VBtn icon class="v-btn--icon--round">
                                <VIcon>mdi-rotate-right</VIcon>
                            </VBtn>
                        </VCol>
                    </VRow>
                </VListItem> 
            -->
            </VList>
            <VPagination :rounded="true" :length="Math.ceil(backupFiles?.totalNumberOfRecords! / pageSize)"></VPagination>
        </div>
        <VDialog v-model="visibleAddBackup" class="w-25" v-else>
            <VCard>
                <VCardTitleWithActions>
                    <template #default>
                        {{
                            t('backups.createDialog.titleFirst') +
                            `"${props.params.catalogName}"` +
                            t('backups.createDialog.titleSecond')
                        }}
                    </template>
                </VCardTitleWithActions>
                <VCardText>
                    <VDateInput
                        v-model="selectedDate"
                        :min="minimalDate?.toString()"
                        :max="new Date().toISOString()"
                    />
                    <VCheckbox
                        label="Include WAL"
                        messages="Will apply all mutations from WAL during restoration resulting in the latest version of catalog"
                    />
                    <VAlert
                        type="info"
                        icon="mdi-information-outline"
                        :text="t('backups.createDialog.information')"
                        class="mt-4"
                    />
                    <div class="mt-4 buttons">
                        <VBtn
                            variant="elevated"
                            :text="t('common.button.cancel')"
                            @click="changeVisibility"
                        ></VBtn>
                        <VBtn variant="outlined" @click="backup">
                            <VIcon>mdi-cloud-download-outline</VIcon>
                            {{ t('common.button.backup') }}
                        </VBtn>
                    </div>
                </VCardText>
            </VCard>
        </VDialog>
    </div>
</template>

<script setup lang="ts">
import VCardTitleWithActions from '@/modules/base/component/VCardTitleWithActions.vue'
import VTabToolbar from '@/modules/base/component/VTabToolbar.vue'
import { TabComponentEvents } from '@/modules/workspace/tab/model/TabComponentEvents'
import { List } from 'immutable'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
    VAlert,
    VBtn,
    VCard,
    VCardText,
    VCheckbox,
    VDialog,
    VIcon,
    VList,
} from 'vuetify/lib/components/index.mjs'
import { VDateInput } from 'vuetify/lib/labs/components.mjs'
import { BackupTabParams } from '../model/BackupsTabParams'
import { TabComponentProps } from '@/modules/workspace/tab/model/TabComponentProps'
import { VoidTabData } from '@/modules/workspace/tab/model/void/VoidTabData'
import { BackupsService, useBackupsService } from '../service/BackupsService'
import { OffsetDateTime } from '@/modules/connection/model/data-type/OffsetDateTime'
import { DateTime } from 'luxon'
import { Timestamp } from '@bufbuild/protobuf'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { FilesToFetch } from '@/modules/connection/model/data/FilesToFetch'

const emit = defineEmits<TabComponentEvents>()
const props = defineProps<TabComponentProps<BackupTabParams, VoidTabData>>()
const { t } = useI18n()
const backupService: BackupsService = useBackupsService()

const path: List<string> = List([t('backups.path')])
const visibleAddBackup = ref<boolean>(false)
const minimalDateLoaded = ref<boolean>(false)
const minimalDate = ref<OffsetDateTime>()
const backupFilesLoaded = ref<boolean>(false)
const backupFiles = ref<FilesToFetch>()
const selectedDate = ref<string>()
const includingWAL = ref<boolean>(false)
const pageNumber = ref<number>(1)
const pageSize = ref<number>(50)

getMinimalDate().then(() => checkAllDataLoaded())
getAllBackupFiles().then(() => checkAllDataLoaded())

function changeVisibility(): void {
    visibleAddBackup.value = !visibleAddBackup.value
}

async function getMinimalDate(): Promise<void> {
    const minimalDateResponse = await backupService.getMinimalBackupDate(
        props.params.connection,
        props.params.catalogName
    )
    minimalDate.value = minimalDateResponse.introducedAt
    minimalDateLoaded.value = true
}

async function getAllBackupFiles() {
    const files = await backupService.getAllBackups(
        props.params.connection,
        pageNumber.value,
        pageSize.value
    )
    backupFiles.value = files
    backupFilesLoaded.value = true
}

async function backup(): Promise<void> {
    const jsDate = new Date(selectedDate.value!)
    const offsetDateTime = DateTime.fromJSDate(jsDate)
    const timestamp = Timestamp.fromDate(jsDate)
    const result = await backupService.backupCatalog(
        props.params.connection,
        props.params.catalogName,
        includingWAL.value,
        new OffsetDateTime(timestamp, offsetDateTime.toFormat('ZZ'))
    )
    if (!result.exception)  {
        await getAllBackupFiles()
        changeVisibility() 
    }
    else throw new UnexpectedError(result.exception)
}

function checkAllDataLoaded(): void {
    if (backupFilesLoaded.value && minimalDateLoaded.value) emit('ready')
}
</script>

<style scoped>
.buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>
