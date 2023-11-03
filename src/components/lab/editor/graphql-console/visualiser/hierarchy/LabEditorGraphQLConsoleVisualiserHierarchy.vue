<script setup lang="ts">
/**
 * Visualises raw JSON hierarchies.
 */

import { EntitySchema, ReferenceSchema } from '@/model/evitadb'
import { TabComponentProps } from '@/model/editor/editor'
import { GraphQLConsoleData, GraphQLConsoleParams } from '@/model/editor/graphql-console'
import { computed } from 'vue'
import { Toaster, useToaster } from '@/services/editor/toaster'
import LabEditorGraphQLConsoleVisualiserMissingDataIndicator
    from '@/components/lab/editor/graphql-console/visualiser/LabEditorGraphQLConsoleVisualiserMissingDataIndicator.vue'
import LabEditorGraphQLConsoleVisualiserReferenceNamedHierarchies
    from '@/components/lab/editor/graphql-console/visualiser/hierarchy/LabEditorGraphQLConsoleVisualiserReferenceNamedHierarchies.vue'
import { ResultVisualiserService } from '@/services/editor/result-visualiser/result-visualiser.service'
import { Result } from '@/model/editor/result-visualiser'

const toaster: Toaster = useToaster()

const props = defineProps<{
    consoleProps: TabComponentProps<GraphQLConsoleParams, GraphQLConsoleData>,
    visualiserService: ResultVisualiserService,
    hierarchyResult: Result,
    entitySchema: EntitySchema,
}>()

const referencesWithNamedHierarchiesResults = computed<[ReferenceSchema | undefined, Result][]>(() => {
    try {
        return props.visualiserService
            .getHierarchyService()
            .findNamedHierarchiesByReferencesResults(props.hierarchyResult, props.entitySchema)
    } catch (e: any) {
        toaster.error(e)
        return []
    }
})

function getPanelKey(referenceSchema: ReferenceSchema | undefined): string {
    if (referenceSchema == undefined) {
        return 'self'
    }
    return referenceSchema.name
}
</script>

<template>
    <VExpansionPanels v-if="referencesWithNamedHierarchiesResults && referencesWithNamedHierarchiesResults.length > 0" variant="accordion">
        <VExpansionPanel v-for="referenceWithNamedHierarchResult in referencesWithNamedHierarchiesResults" :key="getPanelKey(referenceWithNamedHierarchResult[0])">
            <VExpansionPanelTitle>
                {{ referenceWithNamedHierarchResult[0]?.name ?? `${entitySchema.name} (self)` }} ({{ Object.values(referenceWithNamedHierarchResult[1]).length }})
            </VExpansionPanelTitle>
            <VExpansionPanelText>
                <LabEditorGraphQLConsoleVisualiserReferenceNamedHierarchies
                    :console-props="consoleProps"
                    :visualiser-service="visualiserService"
                    :parent-entity-schema="entitySchema"
                    :reference-schema="referenceWithNamedHierarchResult[0]"
                    :named-hierarchies-result="referenceWithNamedHierarchResult[1]"
                />
            </VExpansionPanelText>
        </VExpansionPanel>
    </VExpansionPanels>

    <LabEditorGraphQLConsoleVisualiserMissingDataIndicator
        v-else
        icon="mdi-text-search"
        title="No hierarchies found."
    />
</template>

<style lang="scss" scoped>

</style>
