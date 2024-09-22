<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { TabComponentProps } from '@/modules/workspace/tab/model/TabComponentProps'
import { TaskViewerTabParams } from '@/modules/task-viewer/model/TaskViewerTabParams'
import { VoidTabData } from '@/modules/workspace/tab/model/void/VoidTabData'
import { List } from 'immutable'
import { TabComponentEvents } from '@/modules/workspace/tab/model/TabComponentEvents'
import TasksVisualizer from '@/modules/task-viewer/components/TasksVisualizer.vue'
import VTabToolbar from '@/modules/base/component/VTabToolbar.vue'

const { t } = useI18n()

const props = defineProps<TabComponentProps<TaskViewerTabParams, VoidTabData>>()
const emit = defineEmits<TabComponentEvents>()

const path: List<string> = List([t('taskViewer.path')])
emit('ready')

</script>

<template>
    <div class="task-viewer">
        <VTabToolbar :prepend-icon="'mdi-chart-gantt'" :path="path"/>

        <TasksVisualizer :connection="props.params.connection" />
    </div>
</template>

<style scoped>
.task-viewer {
    display: grid;
    grid-template-rows: 3rem 1fr;

    &__body {
        position: relative;
    }
}
</style>
