<template>
    <VDialog v-model="visibleAddBackup" class="w-25" @update:model-value="isExit">
        <VCard>
            <VCardTitleWithActions>
                <template #default>
                    {{
                        t('backups.createDialog.titleFirst') +
                        `"${catalogName}"` +
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
                        @click="exit()"
                    ></VBtn>
                    <VBtn variant="outlined" @click="backup">
                        <VIcon>mdi-cloud-download-outline</VIcon>
                        {{ t('common.button.backup') }}
                    </VBtn>
                </div>
            </VCardText>
        </VCard>
    </VDialog>
</template>

<script setup lang="ts">
import VCardTitleWithActions from '@/modules/base/component/VCardTitleWithActions.vue'
import { OffsetDateTime } from '@/modules/connection/model/data-type/OffsetDateTime'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { VDateInput } from 'vuetify/lib/labs/components.mjs'

const { t } = useI18n()

const visibleAddBackup = ref<boolean>(true)
const selectedDate = ref<string>()
const props = defineProps<{
    catalogName: string
    minimalDate: OffsetDateTime
}>()
const emit = defineEmits<{
    (e: 'exit'): void
    (e: 'backup', date: string): void
}>()

function exit():void {
    emit('exit')
}

function backup():void {
    if (selectedDate.value) emit('backup', selectedDate.value!)
}

function isExit(visible: boolean):void{
    if(!visible){
        emit('exit')
    }
}
</script>

<style scoped>
.buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>
