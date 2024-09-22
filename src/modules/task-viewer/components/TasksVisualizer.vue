<script setup lang="ts">
import { Connection } from '@/modules/connection/model/Connection'
import { TaskViewerService, useTaskViewerService } from '../services/TaskViewerService'
import { computed, ref, watch } from 'vue'
import { onUnmounted } from 'vue'
import { TaskState } from '@/modules/connection/model/task/TaskState'
import { TaskStatuses } from '@/modules/connection/model/task/TaskStatuses'
import { TaskStatus } from '@/modules/connection/model/task/TaskStatus'
import { Toaster, useToaster } from '@/modules/notification/service/Toaster'
import { useI18n } from 'vue-i18n'

const taskViewerService: TaskViewerService = useTaskViewerService()
const toaster: Toaster = useToaster()
const { t } = useI18n()

const props = withDefaults(
    defineProps<{
        subheader?: string,
        connection: Connection
        states?: TaskState[]
        taskType?: string,
        pageSize?: number,
        hideablePagination?: boolean,
    }>(),
    {
        pageSize: 20,
        hideablePagination: false
    }
)
const emit = defineEmits<{
    (e: 'update:activeJobsPresent', value: boolean): void
}>()

const tasksReloadIntervalId = setInterval(loadTaskStatuses, 2000)

onUnmounted(() => {
    clearInterval(tasksReloadIntervalId)
})

const pageNumber = ref<number>(1)
const pageCount = computed<number>(() => {
    if (taskStatuses.value == undefined) {
        return 1
    }
    return Math.ceil(taskStatuses.value.totalNumberOfRecords / props.pageSize)
})
const taskStatuses = ref<TaskStatuses>()
const taskStatusesItems = computed<TaskStatus[]>(() => {
    if (taskStatuses.value == undefined) {
        return []
    }
    return taskStatuses.value.statuses.toArray()
})
const loadedTaskStatuses = ref<boolean>(false)
const shouldDisplayPagination = computed<boolean>(() => {
    if (!props.hideablePagination) {
        return true
    }
    if (taskStatuses.value == undefined) {
        return false
    }
    return taskStatuses.value.totalNumberOfRecords > props.pageSize
})

watch(pageNumber, async () => {
    await loadTaskStatuses()
})
watch(taskStatusesItems, async (newValue) => {
    if (newValue != undefined && newValue.length > 0) {
        emit('update:activeJobsPresent', true)
    } else {
        emit('update:activeJobsPresent', false)
    }
})

loadTaskStatuses().then()

async function loadTaskStatuses(): Promise<void> {
    try {
        const fetchedTaskStatuses: TaskStatuses = await taskViewerService.getTaskStates(
            props.connection,
            pageNumber.value,
            props.pageSize,
            props.states,
            props.taskType
        )
        taskStatuses.value = fetchedTaskStatuses

        if (fetchedTaskStatuses.pageNumber > 1 && taskStatuses.value?.statuses.size === 0) {
            pageNumber.value--
        }
        if (!loadedTaskStatuses.value) {
            loadedTaskStatuses.value = true
        }
    } catch (e: any) {
        toaster.error(t('taskViewer.tasksVisualizer.notification.couldNotLoadTaskStatuses'))
    }
}

async function cancelTask(taskStatus: TaskStatus): Promise<void> {
    try {
        const cancelled = await taskViewerService.cancelTask(props.connection, taskStatus.taskId)
        if (cancelled) {
            toaster.success(t(
                'taskViewer.tasksVisualizer.notification.taskCancelled',
                { taskName: taskStatus.taskName }
            ))
        } else {
            toaster.info(t(
                'taskViewer.tasksVisualizer.notification.taskNotCancelled',
                { taskName: taskStatus.taskName }
            ))
        }
        // visualize the cancel until the next full reload
        taskStatus.cancelRequested()
    } catch (e: any) {
        toaster.error(t(
            'taskViewer.tasksVisualizer.notification.couldNotCancelTask',
            {
                taskName: taskStatus.taskName,
                reason: e.message
            }
        ))
    }
}
</script>

<template>
    <VList v-if="loadedTaskStatuses">
        <VListSubheader v-if="subheader !== undefined && subheader.length > 0">
            {{ subheader }}
        </VListSubheader>

        <VDataIterator
            :items="taskStatusesItems"
            :page="pageNumber"
            :items-per-page="pageSize"
        >
            <template #default="{ items }">
                <VListItem v-for="item in items" :key="item.raw.taskId.code">
                    <VRow class="align-center">
                        <VCol>
                            <div class="d-flex align-center">
                                <div
                                    :class="[
                                'circle',
                                item.raw.progress < 100 ? 'processing' : 'done',
                            ]"
                                ></div>
                                <template v-if="item.raw.taskType === 'BackupTask'">
                                    <VIcon
                                        class="mx-4"
                                        icon="mdi-cloud-download-outline"
                                    ></VIcon>
                                </template>
                                <template
                                    v-else-if="item.raw.taskType === 'JfrRecorderTask'"
                                >
                                    <VIcon
                                        class="mx-4"
                                        icon="mdi-chart-timeline"
                                    ></VIcon>
                                </template>
                                <template
                                    v-else-if="item.raw.taskType === 'MetricTask'"
                                >
                                    <VIcon
                                        class="mx-4"
                                        icon="mdi-folder-information-outline"
                                    ></VIcon>
                                </template>
                                <VListItemTitle>{{ item.raw.taskName }}</VListItemTitle>
                            </div>
                        </VCol>
                        <VCol
                            v-if="item.raw.started"
                            class="d-flex justify-end"
                            cols="auto"
                        >
                            <div class="linear-progress-container">
                                <VProgressLinear
                                    v-if="item.raw.state == TaskState.Running"
                                    :model-value="item.raw.progress"
                                    bg-color="blue-grey"
                                    color="lime"
                                />
                            </div>
                            <slot
                                v-if="item.raw.progress < 100"
                                name="cancel-action"
                                :task-status="item.raw"
                            >
                                <VBtn
                                    v-if="item.raw.progress < 100"
                                    icon="mdi-cancel"
                                    variant="flat"
                                    @click="cancelTask(item.raw)"
                                />
                            </slot>
                            <VBtn v-else icon="mdi-check" density="compact" variant="flat" disabled />
                        </VCol>
                        <VCol class="d-flex justify-end" cols="auto" v-else>
                            <div class="circular-progress-container">
                                <VProgressCircular
                                    color="white"
                                    class="circular-progress"
                                    indeterminate
                                />
                            </div>
                            <slot
                                name="cancel-action"
                                :task-status="item.raw"
                            >
                                <VBtn
                                    icon="mdi-cancel"
                                    density="compact"
                                    variant="flat"
                                    @click="cancelTask(item.raw)"
                                />
                            </slot>
                        </VCol>
                    </VRow>
                </VListItem>
            </template>

            <template #footer>
                <VPagination
                    v-if="shouldDisplayPagination"
                    v-model="pageNumber"
                    :length="pageCount"
                />
            </template>
        </VDataIterator>
    </VList>
</template>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.linear-progress-container {
    width: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.circular-progress-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.circular-progress {
    height: 24px;
    width: 24px;
}

.done {
    background-color: $success;
}

.processing {
    background-color: $warning;
}

.circle {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 8px;
    border-radius: 50%;
}
.white-space {
}
</style>
