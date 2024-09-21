import { TabDefinition } from '@/modules/workspace/tab/model/TabDefinition'
import { VoidTabData } from '@/modules/workspace/tab/model/void/VoidTabData'
import { DefineComponent, markRaw } from 'vue'
import { JobTabParams } from '@/modules/jobs/model/JobTabParams'
import JobsControl from '@/modules/jobs/components/JobsControl.vue'

export class JobDefinition extends TabDefinition<JobTabParams, VoidTabData> {
    constructor(title: string, params: JobTabParams) {
        super(undefined, title, 'mdi-chart-gantt', markRaw(JobsControl as DefineComponent<any, any, any>), params, new VoidTabData())
    }
}
