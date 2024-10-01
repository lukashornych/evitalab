<script setup lang="ts">
import { TabComponentEvents } from '@/modules/workspace/tab/model/TabComponentEvents'
import { ServerStatusService, useServerStatusService } from '../service/ServerStatusService'
import { ref } from 'vue'
import { TabComponentProps } from '@/modules/workspace/tab/model/TabComponentProps'
import { ServerStatusTabParams } from '../model/ServerStatusTabParams'
import { VoidTabData } from '@/modules/workspace/tab/model/void/VoidTabData'
import { Duration } from 'luxon'
import Immutable, { List } from 'immutable'
import { useI18n } from 'vue-i18n'
import VTabToolbar from '@/modules/base/component/VTabToolbar.vue'
import RuntimeConfigurationDialog from '@/modules/server-status/component/RuntimeConfigurationDialog.vue'
import { EvitaLabConfig, useEvitaLabConfig } from '@/modules/config/EvitaLabConfig'
import { ServerStatus } from '@/modules/connection/model/status/ServerStatus'
import { ApiType } from '@/modules/connection/model/status/ApiType'

const serverStatusService: ServerStatusService = useServerStatusService()
const evitaLabConfig: EvitaLabConfig = useEvitaLabConfig()
const { t } = useI18n()

const emit = defineEmits<TabComponentEvents>()
const props = defineProps<TabComponentProps<ServerStatusTabParams, VoidTabData>>()

const path: List<string> = List([t('serverStatus.toolbar.title')])

const serverStatusLoaded = ref<boolean>(false)
const serverStatus = ref<ServerStatus>()

const runtimeConfigurationLoaded = ref<boolean>(false)
const runtimeConfiguration = ref<string>()
const showRuntimeConfigurationDialog = ref<boolean>(false)

serverStatusService
    .getServerStatus(props.params.connection)
    .then((x) => loadedServerStatus(x))
serverStatusService
    .getRuntimeConfiguration(props.params.connection)
    .then((x) => loadedRuntimeConfiguration(x))

function loadedServerStatus(fetchedServerStatus: ServerStatus): void {
    serverStatus.value = fetchedServerStatus
    serverStatusLoaded.value = true
    checkAllDataLoaded()
}

function loadedRuntimeConfiguration(fetchedRuntimeConfiguration: string) {
    runtimeConfiguration.value = fetchedRuntimeConfiguration
    runtimeConfigurationLoaded.value = true
    checkAllDataLoaded()
}

function getFormattedUptime(uptime: bigint | undefined): string {
    if (!uptime) return ''
    return Duration.fromObject({ seconds: Number(uptime) }).toFormat(
        "y'y ' M'm ' d'd 'h'h ' m'min ' s's '"
    )
}

function checkAllDataLoaded(): void {
    if (
        serverStatusLoaded.value === true &&
        runtimeConfigurationLoaded.value === true
    ) {
        emit('ready')
    }
}

function findApiUrls(apiType: ApiType): Immutable.List<string> | undefined {
    return serverStatus.value?.apis.get(apiType)?.baseUrls
}

function formatUrl(url: string): string {
    return url.replace('0.0.0.0', '127.0.0.1')
}

function refresh() {
    serverStatusService
        .getRuntimeConfiguration(props.params.connection)
        .then((x) => loadedRuntimeConfiguration(x))
    serverStatusService
        .getServerStatus(props.params.connection)
        .then((x) => loadedServerStatus(x))
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
<!--        todo lho reimplement -->
<!--        <VSheet>
            <div v-if="serverStatusLoaded">
                <VCard variant="tonal" class="w-75 a-5 container">
                    <VCardText>
                        <p class="main-title">{{ serverStatus?.instanceId }}</p>
                        <div class="version">
                            <VChip>
                                {{ t('serverStatus.detail.flags.version', { version: serverStatus?.version || '?' }) }}
                            </VChip>
                        </div>
                        <div class="informative-container">
                            <div class="informative-icons">
                                <span class="mdi mdi-chart-bell-curve-cumulative"></span>
                                <div class="log"></div>
                            </div>
                            <div class="informative-items">
                                <p>
                                    {{ t('serverStatus.detail.stats.started', { started: serverStatus?.started?.getPrettyPrintableString() || '?' })
                                    }}
                                </p>
                                <p>
                                    {{ t('serverStatus.detail.stats.uptime', { uptime: getFormattedUptime(serverStatus?.uptime) || '?' })
                                    }}
                                </p>
                                <p>
                                    {{ t('serverStatus.detail.stats.catalogsOk', { catalogCount: serverStatus?.catalogsOk || '?' })
                                    }}
                                </p>
                                <p>
                                    {{ t('serverStatus.detail.stats.catalogsCorrupted', { catalogCount: serverStatus?.catalogsCorrupted || '?' })
                                    }}
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
                                            serverStatus?.apis.get(ApiType.Grpc) === 'ready'
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
                                &lt;!&ndash; todo lho: temporary disable flag, we will later introduce some kind of "demo" mode instead &ndash;&gt;
                                <VChip
                                    :disabled="evitaLabConfig.readOnly"
                                    @click="showRuntimeConfigurationDialog = true"
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
                    v-if="runtimeConfigurationLoaded"
                    v-model="showRuntimeConfigurationDialog"
                    :runtime-configuration="runtimeConfiguration!"
                />
            </div>
        </VSheet>-->
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
