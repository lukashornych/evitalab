<script setup lang="ts">
/**
 * Visualises hierarchy tree node from raw JSON.
 */

import LabEditorGraphQLConsoleVisualiserHierarchyTreeNodeTitle
    from '@/components/lab/editor/graphql-console/visualiser/hierarchy/LabEditorGraphQLConsoleVisualiserHierarchyTreeNodeTitle.vue'
import { VisualisedHierarchyTreeNode } from '@/model/editor/result-visualiser'

const props = defineProps<{
    node: VisualisedHierarchyTreeNode,
    entityRepresentativeAttributes: string[]
}>()

</script>

<template>
    <VListGroup v-if="!node.isLeaf()">
        <template #activator="{ props }">
            <VListItem v-bind="props">
                <LabEditorGraphQLConsoleVisualiserHierarchyTreeNodeTitle :node="node" />
            </VListItem>
        </template>

        <LabEditorGraphQLConsoleVisualiserHierarchyTreeNode
            v-for="(childNode, index) in node.children"
            :key="index"
            :node="childNode"
            :entity-representative-attributes="entityRepresentativeAttributes"
        />
    </VListGroup>
    <VListItem v-else>
        <LabEditorGraphQLConsoleVisualiserHierarchyTreeNodeTitle :node="node" />
    </VListItem>
</template>

<style lang="scss" scoped>

</style>
