<script setup lang="ts">

import { TaskStatus } from '@/modules/connection/model/task/TaskStatus'
import { computed } from 'vue'
import { fallbackTaskIcon, taskTypeToIconMapping } from '@/modules/task-viewer/model/taskTypeToIconMapping'

const props = defineProps<{
    task: TaskStatus
}>()

const taskIcon = computed<string>(() => {
    const icon: string | undefined = taskTypeToIconMapping.get(props.task.taskType)
    if (icon != undefined) {
        return icon
    }
    return fallbackTaskIcon
})
</script>

<template>
    <VIcon>
        {{ taskIcon }}

        <VTooltip activator="parent">
            {{ task.taskType }}
        </VTooltip>
    </VIcon>
</template>

<style lang="scss" scoped>

</style>
