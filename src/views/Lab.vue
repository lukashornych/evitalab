<script lang="ts" setup>
import LabPanel from '@/components/LabPanel.vue'
import LabExplorer from '@/components/LabExplorer.vue'
import LabEditor from '@/components/LabEditor.vue'

import { ref } from 'vue'
import { PanelType } from '@/model/lab'

const panel = ref<string>(PanelType.Explorer)

</script>

<template>
    <LabPanel
        v-model:panel="panel"
    />

    <LabExplorer
        :model-value="panel === PanelType.Explorer"
    />

    <LabEditor />
</template>
