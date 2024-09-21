<template>
    <div>
        <VList>
            <VListItem v-for="item in jobs" :key="item.taskId.code">
                <VRow class="align-center">
                    <VCol>
                        <div class="d-flex align-center">
                            <div
                                :class="[
                                    'circle',
                                    item.progress < 100 ? 'processing' : 'done',
                                ]"
                            ></div>
                            <template v-if="item.taskType === 'BackupTask'">
                                <VIcon
                                    class="mx-4"
                                    icon="mdi-cloud-download-outline"
                                ></VIcon>
                            </template>
                            <template
                                v-else-if="item.taskType === 'JfrRecorderTask'"
                            >
                                <VIcon
                                    class="mx-4"
                                    icon="mdi-chart-timeline"
                                ></VIcon>
                            </template>
                            <template
                                v-else-if="item.taskType === 'MetricTask'"
                            >
                                <VIcon
                                    class="mx-4"
                                    icon="mdi-folder-information-outline"
                                ></VIcon>
                            </template>
                            <VListItemTitle>{{ item.taskName }}</VListItemTitle>
                        </div>
                    </VCol>
                    <VCol
                        class="d-flex justify-end"
                        cols="auto"
                        v-if="item.started"
                    >
                        <div class="linear-progress-container">
                            <VProgressLinear
                                bg-color="blue-grey"
                                color="lime"
                                :model-value="item.progress"
                            ></VProgressLinear>
                        </div>
                        <VBtn
                            icon
                            variant="flat"
                            @click="cancelTask(item.taskId, item.taskType)"
                            v-if="item.progress < 100"
                        >
                            <VIcon @click="cancelTask(item.taskId, item.taskType)"
                                >mdi-window-close</VIcon
                            >
                        </VBtn>
                        <VBtn icon variant="flat" disabled v-else>
                            <VIcon>mdi-check</VIcon>
                        </VBtn>
                    </VCol>
                    <VCol class="d-flex justify-end" cols="auto" v-else>
                        <div class="circular-progress-container">
                            <VProgressCircular
                                color="white"
                                class="circular-progress"
                                indeterminate
                            />
                        </div>
                        <VBtn
                            icon
                            variant="flat"
                            @click="cancelTask(item.taskId, item.taskType)"
                        >
                            <VIcon @click="cancelTask(item.taskId, item.taskType)">mdi-window-close</VIcon>
                        </VBtn>
                    </VCol>
                </VRow>
            </VListItem>
        </VList>
        <VPagination
            v-if="
                taskStatuses?.totalNumberOfRecords &&
                Math.ceil(taskStatuses?.totalNumberOfRecords / pageSize) > 1
            "
            :rounded="true"
            @update:model-value="(x) => (pageNumber = x)"
            :length="Math.ceil(taskStatuses?.totalNumberOfRecords! / pageSize)"
        >
        </VPagination>
    </div>
</template>

<script setup lang="ts">
import { Connection } from '@/modules/connection/model/Connection'
import { JobService, useJobService } from '../services/JobService'
import { ref } from 'vue'
import { TaskStatuses } from '@/modules/connection/model/data/TaskStatuses'
import { TaskSimplifiedState } from '@/modules/connection/model/data/TaskSimplifiedState'
import { Uuid } from '@/modules/connection/model/data-type/Uuid'
import { TaskStatus } from '@/modules/connection/model/data/TaskStatus'
import { onUnmounted } from 'vue'

const jobService: JobService = useJobService()
const props = defineProps<{
    connection: Connection
    simplifiedState?: TaskSimplifiedState[]
    taskType?: string
}>()
const emit = defineEmits<{
    (e: 'taskEnded', taskId: string): void,
    (e: 'stopJfr'):void
}>()

const pageNumber = ref<number>(1)
const pageSize = ref<number>(5)
const taskStatuses = ref<TaskStatuses>()
const jobs = ref<TaskStatus[]>()
const loadedTaskStatuses = ref<boolean>()

getJobs().then()

async function getJobs() {
    const newJobs = await jobService.getJobs(
        props.connection,
        pageNumber.value,
        pageSize.value,
        props.simplifiedState,
        props.taskType
    )
    const endedJobs = newJobs.taskStatus.filter(
        (x) =>
            !taskStatuses.value?.taskStatus.some(
                (y) => y.taskId.code === x.taskId.code
            )
    )
    for (const job of endedJobs) {
        emit('taskEnded', job.taskId.code)
    }
    if (newJobs.pageNumber > 1 && taskStatuses.value?.taskStatus.size === 0) {
        pageNumber.value--
    }
    taskStatuses.value = newJobs
    jobs.value = newJobs.taskStatus.toArray()
    loadedTaskStatuses.value = true
}

async function cancelTask(jobId: Uuid, taskType: string) {
    if (taskType === '') {
        const result = await jobService.cancelJob(props.connection, jobId)
        if (result) {
            jobs.value = taskStatuses.value?.taskStatus
                .filter((x) => x.taskId.code === jobId.code)
                .toArray()
        }
    } else {
        emit('stopJfr')
    }
}

const jobIntervalId = setInterval(getJobs, 100)

onUnmounted(() => {
    clearInterval(jobIntervalId)
})
</script>

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
