<script setup lang="ts">
/**
 * Visualises raw JSON facet summary.
 */

import { EntitySchema, ReferenceSchema } from '@/model/evitadb'
import { TabComponentProps } from '@/model/editor/editor'
import { GraphQLConsoleData, GraphQLConsoleParams } from '@/model/editor/graphql-console'
import { computed } from 'vue'
import { LabService, useLabService } from '@/services/lab.service'
import { Toaster, useToaster } from '@/services/editor/toaster'
import LabEditorGraphQLConsoleVisualiserMissingDataIndicator
    from '@/components/lab/editor/graphql-console/visualiser/LabEditorGraphQLConsoleVisualiserMissingDataIndicator.vue'
import LabEditorGraphQLConsoleVisualiserReferenceFacetGroupStatistics
    from '@/components/lab/editor/graphql-console/visualiser/facet-summary/LabEditorGraphQLConsoleVisualiserReferenceFacetGroupStatistics.vue'
import { UnexpectedError } from '@/model/lab'

const labService: LabService = useLabService()
const toaster: Toaster = useToaster()

const props = defineProps<{
    consoleProps: TabComponentProps<GraphQLConsoleParams, GraphQLConsoleData>,
    queryResult: any,
    facetSummaryResult: any,
    entitySchema: EntitySchema,
}>()

const referencesWithGroups = computed<[ReferenceSchema, any][]>(() => {
    const referencesWithGroups: [ReferenceSchema, any][] = []
    for (const referenceName of Object.keys(props.facetSummaryResult)) {
        const referenceSchema: ReferenceSchema | undefined = Object.values(props.entitySchema.references)
            .find(reference => reference.nameVariants.camelCase === referenceName)
        if (referenceSchema == undefined) {
            throw new UnexpectedError(props.consoleProps.params.instancePointer.connection, `Reference '${referenceName}' not found in entity '${props.entitySchema.name}' in catalog '${props.consoleProps.params.instancePointer.catalogName}'.`)
        }
        referencesWithGroups.push([referenceSchema, props.facetSummaryResult[referenceName]])
    }
    return referencesWithGroups
})
</script>

<template>
    <VExpansionPanels v-if="referencesWithGroups && referencesWithGroups.length > 0" variant="accordion">
        <VExpansionPanel v-for="referenceWithGroup in referencesWithGroups" :key="referenceWithGroup[0].name">
            <VExpansionPanelTitle>
                {{ referenceWithGroup[0].name }} ({{ referenceWithGroup[1].length }})
            </VExpansionPanelTitle>
            <VExpansionPanelText>
                <LabEditorGraphQLConsoleVisualiserReferenceFacetGroupStatistics
                    :console-props="consoleProps"
                    :query-result="queryResult"
                    :reference-schema="referenceWithGroup[0]"
                    :group-results="referenceWithGroup[1]"
                />
            </VExpansionPanelText>
        </VExpansionPanel>
    </VExpansionPanels>

    <LabEditorGraphQLConsoleVisualiserMissingDataIndicator
        v-else
        icon="mdi-text-search"
        title="No facet summary groups found."
    />
</template>

<style lang="scss" scoped>

</style>
