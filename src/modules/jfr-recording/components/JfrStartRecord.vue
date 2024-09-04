<template>
    <VDialog v-model="visible" class="w-50">
        <VCard>
            <VCardTitleWithActions>
                <template #default>
                    {{ t('jfr.startRecordingDialog.title') }}
                </template>
            </VCardTitleWithActions>
            <VCardText>
                <VCombobox
                    v-model="selectedTypes"
                    :items="eventTypes"
                    item-title="name"
                    multiple
                    chips
                >
                </VCombobox>
                <div class="mt-4 buttons">
                    <VBtn
                        variant="elevated"
                        :text="t('common.button.cancel')"
                        @click="close"
                    ></VBtn>
                    <VBtn variant="outlined" @click="startRecording">
                        <VIcon>mdi-record-circle-outline</VIcon>
                        {{ t('common.button.startRecording') }}
                    </VBtn>
                </div>
            </VCardText>
        </VCard>
    </VDialog>
</template>

<script setup lang="ts">
import VCardTitleWithActions from '@/modules/base/component/VCardTitleWithActions.vue'
import { JfrService } from '../service/JfrService'
import { useI18n } from 'vue-i18n'
import { Connection } from '@/modules/connection/model/Connection'
import { EventType } from '@/modules/connection/model/data/EventType'
import { ref } from 'vue'

const { t } = useI18n()

const visible = ref<boolean>(true)
const eventTypes = ref<EventType[]>()
const selectedTypes = ref<EventType[]>()

const props = defineProps<{
    jfrService: JfrService
    connection: Connection
}>()

const emit = defineEmits<{
    (e: 'exit'): void
}>()

getRecordingEventTypes().then()

async function getRecordingEventTypes() {
    eventTypes.value = await props.jfrService.downloadRecordingEventTypes(
        props.connection
    )
    selectedTypes.value = eventTypes.value
}

function close() {
    emit('exit')
}

async function startRecording() {
    const res = await props.jfrService.startRecording(
        props.connection,
        selectedTypes.value!.map((x) => x.id)
    )
    if (res) emit('exit')
}
</script>

<style scoped lang="scss">
.buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>
