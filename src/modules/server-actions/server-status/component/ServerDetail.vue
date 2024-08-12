<template>
    <div v-if="serverDetailLoaded">
        <VCard>
            <VCardText>
                <p class="main-title">{{ serverDetail?.instanceId }}</p>
                <div>
                    <p>version: {{ serverDetail?.version }}</p>
                </div>
                <div class="informative-container">
                    <div class="informative-icons">
                        <span
                            class="mdi mdi-chart-bell-curve-cumulative"
                        ></span>
                    </div>
                    <div class="informative-items">
                        <p>
                            Started:
                            {{
                                serverDetail?.started?.getPrettyPrintableString()
                            }}
                        </p>
                        <p>
                            Uptime:
                            {{ getFormattedUptime(serverDetail?.uptime) }}
                        </p>
                        <p>Catalogs: {{ serverDetail?.catalogsOk }}</p>
                        <p>
                            Corrupted catalogs:
                            {{ serverDetail?.catalogsCorrupted }}
                        </p>
                    </div>
                    <div class="informative-icons">
                        <span class="mdi mdi-api"></span>
                        <span class="mdi mdi-cog-outline"></span>
                    </div>
                    <div class="informative-items">
                        <p>
                            <span
                                :class="[
                                    'status-circle',
                                    apiReadiness?.apis.gRPC === 'ready'
                                        ? 'active'
                                        : 'inactive',
                                ]"
                            ></span
                            >gRPC
                            <VChipGroup class="d-sm-inline">
                                <VChip
                                    v-for="(url, key) in findApiUrls('gRPC')"
                                    :key="key + 'gRPC'"
                                >
                                    {{ formatUrl(url) }}
                                </VChip>
                            </VChipGroup>
                        </p>
                        <p>
                            <span
                                :class="[
                                    'status-circle',
                                    apiReadiness?.apis.graphQL === 'ready'
                                        ? 'active'
                                        : 'inactive',
                                ]"
                            ></span
                            >GraphQL
                            <VChipGroup class="d-sm-inline">
                                <VChip
                                    v-for="(url, key) in findApiUrls('graphQL')"
                                    :key="key + 'graphQL'"
                                >
                                    {{ formatUrl(url) }}
                                </VChip>
                            </VChipGroup>
                        </p>
                        <p>
                            <span
                                :class="[
                                    'status-circle',
                                    apiReadiness?.apis.rest === 'ready'
                                        ? 'active'
                                        : 'inactive',
                                ]"
                            ></span
                            >REST
                            <VChipGroup class="d-sm-inline">
                                <VChip
                                    v-for="(url, key) in findApiUrls('rest')"
                                    :key="key + 'rest'"
                                >
                                    {{ formatUrl(url) }}
                                </VChip>
                            </VChipGroup>
                        </p>
                        <p>
                            <span
                                :class="[
                                    'status-circle',
                                    apiReadiness?.apis.lab === 'ready'
                                        ? 'active'
                                        : 'inactive',
                                ]"
                            ></span
                            >evitaLab <VChipGroup class="d-sm-inline">
                                <VChip
                                    v-for="(url, key) in findApiUrls('lab')"
                                    :key="key + 'lab'"
                                >
                                    {{ formatUrl(url) }}
                                </VChip>
                            </VChipGroup>
                        </p>
                        <p
                            @click="
                                () => {
                                    modelValue = true
                                }
                            "
                        >
                            Open runtime configuration
                        </p>
                    </div>
                </div>
            </VCardText>
        </VCard>
        <VDialog :model-value="modelValue" max-width="50rem" height="75%">
            <template #activator="{ props }">
                <slot name="activator" v-bind="props" class="h-100" />
            </template>
            <VCard class="py-16 px-16 h-100">
                <VPreviewEditor
                    :model-value="runtimeConfig ?? ''"
                    class="h-100"
                    read-only
                >
                </VPreviewEditor>
            </VCard>
        </VDialog>
    </div>
</template>

