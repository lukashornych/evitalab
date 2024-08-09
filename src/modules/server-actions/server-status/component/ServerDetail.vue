<template>
    <div v-if="serverDetailLoaded">
        <VCardText>
            <p class="main-title">{{ serverDetail?.instanceId }}</p>
            <div>
                <p>version: {{ serverDetail?.version }}</p>
            </div>
            <p>started: {{ serverDetail?.started?.getPrettyPrintableString() }}</p>
            <p>uptime: {{ serverDetail?.uptime }}</p>
            <p>{{ serverDetail?.catalogsCorrupted }}</p>
            <p>{{ serverDetail?.catalogsOk }}</p>
            <p>{{ serverDetail?.instanceId }}</p>
        </VCardText>
    </div>
</template>

<script setup lang="ts">
import { TabComponentEvents } from '@/modules/workspace/tab/model/TabComponentEvents'
import { useDetailViewerService } from '../service/ServerStatusService'
import { ref } from 'vue'
import { ServerStatus } from '@/modules/connection/model/data/ServerStatus'
import { TabComponentProps } from '@/modules/workspace/tab/model/TabComponentProps'
import { ServerStatusTabParams } from '../model/ServerStatusTabParams'
import { VoidTabData } from '@/modules/workspace/tab/model/void/VoidTabData'

const emit = defineEmits<TabComponentEvents>()
const serverDetailLoaded = ref<boolean>(false)
const serverDetail = ref<ServerStatus>()

const props =
    defineProps<
        TabComponentProps<ServerStatusTabParams, VoidTabData>
    >()

useDetailViewerService().getServerStatistics(props.params.connection).then(x => loadedData(x))

function loadedData(serverStatus: ServerStatus) {
    serverDetail.value = serverStatus
    serverDetailLoaded.value = true
    emit('ready')
}

</script>

<style scoped>
.main-title{
    color: white;
    font-weight: bold;
    font-size: 1.4em;
}
</style>
