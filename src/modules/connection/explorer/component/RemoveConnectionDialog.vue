<script setup lang="ts">
/**
 * Dialog window to remove user-created connection.
 */

import { useI18n } from 'vue-i18n'
import { ConnectionService, useConnectionService } from '@/modules/connection/service/ConnectionService'
import { Toaster, useToaster } from '@/modules/notification/service/Toaster'
import { Connection } from '@/modules/connection/model/Connection'

const connectionService: ConnectionService = useConnectionService()
const toaster: Toaster = useToaster()
const { t } = useI18n()

const props = defineProps<{
    modelValue: boolean
    connection: Connection
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

function cancel() {
    emit('update:modelValue', false)
}

function removeConnection(): void {
    try {
        connectionService.removeConnection(props.connection.id)
    } catch (e: any) {
        toaster.error(e)
        return
    }
    toaster.success('Connection removed.')
    emit('update:modelValue', false)
}
</script>

<template>
    <VDialog
        :model-value="modelValue"
        max-width="30rem"
        @update:model-value="$emit('update:modelValue', $event)"
    >
        <template #activator="{ props }">
            <slot name="activator" v-bind="props"/>
        </template>

        <VCard class="py-8 px-4">
            <VCardTitle>{{ t('explorer.connection.remove.title') }}</VCardTitle>
            <VCardText class="mb-4">
                <I18nT keypath="explorer.connection.remove.question">
                    <template #connectionName>
                        <strong>{{ connection.name }}</strong>
                    </template>
                </I18nT>
            </VCardText>
            <VCardActions>
                <VSpacer/>
                <VBtn @click="cancel" variant="tonal">
                    {{ t('common.button.cancel') }}
                </VBtn>
                <VBtn
                    variant="outlined"
                    prepend-icon="mdi-delete"
                    @click="removeConnection"
                >
                    {{ t('common.button.remove') }}
                </VBtn>
            </VCardActions>
        </VCard>
    </VDialog>
</template>

<style lang="scss" scoped>

</style>
