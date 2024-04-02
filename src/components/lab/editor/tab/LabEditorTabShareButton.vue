<script setup lang="ts">
/**
 * Universal button to share the current tab and its data with other users via a link pointing to the same evitaLab
 * instance.
 */
import { ref } from 'vue'
import LabEditorTabShareDialog from '@/components/lab/editor/tab/LabEditorTabShareDialog.vue'
import { TabType } from '@/model/editor/tab/TabType'
import { TabRequestComponentData } from '@/model/editor/tab/TabRequestComponentData'
import { TabRequestComponentParams } from '@/model/editor/tab/TabRequestComponentParams'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = withDefaults(defineProps<{
    tabType: TabType,
    tabParams: TabRequestComponentParams<any>,
    tabData: TabRequestComponentData<any> | undefined,
    disabled?: boolean
}>(), {
    disabled: false
})

const shareDialogOpen = ref<boolean>(false)

function share() {
    shareDialogOpen.value = true
}

defineExpose<{
    share: () => void
}>({
    share
})
</script>

<template>
    <LabEditorTabShareDialog
        v-model="shareDialogOpen"
        :tab-type="props.tabType"
        :tab-params="props.tabParams"
        :tab-data="props.tabData"
    >
        <template #activator="{ props }">
            <VBtn
                icon
                density="compact"
                v-bind="props"
                :disabled="disabled"
                @click="shareDialogOpen = true"
            >
                <VIcon>mdi-share-variant</VIcon>
                <VTooltip activator="parent">
                    <template v-if="disabled">
                        {{ t('tabShare.tooltip.nonSharableTab') }}
                    </template>
                    <template v-else>
                        {{ t('tabShare.button.shareTab') }}
                    </template>
                </VTooltip>
            </VBtn>
        </template>
    </LabEditorTabShareDialog>
</template>

<style lang="scss" scoped>

</style>
