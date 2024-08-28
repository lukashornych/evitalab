<template>
    <div>
        <VList>
            <VListItem
                v-for="item in taskStatuses?.taskStatus"
                :key="item.taskId.code"
            >
                <VRow class="align-center">
                    <VCol>
                        <div class="d-flex align-center">
                            <template>
                                <VIcon>mdi-cloud-arrow-down-outline</VIcon>
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
                        <VBtn icon variant="flat">
                            <VIcon>mdi-window-close</VIcon>
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
                        <VBtn icon variant="flat">
                            <VIcon>mdi-window-close</VIcon>
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
import { useJobService } from '../services/JobService'
import { ref } from 'vue'
import { TaskStatuses } from '@/modules/connection/model/data/TaskStatuses'
import { TaskSimplifiedState } from '@/modules/connection/model/data/TaskSimplifiedState'

const jobService = useJobService()
const props = defineProps<{
    connection: Connection
    simplifiedState?: TaskSimplifiedState[]
    taskType?: string
}>()
const emit = defineEmits<{
    (e: 'taskEnded', taskId: string): void
}>()

const pageNumber = ref<number>(1)
const pageSize = ref<number>(5)
const taskStatuses = ref<TaskStatuses>()
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
    loadedTaskStatuses.value = true
}

setInterval(getJobs, 100)
</script>

<style scoped>
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
</style>
