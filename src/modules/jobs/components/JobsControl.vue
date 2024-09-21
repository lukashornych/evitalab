<template>
    <TabWindowBody :path="path" :visible-button="false" icon="mdi-chart-gantt">
        <JobVisualizer :connection="props.params.connection" />
    </TabWindowBody>
</template>

<script setup lang="ts">
import TabWindowBody from '@/modules/global/components/TabWindowBody.vue'
import { useI18n } from 'vue-i18n'
import { TabComponentProps } from '@/modules/workspace/tab/model/TabComponentProps'
import { JobTabParams } from '@/modules/jobs/model/JobTabParams'
import { VoidTabData } from '@/modules/workspace/tab/model/void/VoidTabData'
import { List } from 'immutable'
import JobVisualizer from '@/modules/jobs/components/JobVisualizer.vue'
import { TabComponentEvents } from '@/modules/workspace/tab/model/TabComponentEvents'

const { t } = useI18n()

const props = defineProps<TabComponentProps<JobTabParams, VoidTabData>>()
const emit = defineEmits<TabComponentEvents>()


const path: List<string> = List([t('jobs.path')])
emit('ready')

</script>

<style scoped>

</style>
