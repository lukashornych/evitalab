<script setup lang="ts">
/**
 * Dialog window to accept or reject a shared tab.
 */

import { useI18n } from 'vue-i18n'
import { useWorkspaceService, WorkspaceService } from '@/modules/workspace/service/WorkspaceService'
import { TabDefinition } from '@/modules/workspace/tab/model/TabDefinition'

const workspaceService: WorkspaceService = useWorkspaceService()
const { t } = useI18n()

const props = defineProps<{
    tabRequest: TabDefinition<any, any>
}>()
const emit = defineEmits<{
    (e: 'resolve'): void
}>()

function acceptSharedTab(): void {
    workspaceService.createTab(props.tabRequest)
    emit('resolve')
}

function rejectSharedTab(): void {
    emit('resolve')
}
</script>

<template>
    <VDialog
        :model-value="true"
        max-width="36rem"
        @update:model-value="rejectSharedTab"
    >
        <VCard class="py-8 px-4">
            <VCardTitle>{{ t('tabShare.sharedDialog.title') }}</VCardTitle>

            <VCardText>
                <template v-if="tabRequest.initialData != undefined">
                    <span v-html="t('tabShare.sharedDialog.text.withoutInitialData')" />
                </template>
                <template v-else>
                    <span v-html="t('tabShare.sharedDialog.text.withInitialData')" />
                </template>
            </VCardText>
            <VCardText v-if="tabRequest.initialData != undefined">
                <VAlert
                    icon="mdi-alert-outline"
                    type="warning"
                >
                    <span v-html="t('tabShare.sharedDialog.warning.potentiallyUnsafe')" />
                </VAlert>
            </VCardText>

            <VCardActions class="px-6">
                <VSpacer/>
                <VBtn
                    variant="tonal"
                    @click="rejectSharedTab">
                    {{ t('tabShare.sharedDialog.button.reject') }}
                </VBtn>
                <VBtn
                    variant="outlined"
                    prepend-icon="mdi-check"
                    @click="acceptSharedTab"
                    class="ml-4"
                >
                    {{ t('tabShare.sharedDialog.button.accept') }}
                </VBtn>
            </VCardActions>
        </VCard>
    </VDialog>
</template>

<style lang="scss" scoped>

</style>
