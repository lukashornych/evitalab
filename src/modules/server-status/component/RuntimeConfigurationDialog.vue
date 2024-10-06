<script setup lang="ts">

import { Extension } from '@codemirror/state'
import { yaml } from '@codemirror/lang-yaml'
import { useI18n } from 'vue-i18n'
import VPreviewEditorDialog from '@/modules/code-editor/component/VPreviewEditorDialog.vue'

const { t } = useI18n()

const props = defineProps<{
    modelValue: boolean,
    runtimeConfiguration: string
}>()
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const additionalExtensions: Extension[] = [yaml()]
</script>

<template>
    <VPreviewEditorDialog
        :model-value="modelValue"
        :content="runtimeConfiguration"
        :additional-extensions="additionalExtensions"
        @update:model-value="$emit('update:modelValue', $event)"
    >
        <template #activator="{ props }">
            <slot name="activator" v-bind="{ props }" />
        </template>

        <template #title>
            {{ t('serverStatus.detail.runtimeConfig.title') }}
        </template>
    </VPreviewEditorDialog>
</template>

<style lang="scss" scoped>
</style>
