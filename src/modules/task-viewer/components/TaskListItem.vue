<script setup lang="ts">
/**
 * Visualizes a single server task in list of tasks
 */

import { TaskState } from '@/modules/connection/model/task/TaskState'
import { TaskStatus } from '@/modules/connection/model/task/TaskStatus'
import { TaskViewerService, useTaskViewerService } from '@/modules/task-viewer/services/TaskViewerService'
import { Toaster, useToaster } from '@/modules/notification/service/Toaster'
import { useI18n } from 'vue-i18n'
import { Connection } from '@/modules/connection/model/Connection'
import { TaskTrait } from '@/modules/connection/model/task/TaskTrait'
import { FileTaskResult } from '@/modules/connection/model/task/FileTaskResult'
import { TextTaskResult } from '@/modules/connection/model/task/TextTaskResult'
import { computed, onUnmounted, ref } from 'vue'
import VDownloadServerFileButton from '@/modules/connection/component/VDownloadServerFileButton.vue'
import { taskStateToColorMapping } from '@/modules/task-viewer/model/taskStateToColorMapping'
import { fallbackTaskIcon, taskTypeToIconMapping } from '@/modules/task-viewer/model/taskTypeToIconMapping'
import TaskDetailDialog from '@/modules/task-viewer/components/TaskDetailDialog.vue'
import { Duration } from 'luxon'
import TaskExceptionDialog from '@/modules/task-viewer/components/TaskExceptionDialog.vue'
import TaskTextResultDialog from '@/modules/task-viewer/components/TaskTextResultDialog.vue'

const taskViewerService: TaskViewerService = useTaskViewerService()
const toaster: Toaster = useToaster()
const { t } = useI18n()

const props = defineProps<{
    connection: Connection
    task: TaskStatus
}>()

const showDetailsDialog = ref<boolean>(false)
const showResultTextDialog = ref<boolean>(false)
const showExceptionDialog = ref<boolean>(false)

const taskIcon = computed<string>(() => {
    const icon: string | undefined = taskTypeToIconMapping.get(props.task.taskType)
    if (icon != undefined) {
        return icon
    }
    return fallbackTaskIcon
})
const taskColor = computed<string | undefined>(() => {
    const color: string | undefined = taskStateToColorMapping.get(props.task.state)
    if (color != undefined && color.length > 0) {
        return color
    }
    return undefined
})
const taskDuration = ref<Duration | undefined>(props.task.elapsed)
const taskDurationRefreshId = setInterval(
    () => taskDuration.value = props.task.elapsed,
    1000
)

const indeterminateLoading = computed<boolean>(() => {
    if (props.task.state !== TaskState.Running) {
        return false
    }
    return !props.task.traits.contains(TaskTrait.CanBeCancelled) ||
        props.task.traits.contains(TaskTrait.NeedsToBeStopped)
})

const cancelling = ref<boolean>(false)
const canBeCancelled = computed<boolean>(() => {
    return (
            props.task.traits.contains(TaskTrait.CanBeCancelled) ||
            props.task.traits.contains(TaskTrait.NeedsToBeStopped)
        ) &&
        !props.task.isCancelRequested
})

async function cancelTask(): Promise<void> {
    cancelling.value = true
    try {
        const cancelled = await taskViewerService.cancelTask(props.connection, props.task.taskId)
        if (cancelled) {
            toaster.success(t(
                'taskViewer.tasksVisualizer.notification.taskCancelled',
                { taskName: props.task.taskName }
            ))
        } else {
            toaster.info(t(
                'taskViewer.tasksVisualizer.notification.taskNotCancelled',
                { taskName: props.task.taskName }
            ))
        }
        // visualize the cancel until the next full reload
        props.task.cancelRequested()
    } catch (e: any) {
        toaster.error(t(
            'taskViewer.tasksVisualizer.notification.couldNotCancelTask',
            {
                taskName: props.task.taskName,
                reason: e.message
            }
        ))
    }
    cancelling.value = false
}

function onCouldNotDownloadResultFile(e: Error): void {
    toaster.error(t(
        'taskViewer.tasksVisualizer.task.notification.couldNotDownloadResultFile',
        {
            taskName: props.task.taskName,
            reason: e.message
        }
    ))
}

