<script setup lang="ts">

import { TaskState } from '@/modules/connection/model/task/TaskState'
import { ref } from 'vue'
import { Connection } from '@/modules/connection/model/Connection'
import EndRecordingDialog from '@/modules/jfr-viewer/components/EndRecordingDialog.vue'
import { useI18n } from 'vue-i18n'
import { TaskStatus } from '@/modules/connection/model/task/TaskStatus'

const { t } = useI18n()

const props = defineProps<{
    connection: Connection,
    task: TaskStatus
}>()
const emit = defineEmits<{
    (e: 'end'): void
}>()

const showEndRecordingDialog = ref<boolean>(false)
</script>

<template>
    <EndRecordingDialog
        v-model="showEndRecordingDialog"
        :connection="connection"
        @end="emit('end')"
    >
        <template #activator="{ props }">
            <VBtn
                v-if="task.state === TaskState.Running"
                icon
                @click="showEndRecordingDialog = true"
                v-bind="props"
            >
                <VIcon>mdi-stop-circle-outline</VIcon>
                <VTooltip activator="parent">
                    {{ t('jfrViewer.tasks.button.stopRecording') }}
                </VTooltip>
            </VBtn>
        </template>
    </EndRecordingDialog>
</template>

<style lang="scss" scoped>

</style>
