<script setup lang="ts">

import { Codemirror } from 'vue-codemirror'
import { Extension } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { materialDark } from 'cm6-theme-material-dark'

const props = withDefaults(
    defineProps<{
        modelValue: string
        additionalExtensions?: Extension[]
        placeholder?: string
        disabled?: boolean
    }>(),
    {
        disabled: false,
        additionalExtensions: () => []
    }
)

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const extensions: Extension[] = [basicSetup, materialDark, ...props.additionalExtensions]
</script>

<template>
    <Codemirror
        :model-value="modelValue"
        :extensions="extensions"
        :placeholder="placeholder"
        :disabled="disabled"
        @update:model-value="$emit('update:modelValue', $event)"
        style="height: 100%; cursor: text;"
    />
</template>

<style lang="scss" scoped>

</style>
