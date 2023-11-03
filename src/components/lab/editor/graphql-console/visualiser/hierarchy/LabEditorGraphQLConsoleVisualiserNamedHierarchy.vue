<script setup lang="ts">
/**
 * Visualises raw JSON statistics of a single hierarchy.
 */

import { computed, ref } from 'vue'
import { Toaster, useToaster } from '@/services/editor/toaster'
import LabEditorGraphQLConsoleVisualiserHierarchyTreeNode
    from '@/components/lab/editor/graphql-console/visualiser/hierarchy/LabEditorGraphQLConsoleVisualiserHierarchyTreeNode.vue'
import { Result, VisualisedNamedHierarchy } from '@/model/editor/result-visualiser'
import { ResultVisualiserService } from '@/services/editor/result-visualiser/result-visualiser.service'

const toaster: Toaster = useToaster()

const props = defineProps<{
    visualiserService: ResultVisualiserService,
    name: string
    namedHierarchyResult: Result[],
    entityRepresentativeAttributes: string[]
}>()

const namedHierarchy = computed<VisualisedNamedHierarchy | undefined>(() => {
    try {
        return props.visualiserService
            .getHierarchyService()
            .resolveNamedHierarchy(props.namedHierarchyResult, props.entityRepresentativeAttributes)
    } catch (e: any) {
        toaster.error(e)
        return undefined
    }
})

const initialized = ref<boolean>(false)
function initialize(): void {
    // todo lho this makes quick hide of the facet group, it looks weird
    initialized.value = !initialized.value
}

</script>

<template>
    <VListGroup>
        <template #activator="{ props }">
            <VListItem v-bind="props" @click="initialize">
                <VListItemTitle class="group-title">
                    <span>{{ name }}</span>

                    <VChipGroup>
                        <VChip prepend-icon="mdi-file-tree">
                            <span>
                                {{ namedHierarchy?.count }}
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

        <template v-if="initialized">
            <LabEditorGraphQLConsoleVisualiserHierarchyTreeNode
                v-for="(tree, index) in namedHierarchy?.trees"
                :key="index"
                :node="tree"
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
