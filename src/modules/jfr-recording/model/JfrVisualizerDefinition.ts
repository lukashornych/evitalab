import { TabDefinition } from "@/modules/workspace/tab/model/TabDefinition";
import { VoidTabData } from '@/modules/workspace/tab/model/void/VoidTabData'
import { JfrVisualizerTabParams } from '@/modules/jfr-recording/model/JfrVisualizerTabParams'
import { DefineComponent, markRaw } from 'vue'
import JfrVisualizer from '@/modules/jfr-recording/components/JfrVisualizer.vue'

export class JfrVisualizerDefinition extends TabDefinition<JfrVisualizerTabParams, VoidTabData>{
    constructor(title: string, params: JfrVisualizerTabParams) {
        super(undefined, title, 'mdi-record-circle-outline', markRaw(JfrVisualizer as DefineComponent<any, any, any>), params, new VoidTabData())
    }
}
