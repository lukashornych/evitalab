<script setup lang="ts">
import { NameVariants } from '@/model/evitadb/schema'
import LabEditorViewerContainer from '@/components/LabEditorSchemaViewerContainer.vue'
import LabEditorSchemaViewerPanelGroupItem from '@/components/LabEditorSchemaViewerPanelGroupItem.vue'

const props = withDefaults(defineProps<{
    prefix?: string,
    nameVariants: NameVariants
}>(), {
    prefix: ''
})

const name = props.prefix ? `${props.prefix} name variants` : 'Name variants'

const properties: [string, any][] = [
    ['camelCase', props.nameVariants.camelCase as String],
    ['kebab-case', props.nameVariants.kebabCase as String],
    ['PascalCase', props.nameVariants.pascalCase as String],
    ['snake_case', props.nameVariants.snakeCase as String],
    ['UPPER_CASE', props.nameVariants.upperSnakeCase as String]
]
</script>

<template>
    <LabEditorSchemaViewerPanelGroupItem :name="name">
        <LabEditorViewerContainer :properties="properties" />
    </LabEditorSchemaViewerPanelGroupItem>
</template>

<style lang="scss" scoped>

</style>
