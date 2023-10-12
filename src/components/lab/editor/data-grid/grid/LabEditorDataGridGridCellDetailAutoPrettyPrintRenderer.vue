<script setup lang="ts">

import { Scalar } from '@/model/evitadb'
import { EntityPropertyValueSupportedCodeLanguage } from '@/model/editor/data-grid'
import LabEditorDataGridGridCellDetailMarkdownRenderer
    from '@/components/lab/editor/data-grid/grid/LabEditorDataGridGridCellDetailMarkdownRenderer.vue'
import LabEditorDataGridGridCellDetailCodeRenderer
    from '@/components/lab/editor/data-grid/grid/LabEditorDataGridGridCellDetailCodeRenderer.vue'
import { computed } from 'vue'

enum RendererType {
    Markdown = 'markdown',
    Code = 'code'
}
type ResolvedRenderer = {
    type: RendererType,
}
type CodeRenderer = ResolvedRenderer & {
    codeLanguage: EntityPropertyValueSupportedCodeLanguage
}
type ValueToRender = {
    renderer: ResolvedRenderer,
    value: any
}

const props = withDefaults(defineProps<{
    dataType: Scalar | undefined,
    value: any,
    fillSpace?: boolean
}>(), {
    fillSpace: true
})

const valueToRender = computed<ValueToRender>(() => {
    const valueToRender: ValueToRender = {} as ValueToRender
    if (!props.dataType) {
        valueToRender.renderer = {
            type: RendererType.Code,
            codeLanguage: EntityPropertyValueSupportedCodeLanguage.Raw
        } as CodeRenderer
        if (props.value instanceof Object) {
            valueToRender.value = JSON.stringify(props.value)
        } else {
            valueToRender.value = props.value.toString()
        }
    } else {
        switch (props.dataType) {
            case Scalar.String: {
                const stringValue: string = (props.value as string).trim()
                if (stringValue.startsWith('{') || stringValue.startsWith('[')) {
                    // probably JSON
                    valueToRender.renderer = {
                        type: RendererType.Code,
                        codeLanguage: EntityPropertyValueSupportedCodeLanguage.Json
                    } as CodeRenderer
                    valueToRender.value = stringValue
                } else if (stringValue.startsWith('<')) {
                    // probably XML or its derivative
                    valueToRender.renderer = {
                        type: RendererType.Code,
                        codeLanguage: EntityPropertyValueSupportedCodeLanguage.Xml
                    } as CodeRenderer
                    valueToRender.value = stringValue
                } else {
                    // regular text or something we don't support yet
                    valueToRender.renderer = {
                        type: RendererType.Markdown
                    }
                    valueToRender.value = stringValue
                }
                break
            }
            case Scalar.ComplexDataObject:
                valueToRender.renderer = {
                    type: RendererType.Code,
                    codeLanguage: EntityPropertyValueSupportedCodeLanguage.Json
                } as CodeRenderer
                valueToRender.value = props.value
                break
            default:
                valueToRender.renderer = {
                    type: RendererType.Markdown
                }
                valueToRender.value = props.value
                break
        }
    }
    return valueToRender
})

</script>

<template>
    <LabEditorDataGridGridCellDetailMarkdownRenderer
        v-if="valueToRender.renderer.type === RendererType.Markdown"
        :value="valueToRender.value"
        :data-type="dataType"
    />
    <LabEditorDataGridGridCellDetailCodeRenderer
        v-else-if="valueToRender.renderer.type === RendererType.Code"
        :value="valueToRender.value"
        :code-language="(valueToRender.renderer as CodeRenderer).codeLanguage"
    />
</template>

<style lang="scss" scoped>

</style>
