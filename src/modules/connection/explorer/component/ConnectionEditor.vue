<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ky from 'ky'
import { useI18n } from 'vue-i18n'
import { ConnectionService, useConnectionService } from '@/modules/connection/service/ConnectionService'
import { Toaster, useToaster } from '@/modules/notification/service/Toaster'
import { Connection } from '@/modules/connection/model/Connection'
import VFormDialog from '@/modules/base/component/VFormDialog.vue'

enum Mode {
    Add,
    Modify
}

enum ApiTestResult {
    NotTested,
    Success,
    Failure
}

const connectionService: ConnectionService = useConnectionService()
const toaster: Toaster = useToaster()
const { t } = useI18n()

const props = withDefaults(defineProps<{
    modelValue: boolean,
    connection?: Connection
}>(), {
    connection: undefined
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

// todo lho this is horrible
const nameRules = [
    (value: any) => {
        if (value) return true
        return t('explorer.connection.editor.form.connectionName.validations.required')
    },
    (value: any) => {
        const exists = connectionService.isConnectionExists(value)
        if (!exists) return true
        return t('explorer.connection.editor.form.connectionName.validations.duplicate')
    }
]
const systemApiUrlRules = [
    (value: any) => {
        if (value) return true
        return t('explorer.connection.editor.form.systemApiUrl.validations.required')
    },
    (value: any) => {
        try {
            new URL(value)
            return true
        } catch (e) {
            return t('explorer.connection.editor.form.systemApiUrl.validations.invalidUrl')
        }
    },
    async (value: any) => {
        const result = await testSystemApiConnection()
        if (result) {
            modifiedConnection.value.systemApiUrlTested = ApiTestResult.Success
            return true
        }
        modifiedConnection.value.systemApiUrlTested = ApiTestResult.Failure
        return t('explorer.connection.editor.form.systemApiUrl.validations.unreachable')
    }
]
const grpcUrlRules = [
    (value: any) => {
        if (value) return true
        return t('explorer.connection.editor.form.grpcUrl.validations.required')
    },
    (value: any) => {
        try {
            new URL(value)
            return true
        } catch (e) {
            return t('explorer.connection.editor.form.grpcUrl.validations.invalidUrl')
        }
    },
    async (value: any) => {
        const result = await testLabApiConnection()
        if (result) {
            modifiedConnection.value.grpcUrlTested = ApiTestResult.Success
            return true
        }
        modifiedConnection.value.grpcUrlTested = ApiTestResult.Failure
        return t('explorer.connection.editor.form.grpcUrl.validations.unreachable')
    }
]
const gqlUrlRules = [
    (value: any) => {
        if (value) return true
        return t('explorer.connection.editor.form.graphQLApiUrl.validations.required')
    },
    (value: any) => {
        try {
            new URL(value)
            return true
        } catch (e) {
            return t('explorer.connection.editor.form.graphQLApiUrl.validations.invalidUrl')
        }
    },
    async (value: any) => {
        const result = await testGqlApiConnection()
        if (result) {
            modifiedConnection.value.gqlUrlTested = ApiTestResult.Success
            return true
        }
        modifiedConnection.value.gqlUrlTested = ApiTestResult.Failure
        return t('explorer.connection.editor.form.graphQLApiUrl.validations.unreachable')
    }
]
const observabilityUrlRules = [
    (value: any) => {
        if (value) return true
        return t('explorer.connection.editor.form.observability.validations.required')
    },
    (value: any) => {
        try {
            new URL(value)
            return true
        } catch (e) {
            return t('explorer.connection.editor.form.observability.validations.invalidUrl')
        }
    },
    async (value: any) => {
        const result = await testObservabilityApiConnection()
        if (result) {
            modifiedConnection.value.gqlUrlTested = ApiTestResult.Success
            return true
        }
        modifiedConnection.value.gqlUrlTested = ApiTestResult.Failure
        return t('explorer.connection.editor.form.observability.validations.unreachable')
    }
]

const mode = computed<Mode>(() => props.connection ? Mode.Modify : Mode.Add)
const modifiedConnection = ref<{
    name: string,
    systemApiUrl: string,
    systemApiUrlTested: ApiTestResult,
    grpcUrl: string
    grpcUrlTested: ApiTestResult
    gqlUrl: string,
    gqlUrlTested: ApiTestResult,
    observabilityUrl: string,
    observabilityUrlTested: ApiTestResult,
}>({
    name: '',
    systemApiUrl: '',
    systemApiUrlTested: ApiTestResult.NotTested,
    grpcUrl: '',
    grpcUrlTested: ApiTestResult.NotTested,
    gqlUrl: '',
    gqlUrlTested: ApiTestResult.NotTested,
    observabilityUrl: '',
    observabilityUrlTested: ApiTestResult.NotTested
})
const changed = ref<boolean>(false)
watch(modifiedConnection, (): void => {
    changed.value = true
})

function getApiTestedIndicator(result: ApiTestResult): any  {
    switch (result) {
        case ApiTestResult.NotTested:
            return null
        case ApiTestResult.Success:
            return 'mdi-check-circle-outline'
        case ApiTestResult.Failure:
            return 'mdi-close-circle-outline'
    }
}

async function testSystemApiConnection(): Promise<boolean> {
    try {
        const response: string | undefined = await ky.get(modifiedConnection.value.systemApiUrl + '/server-name').text()
        return response != undefined && response.length > 0
    } catch (e) {
        return false
    }
}

async function testLabApiConnection(): Promise<boolean> {
    try {
        const emptyObj = {};
        const response: Response = await ky.post(modifiedConnection.value.grpcUrl + '/io.evitadb.externalApi.grpc.generated.EvitaManagementService/ServerStatus', {json: emptyObj, headers: {
            'content-type': 'application/json; charset=utf-8'
        } });
        return response.ok || false
    } catch (e) {
        return false
    }
}

async function testGqlApiConnection(): Promise<boolean> {
    try {
        const response: any = await ky.post(
            modifiedConnection.value.gqlUrl + '/system',
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: `
                    {
                        liveness
                    }
                `
                })
            }
        ).json()
        return response?.data?.liveness || false
    } catch (e) {
        return false
    }
}
async function testObservabilityApiConnection():Promise<boolean>{
    return (await ky.get(modifiedConnection.value.observabilityUrl + '/metrics')).ok
}