onUnmounted(() => clearInterval(taskDurationRefreshId))
</script>

<template>
    <VListItem>
        <template #prepend>
            <VIcon>
                {{ taskIcon }}

                <VTooltip activator="parent">
                    {{ task.taskType }}
                </VTooltip>
            </VIcon>
        </template>

        <template #title>
            <div class="task-title">
                <span>{{ task.taskName }}</span>

                <!-- not using chip group because of https://github.com/vuetifyjs/vuetify/issues/19678 -->
                <div class="task-chips">
                    <VChip :color="taskColor">
                        {{ t(`taskViewer.tasksVisualizer.task.state.${task.state}`) }}
                    </VChip>

                    <VChip v-if="taskDuration != undefined">
                        {{ taskDuration.toHuman() }}
                    </VChip>
                </div>
            </div>
        </template>

        <template #append>
            <div class="task-actions">
                <VTooltip>
                    <template #activator="{ props }">
                        <VProgressLinear
                            v-if="task.state === TaskState.Running"
                            :indeterminate="indeterminateLoading"
                            :model-value="task.progress"
                            class="task-progress"
                            v-bind="props"
                        />
                    </template>
                    <template #default>
                        <template v-if="indeterminateLoading">
                            {{ t('taskViewer.tasksVisualizer.task.progress.indeterminate') }}
                        </template>
                        <template v-else>
                            {{ task.progress }}&nbsp;%
                        </template>
                    </template>
                </VTooltip>

                <div class="task-actions__buttons">
                    <VBtn
                        icon
                        @click="showDetailsDialog = true"
                    >
                        <VIcon>mdi-information-outline</VIcon>

                        <VTooltip activator="parent">
                            {{ t('taskViewer.tasksVisualizer.task.button.details') }}
                        </VTooltip>
                    </VBtn>
                    <template v-if="task.state === TaskState.Running">
                        <VBtn
                            v-if="canBeCancelled"
                            icon
                            :loading="cancelling"
                            @click="cancelTask"
                        >
                            <VIcon>mdi-close</VIcon>

                            <VTooltip activator="parent">
                                {{ t('taskViewer.tasksVisualizer.task.button.cancel') }}
                            </VTooltip>
                        </VBtn>
                    </template>
                    <template v-else-if="task.state === TaskState.Finished">
                        <VDownloadServerFileButton
                            v-if="task.result instanceof FileTaskResult"
                            :connection="connection"
                            :file="(task.result as FileTaskResult).value"
                            @error="onCouldNotDownloadResultFile($event)"
                        >
                            {{ t('taskViewer.tasksVisualizer.task.button.downloadFileResult') }}
                        </VDownloadServerFileButton>
                        <VBtn
                            v-else-if="task.result instanceof TextTaskResult"
                            icon
                            @click="showResultTextDialog = true"
                        >
                            <VIcon>mdi-file-document-outline</VIcon>

                            <VTooltip activator="parent">
                                {{ t('taskViewer.tasksVisualizer.task.button.textResult') }}
                            </VTooltip>
                        </VBtn>
                    </template>
                    <template v-else-if="task.state === TaskState.Failed">
                        <VBtn
                            icon
                            variant="text"
                            color="warning"
                            @click="showExceptionDialog = true"
                        >
                            <VIcon>mdi-alert-outline</VIcon>

                            <VTooltip activator="parent">
                                {{ t('taskViewer.tasksVisualizer.task.button.exception') }}
                            </VTooltip>
                        </VBtn>
                    </template>
                </div>
            </div>
        </template>

        <TaskDetailDialog
            v-if="showDetailsDialog"
            v-model="showDetailsDialog"
            :task="task"
        />
        <TaskTextResultDialog
            v-if="showResultTextDialog"
            v-model="showResultTextDialog"
            :result="task.result as TextTaskResult"
        />
        <TaskExceptionDialog
            v-if="showExceptionDialog"
            v-model="showExceptionDialog"
            :exception="task.exception || ''"
        />
    </VListItem>
</template>

<style lang="scss" scoped>
.task-title {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.task-chips {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.task-actions {
    display: flex;
    gap: 1rem;
    align-items: center;

    &__buttons {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
}

.task-progress {
    width: 10rem;
}
</style>
