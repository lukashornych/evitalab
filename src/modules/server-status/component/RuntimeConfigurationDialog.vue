<script setup lang="ts">

import VLabDialog from '@/modules/base/component/VLabDialog.vue'
import VPreviewEditor from '@/modules/code-editor/component/VPreviewEditor.vue'
import { Extension } from '@codemirror/state'
import { yaml } from '@codemirror/lang-yaml'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
    modelValue: boolean,
    runtimeConfiguration: string
}>()
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const extensions: Extension[] = [yaml()]
</script>

<template>
    <VLabDialog
        :model-value="modelValue"
        max-width="75rem"
        @update:model-value="$emit('update:modelValue', $event)"
    >
        <template #activator="{ props }">
            <slot name="activator" v-bind="props" class="h-100" />
        </template>

        <template #title>
            {{ t('serverStatus.detail.runtimeConfig.title') }}
        </template>
        <template #title-actions>
            <VBtn
                icon
                variant="flat"
                density="compact"
                @click="emit('update:modelValue', false)"
            >
                <VIcon>mdi-close</VIcon>
                <VTooltip activator="parent">
                    {{ t('common.button.close') }}
                </VTooltip>
            </VBtn>
        </template>

        <template #default>
            <div class="runtime-config__editor">
                <VPreviewEditor
                    :model-value="runtimeConfiguration"
                    :additional-extensions="extensions"
                />
            </div>
        </template>
    </VLabDialog>
</template>

<style lang="scss" scoped>
.runtime-config__editor {
    position: relative;
    min-height: 15rem;
    height: 60vh;
}
</style>
