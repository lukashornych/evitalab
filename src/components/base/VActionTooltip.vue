<script setup lang="ts">
/**
 * Tooltip for action (e.g., button to open dialog, save changes, etc.). It supports rendering keyboard shortcuts for the
 * action.
 */

import { Command } from '@/model/editor/keymap/Command'
import { computed } from 'vue'
import { Keymap, useKeymap } from '@/model/editor/keymap/Keymap'
import { useI18n } from 'vue-i18n'

const keymap: Keymap = useKeymap()
const { t } = useI18n()

const props = defineProps<{
    command?: Command
}>()

const keyboardShortcut = computed<string | undefined>(() => {
    if (props.command == undefined) {
        return undefined
    }
    return keymap.prettyPrint(props.command)
})
</script>

<template>
    <VTooltip activator="parent">
        <slot>
            {{ command != undefined ? t(`command.${command}`) : '' }}
        </slot>

        <VChip v-if="command != undefined" class="ml-2">{{ keyboardShortcut }}</VChip>
    </VTooltip>
</template>

<style lang="scss" scoped>

</style>