function reset(): void {
    modifiedConnection.value = {
        name: '',
        systemApiUrl: '',
        systemApiUrlTested: ApiTestResult.NotTested,
        grpcUrl: '',
        grpcUrlTested: ApiTestResult.NotTested,
        gqlUrl: '',
        gqlUrlTested: ApiTestResult.NotTested,
        observabilityUrl: '',
        observabilityUrlTested: ApiTestResult.NotTested
    }
    changed.value = false
}

async function storeConnection(): Promise<boolean> {
    try {
        connectionService.addConnection(new Connection(
            undefined,
            modifiedConnection.value.name!,
            false,
            modifiedConnection.value.systemApiUrl,
            modifiedConnection.value.grpcUrl!,
            modifiedConnection.value.observabilityUrl,
            modifiedConnection.value.gqlUrl!,
            'https://localhost:5555/rest' // todo lho implement rest
        ))

        toaster.success(t(
            mode.value === Mode.Add
                ? 'explorer.connection.editor.notification.connectionAdded'
                : 'explorer.connection.editor.notification.connectionEdited',
            { connectionName: modifiedConnection.value.name! }
        ))
        return true
    } catch (e: any) {
        toaster.error(t(
            mode.value === Mode.Add
                ? 'explorer.connection.editor.notification.couldNotAddConnection'
                : 'explorer.connection.editor.notification.couldNotEditConnection',
            { reason: e.message }
        ))
        return false
    }
}
</script>

<template>
    <VFormDialog
        :model-value="modelValue"
        :changed="changed"
        :confirm-button-icon="mode === Mode.Add ? 'mdi-plus' : 'mdi-pencil-outline'"
        :confirm="storeConnection"
        :reset="reset"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <template #activator="{ props }">
            <slot name="activator" v-bind="{ props }"/>
        </template>

        <template #title>
            <template v-if="mode === Mode.Add">
                {{ t('explorer.connection.editor.addTitle') }}
            </template>
            <template v-else-if="mode === Mode.Modify">
                {{ t('explorer.connection.editor.editTitle') }}
            </template>
        </template>

        <template #default>
            <VTextField
                v-model="modifiedConnection.name"
                :label="t('explorer.connection.editor.form.connectionName.label')"
                placeholder="evitaDB"
                :rules="nameRules"
                required
            />
            <VTextField
                v-model="modifiedConnection.systemApiUrl"
                :label="t('explorer.connection.editor.form.systemApiUrl.label')"
                placeholder="https://{evitadb-server}:5555/system"
                variant="solo-filled"
                required
                :rules="systemApiUrlRules"
                :append-inner-icon="getApiTestedIndicator(modifiedConnection.systemApiUrlTested)"
            />
            <VTextField
                v-model="modifiedConnection.grpcUrl"
                :label="t('explorer.connection.editor.form.grpcUrl.label')"
                placeholder="https://{evitadb-server}:5555/"
                variant="solo-filled"
                required
                :rules="grpcUrlRules"
                :append-inner-icon="getApiTestedIndicator(modifiedConnection.grpcUrlTested)"
            />
            <VTextField
                v-model="modifiedConnection.gqlUrl"
                :label="t('explorer.connection.editor.form.graphQLApiUrl.label')"
                placeholder="https://{evitadb-server}:5555/gql"
                variant="solo-filled"
                required
                :rules="gqlUrlRules"
                :append-inner-icon="getApiTestedIndicator(modifiedConnection.gqlUrlTested)"
            />
            <VTextField
                v-model="modifiedConnection.observabilityUrl"
                :label="t('explorer.connection.editor.form.observability.label')"
                placeholder="https://{evitadb-server}:5555/observability"
                variant="solo-filled"
                required
                :rules="observabilityUrlRules"
                :append-inner-icon="getApiTestedIndicator(modifiedConnection.observabilityUrlTested)"
            />
        </template>

        <template #confirm-button-body>
            <template v-if="mode === Mode.Add">
                {{ t('common.button.add') }}
            </template>
            <template v-else-if="mode === Mode.Modify">
                {{ t('common.button.edit') }}
            </template>
        </template>
    </VFormDialog>
</template>

<style lang="scss" scoped>

</style>
