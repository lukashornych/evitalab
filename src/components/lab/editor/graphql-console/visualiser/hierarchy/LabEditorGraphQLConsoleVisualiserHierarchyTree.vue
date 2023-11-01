<script setup lang="ts">
/**
 * Visualises raw JSON statistics of a single hierarchy.
 */

import { computed, ref } from 'vue'
import { Toaster, useToaster } from '@/services/editor/toaster'
import LabEditorGraphQLConsoleVisualiserHierarchyTreeNode
    from '@/components/lab/editor/graphql-console/visualiser/hierarchy/LabEditorGraphQLConsoleVisualiserHierarchyTreeNode.vue'
import { HierarchyTreeNode } from '@/model/editor/graphql-console'

const toaster: Toaster = useToaster()

const props = defineProps<{
    queryResult: any,
    name: string
    hierarchyTreeResult: any,
    entityRepresentativeAttributes: string[]
}>()

const count = computed<number>(() => {
    return props.hierarchyTreeResult.length
})


const nodesInitialized = ref<boolean>(false)
const nodes = computed<HierarchyTreeNode[]>(() => {
    if (!nodesInitialized.value) {
        return []
    }
    const nodes: HierarchyTreeNode[] = []

    let currentLevel: number = -1
    const nodesStack: HierarchyTreeNode[] = []
    for (const nodeResult of props.hierarchyTreeResult) {
        const level: number = nodeResult['level'] || 1

        const nodeEntity: any = nodeResult['entity']
        const primaryKey: number | undefined = nodeEntity?.['primaryKey']
        // only root nodes should display parents, we know parents in nested nodes from the direct parent in the tree
        const parentPrimaryKey: number | undefined = level === 1 ? nodeEntity?.['parentPrimaryKey'] : undefined
        console.log(level, parentPrimaryKey)
        const title: string | undefined = resolveNodeTitle(nodeEntity)
        const childrenCount: number | undefined = nodeResult['childrenCount']
        const queriedEntityCount: number | undefined = nodeResult['queriedEntityCount']

        if (level <= currentLevel) {
            // flush lower nodes as well as previous neighbour of the current node
            const levelDiff = currentLevel - level + 1
            for (let i = 0; i < levelDiff; i++) {
                flushCurrentNodeToUpper(nodes, nodesStack)
            }
        }

        currentLevel = level
        // prepare current node into the stack
        // todo lho mark requested node, display requested node in header
        nodesStack.push(new HierarchyTreeNode(primaryKey, parentPrimaryKey, title, childrenCount, queriedEntityCount, []))
    }

    // flush remaining nodes
    while (nodesStack.length > 0) {
        flushCurrentNodeToUpper(nodes, nodesStack)
    }

    return nodes
})

function flushCurrentNodeToUpper(nodes: HierarchyTreeNode[], stack: HierarchyTreeNode[]): void {
    const prevNode: HierarchyTreeNode = stack.pop() as HierarchyTreeNode;
    if (stack.length === 0) {
        // root node flush to final node collection
        nodes.push(prevNode);
    } else {
        stack.at(-1).children.push(prevNode);
    }
}

function resolveNodeTitle(nodeEntity: any): string | undefined {
    if (!nodeEntity) {
        return undefined
    }

    const actualEntityRepresentativeAttributes: (string | undefined)[] = []
    const entityAttributes = nodeEntity['attributes'] || {}
    for (const entityAttributeName in entityAttributes) {
        if (!props.entityRepresentativeAttributes.includes(entityAttributeName) && entityAttributeName !== 'title') {
            continue;
        }
        actualEntityRepresentativeAttributes.push(toPrintableAttributeValue(entityAttributes[entityAttributeName]))
    }

    if (actualEntityRepresentativeAttributes.length === 0) {
        return undefined
    }
    return actualEntityRepresentativeAttributes.filter(it => it != undefined).join(', ')
}


function initializeNodes(): void {
    // todo lho this makes quick hide of the facet group, it looks weird
    nodesInitialized.value = !nodesInitialized.value
}

// todo lho refactor into common function
function toPrintableAttributeValue(attributeValue: any): string | undefined {
    if (attributeValue == undefined) {
        return undefined
    }
    if (attributeValue instanceof Array) {
        if (attributeValue.length === 0) {
            return undefined
        }
        return `[${attributeValue.map(it => toPrintableAttributeValue(it)).join(', ')}]`
    } else if (attributeValue instanceof Object) {
        return JSON.stringify(attributeValue)
    } else {
        return attributeValue.toString()
    }
}

</script>

<template>
    <VListGroup>
        <template #activator="{ props }">
            <VListItem v-bind="props" @click="initializeNodes">
                <VListItemTitle class="group-title">
                    <span>{{ name }}</span>

                    <VChipGroup>
                        <VChip prepend-icon="mdi-file-tree">
                            <span>
                                {{ count }}
                                <VTooltip activator="parent">
                                    <!-- todo jno is this what we want to display? At this point we don't have total number of children. -->
                                    <span>The number of actually fetched nodes.</span>
                                </VTooltip>
                            </span>
                        </VChip>
                    </VChipGroup>
                </VListItemTitle>
            </VListItem>
        </template>

        <template v-if="nodesInitialized">
            <LabEditorGraphQLConsoleVisualiserHierarchyTreeNode
                v-for="(node, index) in nodes"
                :key="index"
                :node="node"
                :entity-representative-attributes="entityRepresentativeAttributes"
            />
        </template>
    </VListGroup>
</template>

<style lang="scss" scoped>
// todo lho better handling for small widths
.group-title {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}
</style>
