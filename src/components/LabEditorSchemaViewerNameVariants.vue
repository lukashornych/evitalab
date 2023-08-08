<script setup lang="ts">
import { NameVariants } from '@/model/evitadb/schema'
import LabEditorViewerContainer from '@/components/LabEditorSchemaViewerContainer.vue'

const props = defineProps<{
    nameVariants: NameVariants
}>()

const properties: [string, any][] = [
    ['camelCase', props.nameVariants.camelCase as String],
    ['kebab-case', props.nameVariants.kebabCase as String],
    ['PascalCase', props.nameVariants.pascalCase as String],
    ['snake_case', props.nameVariants.snakeCase as String],
    ['UPPER_CASE', props.nameVariants.upperSnakeCase as String]
]
</script>

<template>
    <VExpansionPanel title="Name variants">
        <VExpansionPanelText>
            <LabEditorViewerContainer :properties="properties" />
        </VExpansionPanelText>
    </VExpansionPanel>
</template>

<style lang="scss" scoped>

</style>
