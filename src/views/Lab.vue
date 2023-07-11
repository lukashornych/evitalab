<script lang="ts" setup>
import LabPanel from '@/components/LabPanel.vue'
import LabExplorer from '@/components/LabExplorer.vue'
import LabEditor from '@/components/LabEditor.vue'

import { ref } from 'vue'
import { Connection } from '@/model/connection'

const panel = ref<string>('explorer')

const connections = ref<Connection[]>([
    {
        name: 'evita local',
        restUrl: 'https://localhost:5555/rest'
    }
])

</script>

<template>
    <LabPanel
        v-model:panel="panel"
    />

    <LabExplorer
        :connections="connections"
        :model-value="panel === 'explorer'"
    />

    <LabEditor />
</template>
