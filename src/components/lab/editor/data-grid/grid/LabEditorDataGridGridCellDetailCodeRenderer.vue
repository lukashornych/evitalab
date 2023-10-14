<script setup lang="ts">

import CodemirrorFull from '@/components/base/CodemirrorFull.vue'
import { EntityPropertyValueSupportedCodeLanguage } from '@/model/editor/data-grid'
import { computed, ref } from 'vue'
import { Toaster, useToaster } from '@/services/editor/toaster'
import { Extension } from '@codemirror/state'
import { json } from '@codemirror/lang-json'
import { xml } from '@codemirror/lang-xml'
import { UnexpectedError } from '@/model/lab'
import LabEditorDataGridGridCellDetailValueRenderer
    from '@/components/lab/editor/data-grid/grid/LabEditorDataGridGridCellDetailValueRenderer.vue'
import { DataGridConsoleService, useDataGridConsoleService } from '@/services/editor/data-grid-console.service'

const toaster: Toaster = useToaster()
const dataGridConsoleService: DataGridConsoleService = useDataGridConsoleService()

enum ActionType {
    Copy = 'copy',
    PrettyPrint = 'pretty-print'
}

const props = withDefaults(defineProps<{
    value: any,
    codeLanguage?: EntityPropertyValueSupportedCodeLanguage,
    fillSpace?: boolean
}>(), {
    codeLanguage: EntityPropertyValueSupportedCodeLanguage.Raw,
    fillSpace: true
})

const prettyPrint = ref<boolean>(true)
const actions = computed(() => {
    const actions = [
        {
            title: 'Copy',
            value: ActionType.Copy,
            props: {
                prependIcon: 'mdi-content-copy'
            }
        }
    ]
    if (props.codeLanguage !== EntityPropertyValueSupportedCodeLanguage.Raw) {
        actions.push({
            title: prettyPrint.value ? 'Display raw value' : 'Pretty print value',
            value: ActionType.PrettyPrint,
            props: {
                prependIcon: prettyPrint.value ? 'mdi-raw' : 'mdi-auto-fix'
            }
        })
    }
    return actions
})
const formattedValue = computed<string>(() => {
    try {
        return dataGridConsoleService.formatEntityPropertyValue(props.value, props.codeLanguage, prettyPrint.value)
    } catch (e) {
        return 'Error: Failed to format value as ' + props.codeLanguage + '.'
    }
})
const codeBlockExtensions = computed<Extension[]>(() => {
    if (!formattedValue.value) {
        return []
    }
    switch (props.codeLanguage) {
        case EntityPropertyValueSupportedCodeLanguage.Raw:
            return []
        case EntityPropertyValueSupportedCodeLanguage.Json:
            return [json()]
        case EntityPropertyValueSupportedCodeLanguage.Xml:
            return [xml()]
        default:
            toaster.error(new UnexpectedError(undefined, 'Unsupported code language.'))
            return []
    }
})

function handleActionClick(action: any) {
    switch (action) {
        case ActionType.Copy:
            copyRenderedValue()
            break
        case ActionType.PrettyPrint:
            prettyPrint.value = !prettyPrint.value
            break
    }
}

function copyRenderedValue() {
    navigator.clipboard.writeText(formattedValue.value).then(() => {
        toaster.info('Copied to clipboard.')
    }).catch(() => {
        toaster.error(new UnexpectedError(undefined, 'Failed to copy to clipboard.'))
    })
}
</script>

<template>
    <LabEditorDataGridGridCellDetailValueRenderer
        :fill-space="fillSpace"
        :actions="actions"
        @click:action="handleActionClick"
    >
        <CodemirrorFull
            :model-value="formattedValue"
            read-only
            :additional-extensions="codeBlockExtensions"
        />
    </LabEditorDataGridGridCellDetailValueRenderer>
</template>

<style lang="scss" scoped>

</style>