<script setup lang="ts">
import { TabComponentEvents } from '@/modules/workspace/tab/model/TabComponentEvents'
import { useDetailViewerService } from '../service/ServerStatusService'
import { computed, ref } from 'vue'
import { ServerStatus } from '@/modules/connection/model/data/ServerStatus'
import { TabComponentProps } from '@/modules/workspace/tab/model/TabComponentProps'
import { ServerStatusTabParams } from '../model/ServerStatusTabParams'
import { VoidTabData } from '@/modules/workspace/tab/model/void/VoidTabData'
import { Duration } from 'luxon'
import { ApiReadiness } from '@/modules/connection/model/data/ApiReadiness'
import VPreviewEditor from '@/modules/code-editor/component/VPreviewEditor.vue'
import { ApiServerStatus } from '@/modules/connection/model/data/ApiServerStatus'
import { ApiEndpoint } from '@/modules/connection/model/data/ApiEndpoint'

const emit = defineEmits<TabComponentEvents>()
const props =
    defineProps<TabComponentProps<ServerStatusTabParams, VoidTabData>>()

const serverDetailLoaded = ref<boolean>(false)
const serverDetail = ref<ServerStatus>()
const apiReadinessLoaded = ref<boolean>(false)
const apiReadiness = ref<ApiReadiness>()
const apiStatus = ref<ApiServerStatus>()
const apiStatusLoaded = ref<boolean>()
const modelValue = ref<boolean>(false)
const runtimeConfigLoaded = ref<boolean>(false)
const runtimeConfig = ref<string>()

useDetailViewerService()
    .getServerStatistics(props.params.connection)
    .then((x) => loadedServerStatus(x))
useDetailViewerService()
    .getApiReadiness(props.params.connection)
    .then((x) => loadedApiReadiness(x))
useDetailViewerService()
    .getRuntimeConfiguration(props.params.connection)
    .then((x) => loadedRuntimeConfig(x))
useDetailViewerService()
    .getServerStatus(props.params.connection)
    .then((x) => loadedApiServerStatus(x))

function loadedServerStatus(serverStatus: ServerStatus) {
    serverDetail.value = serverStatus
    serverDetailLoaded.value = true
    checkAllDataLoaded()
}

function loadedApiReadiness(apiStatusValue: ApiReadiness) {
    apiReadiness.value = apiStatusValue
    apiReadinessLoaded.value = true
    checkAllDataLoaded()
}

function loadedApiServerStatus(serverStatus: ApiServerStatus) {
    apiStatus.value = serverStatus
    apiStatusLoaded.value = true
    checkAllDataLoaded()
}

function getFormattedUptime(uptime: bigint | undefined): string {
    if (!uptime) return ''
    return Duration.fromObject({ seconds: Number(uptime) }).toFormat(
        "y'y ' M'm ' d'd 'h'h ' m'min ' s's '"
    )
}

function loadedRuntimeConfig(config: string) {
    runtimeConfig.value = config
    runtimeConfigLoaded.value = true
    checkAllDataLoaded()
}

function checkAllDataLoaded(): void {
    if (
        serverDetailLoaded.value === true &&
        apiReadinessLoaded.value === true &&
        runtimeConfigLoaded.value === true &&
        apiStatusLoaded.value === true
    ) {
        emit('ready')
    }
}

function findApiUrls(apiName: keyof ApiEndpoint): string[] | undefined {
    return apiStatus.value?.apis.find((api) => api[apiName])?.[apiName]
}

function formatUrl(url: string):string{
    return url.replace('0.0.0.0', '127.0.0.1')
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';
.main-title {
    color: white;
    font-weight: bold;
    font-size: 1.4em;
}

.informative-container {
    width: 55%;
    display: grid;
    column-gap: 5px;
    grid-template-columns: 30px auto 30px auto;
}

.informative-items {
    min-width: 25px;
    padding-left: 10px;
    padding-right: 10px;
}

.informative-items p {
    margin-top: 8px;
    margin-bottom: 8px;
}

.informative-icons {
    color: white;
    font-size: 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.active {
    background-color: $success;
}

.inactive {
    background-color: $error;
}

.status-circle {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 8px;
    border-radius: 50%;
}
</style>
