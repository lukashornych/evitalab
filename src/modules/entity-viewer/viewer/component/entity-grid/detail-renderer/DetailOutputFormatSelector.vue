<script setup lang="ts">
/**
 * Selects the desired output format for a cell detail value.
 */

import { EntityPropertyValueDesiredOutputFormat } from '@/model/editor/tab/dataGrid/data-grid'
import { useI18n} from 'vue-i18n'

const { t } = useI18n()

const formats: any[] = [
    {
        title: t(`entityGrid.grid.renderer.format.${EntityPropertyValueDesiredOutputFormat.AutoPrettyPrint}`),
        value: EntityPropertyValueDesiredOutputFormat.AutoPrettyPrint,
        props: {
            prependIcon: 'mdi-auto-fix'
        }
    },
    {
        title: t(`entityGrid.grid.renderer.format.${EntityPropertyValueDesiredOutputFormat.Raw}`),
        value: EntityPropertyValueDesiredOutputFormat.Raw,
        props: {
            prependIcon: 'mdi-text'
        }
    },
    {
        title: t(`entityGrid.grid.renderer.format.${EntityPropertyValueDesiredOutputFormat.Markdown}`),
        value: EntityPropertyValueDesiredOutputFormat.Markdown,
        props: {
            prependIcon: 'mdi-language-markdown-outline'
        }
    },
    {
        title: t(`entityGrid.grid.renderer.format.${EntityPropertyValueDesiredOutputFormat.Json}`),
        value: EntityPropertyValueDesiredOutputFormat.Json,
        props: {
            prependIcon: 'mdi-code-json'
        }
    },
    {
        title: t(`entityGrid.grid.renderer.format.${EntityPropertyValueDesiredOutputFormat.Xml}`),
        value: EntityPropertyValueDesiredOutputFormat.Xml,
        props: {
            prependIcon: 'mdi-xml'
        }
    },
    {
        title: t(`entityGrid.grid.renderer.format.${EntityPropertyValueDesiredOutputFormat.Html}`),
        value: EntityPropertyValueDesiredOutputFormat.Html,
        props: {
            prependIcon: 'mdi-language-html5'
        }
    }
]

const props = defineProps<{
    modelValue: EntityPropertyValueDesiredOutputFormat
}>()
const emit = defineEmits<{
    (e: 'update:modelValue', value: EntityPropertyValueDesiredOutputFormat): void
}>()
</script>

<template>
    <VMenu>
        <template #activator="{ props }">
            <VBtn
                icon
                variant="text"
                density="compact"
                v-bind="props"
            >
                <VIcon>mdi-code-braces</VIcon>
                <VTooltip activator="parent">
                    {{ t('entityGrid.grid.renderer.button.selectOutputFormat') }}
                </VTooltip>
            </VBtn>
        </template>
        <VList
            :selected="[modelValue]"
            :items="formats"
            @update:selected="emit('update:modelValue', $event[0] as EntityPropertyValueDesiredOutputFormat)"
        />
    </VMenu>
</template>

<style lang="scss" scoped>

</style>
