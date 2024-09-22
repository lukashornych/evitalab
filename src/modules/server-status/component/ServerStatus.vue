<script setup lang="ts">
import { TabComponentEvents } from '@/modules/workspace/tab/model/TabComponentEvents'
import { useServerStatusService } from '../service/ServerStatusService'
import { ref } from 'vue'
import { TabComponentProps } from '@/modules/workspace/tab/model/TabComponentProps'
import { ServerStatusTabParams } from '../model/ServerStatusTabParams'
import { VoidTabData } from '@/modules/workspace/tab/model/void/VoidTabData'
import { Duration } from 'luxon'
import { List } from 'immutable'
import { useI18n } from 'vue-i18n'
import VTabToolbar from '@/modules/base/component/VTabToolbar.vue'
import RuntimeConfigurationDialog from '@/modules/server-status/component/RuntimeConfigurationDialog.vue'
import { EvitaLabConfig, useEvitaLabConfig } from '@/modules/config/EvitaLabConfig'
import { ServerStatus } from '@/modules/connection/model/status/ServerStatus'
import { ApiReadiness } from '@/modules/connection/model/status/ApiReadiness'
import { ApiServerStatus } from '@/modules/connection/model/status/ApiServerStatus'
import { ApiEndpoint } from '@/modules/connection/model/status/ApiEndpoint'

const emit = defineEmits<TabComponentEvents>()
const props = defineProps<TabComponentProps<ServerStatusTabParams, VoidTabData>>()

const { t } = useI18n()

const serverDetailLoaded = ref<boolean>(false)
const serverDetail = ref<ServerStatus>()
const apiReadinessLoaded = ref<boolean>(false)
const apiReadiness = ref<ApiReadiness>()
const apiStatus = ref<ApiServerStatus>()
const apiStatusLoaded = ref<boolean>()
const visibleYamlDialog = ref<boolean>(false)
const runtimeConfigLoaded = ref<boolean>(false)
const runtimeConfig = ref<string>()

const path: List<string> = List([t('serverStatus.toolbar.title')])
const serverStatusService = useServerStatusService()
const evitaLabConfig: EvitaLabConfig = useEvitaLabConfig()

serverStatusService
    .getServerStatistics(props.params.connection)
    .then((x) => loadedServerStatus(x))
serverStatusService
    .getApiReadiness(props.params.connection)
    .then((x) => loadedApiReadiness(x))
serverStatusService
    .getRuntimeConfiguration(props.params.connection)
    .then((x) => loadedRuntimeConfig(x))
serverStatusService
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

function formatUrl(url: string): string {
    return url.replace('0.0.0.0', '127.0.0.1')
}

function refresh() {
    serverStatusService
        .getServerStatistics(props.params.connection)
        .then((x) => loadedServerStatus(x))
    serverStatusService
        .getApiReadiness(props.params.connection)
        .then((x) => loadedApiReadiness(x))
    serverStatusService
        .getRuntimeConfiguration(props.params.connection)
        .then((x) => loadedRuntimeConfig(x))
    serverStatusService
        .getServerStatus(props.params.connection)
        .then((x) => loadedApiServerStatus(x))
}
</script>

<template>
    <div class="server-status">
        <!--TODO: LHO fix entension whitespace-->
        <VTabToolbar prepend-icon="mdi mdi-database-outline" :path="path">
            <template #append>
                <VBtn icon density="compact" @click="refresh">
                    <VIcon>mdi mdi-refresh</VIcon>
                </VBtn>
            </template>
        </VTabToolbar>
        <VSheet>
            <div v-if="serverDetailLoaded">
                <VCard variant="tonal" class="w-75 a-5 container">
                    <VCardText>
                        <p class="main-title">{{ serverDetail?.instanceId }}</p>
                        <div class="version">
                            <VChip>
                                {{ t('serverStatus.detail.flags.version', { version: serverDetail?.version || '?' }) }}
                            </VChip>
                        </div>
                        <div class="informative-container">
                            <div class="informative-icons">
                                <span class="mdi mdi-chart-bell-curve-cumulative"></span>
                                <div class="log"></div>
                            </div>
                            <div class="informative-items">
                                <p>
                                    {{ t('serverStatus.detail.stats.started', { started: serverDetail?.started?.getPrettyPrintableString() || '?' }) }}
                                </p>
                                <p>
                                    {{ t('serverStatus.detail.stats.uptime', { uptime: getFormattedUptime(serverDetail?.uptime) || '?' }) }}
                                </p>
                                <p>
                                    {{ t('serverStatus.detail.stats.catalogsOk', { catalogCount: serverDetail?.catalogsOk || '?' }) }}
                                </p>
                                <p>
                                    {{ t('serverStatus.detail.stats.catalogsCorrupted', { catalogCount: serverDetail?.catalogsCorrupted || '?' }) }}
                                </p>
                                <div class="log"></div>
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
                                            v-for="(url, key) in findApiUrls(
                                                'gRPC'
                                            )"
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
                                            apiReadiness?.apis.graphQL ===
                                            'ready'
                                                ? 'active'
                                                : 'inactive',
                                        ]"
                                    ></span
                                    >GraphQL
                                    <VChipGroup class="d-sm-inline">
                                        <VChip
                                            v-for="(url, key) in findApiUrls(
                                                'graphQL'
                                            )"
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
                                            v-for="(url, key) in findApiUrls(
                                                'rest'
                                            )"
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
                                    >evitaLab
                                    <VChipGroup class="d-sm-inline">
                                        <VChip
                                            v-for="(url, key) in findApiUrls(
                                                'lab'
                                            )"
                                            :key="key + 'lab'"
                                        >
                                            {{ formatUrl(url) }}
                                        </VChip>
                                    </VChipGroup>
                                </p>
                                <!-- todo lho: temporary disable flag, we will later introduce some kind of "demo" mode instead -->
                                <VChip
                                    :disabled="evitaLabConfig.readOnly"
                                    @click="visibleYamlDialog = true"
                                    variant="outlined"
                                    class="w-75 bottom-title"
                                >
                                    {{ t('serverStatus.detail.actions.openRuntimeConfiguration') }}
                                </VChip>
                            </div>
                        </div>
                    </VCardText>
                </VCard>
                <RuntimeConfigurationDialog
                    v-if="runtimeConfigLoaded"
                    v-model="visibleYamlDialog"
                    :runtime-configuration="runtimeConfig!"
                />
            </div>
        </VSheet>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.server-status {
    display: grid;
    grid-template-rows: 3rem 1fr;

    &__header {
        z-index: 100;
    }

    &__body {
        position: relative;
    }
}

.main-title {
    color: white;
    font-weight: bold;
    font-size: 1.4em;
}

.informative-container {
    width: 100%;
    display: grid;
    column-gap: 5px;
    grid-template-columns: 30px auto 30px auto;
}

.informative-items {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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

.version {
    margin-top: 15px;
    margin-bottom: 15px;
}

.bottom-title {
    margin-top: 15px;
}

.log {
    margin-top: 8px;
    height: 25px;
}

.container {
    margin: 15px;
}

.card {
    overflow-y: hidden !important;
}
</style>
