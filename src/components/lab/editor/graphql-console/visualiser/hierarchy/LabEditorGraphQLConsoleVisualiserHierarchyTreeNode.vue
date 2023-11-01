<script setup lang="ts">
/**
 * Visualises hierarchy tree node from raw JSON.
 */

import { HierarchyTreeNode } from '@/model/editor/graphql-console'
import LabEditorGraphQLConsoleVisualiserHierarchyTreeNodeTitle
    from '@/components/lab/editor/graphql-console/visualiser/hierarchy/LabEditorGraphQLConsoleVisualiserHierarchyTreeNodeTitle.vue'

const props = defineProps<{
    node: HierarchyTreeNode,
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
            v-for="(node, index) in node.children"
            :key="index"
            :node="node"
            :entity-representative-attributes="entityRepresentativeAttributes"
        />
    </VListGroup>
    <VListItem v-else>
        <LabEditorGraphQLConsoleVisualiserHierarchyTreeNodeTitle :node="node" />
    </VListItem>
</template>

<style lang="scss" scoped>

</style>
