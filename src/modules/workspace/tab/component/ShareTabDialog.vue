<script setup lang="ts">
/**
 * Dialog to share the current tab and its data with other users via a link pointing to the same evitaLab
 * instance.
 */

import { computed } from 'vue'
import { Toaster, useToaster } from '@/services/editor/toaster'
import { TabType } from '@/model/editor/tab/TabType'
import { TabRequestComponentData } from '@/model/editor/tab/TabRequestComponentData'
import { TabRequestComponentParams } from '@/model/editor/tab/TabRequestComponentParams'
import { ShareTabObject } from '@/model/editor/tab/ShareTabObject'
import { useI18n } from 'vue-i18n'
import { UnexpectedError } from '@/model/UnexpectedError'

/**
 * Smallest possible number of characters in a URL valid across all browser. Usually browser support more characters.
 */
const urlCharacterLimit: number = 2083

const toaster: Toaster = useToaster()
const { t } = useI18n()

const props = defineProps<{
    modelValue: boolean,
    tabType: TabType,
    tabParams: TabRequestComponentParams<any>,
    tabData: TabRequestComponentData<any> | undefined
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const evitaLabInstance = computed<string>(() => {
    const location = window.location
    return location.origin + location.pathname
})
const link = computed<string>(() => {
    const shareTabObject: ShareTabObject = new ShareTabObject(props.tabType, props.tabParams.toSerializable(), props.tabData?.toSerializable())
    return `${evitaLabInstance.value}?sharedTab=${shareTabObject.toLinkParam()}`
})

function cancel(): void {
    emit('update:modelValue', false)
}

function copyLink(): void {
    navigator.clipboard.writeText(link.value).then(() => {
        toaster.info(t('tabShare.shareDialog.notification.linkCopied'))
    }).catch(() => {
        toaster.error(new UnexpectedError(undefined, t('common.notification.failedToCopyToClipboard')))
    })

    emit('update:modelValue', false)
}
</script>

<template>
    <VDialog
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        max-width="36rem"
    >
        <template #activator="{ props }">
            <slot name="activator" v-bind="props"/>
        </template>

        <VCard class="py-8 px-4">
            <VCardTitle>{{ t('tabShare.shareDialog.title') }}</VCardTitle>

            <VCardText>
                {{ t('tabShare.shareDialog.text') }}
            </VCardText>
            <VCardText v-if="tabData != undefined">
                <VAlert icon="mdi-alert-outline" type="warning">
                    <span v-html="t('tabShare.shareDialog.warning.sensitiveData')" />
                </VAlert>
            </VCardText>
            <VCardText v-if="link.length > urlCharacterLimit">
                <VAlert type="warning" icon="mdi-alert-outline">
                    <span v-html="t('tabShare.shareDialog.warning.linkMayNotWork', { urlCharacterLimit })" />
                </VAlert>
            </VCardText>

            <VCardActions class="px-6">
                <VSpacer/>
                <VBtn
                    variant="tonal"
                    @click="cancel">
                    {{ t('common.button.cancel') }}
                </VBtn>
                <VBtn
                    variant="outlined"
                    prepend-icon="mdi-content-copy"
                    @click="copyLink"
                    class="ml-4"
                >
                    {{ t('tabShare.shareDialog.button.copyLink') }}
                </VBtn>
            </VCardActions>
        </VCard>
    </VDialog>
</template>

<style lang="scss" scoped>

</style>
