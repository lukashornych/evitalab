<script setup lang="ts">
/**
 * Visualises raw JSON facet summary.
 */

import { EntitySchema, ReferenceSchema } from '@/model/evitadb'
import { TabComponentProps } from '@/model/editor/editor'
import { GraphQLConsoleData, GraphQLConsoleParams } from '@/model/editor/graphql-console'
import { computed } from 'vue'
import { Toaster, useToaster } from '@/services/editor/toaster'
import LabEditorGraphQLConsoleVisualiserMissingDataIndicator
    from '@/components/lab/editor/graphql-console/visualiser/LabEditorGraphQLConsoleVisualiserMissingDataIndicator.vue'
import LabEditorGraphQLConsoleVisualiserReferenceFacetGroupStatistics
    from '@/components/lab/editor/graphql-console/visualiser/facet-summary/LabEditorGraphQLConsoleVisualiserReferenceFacetGroupStatistics.vue'
import { ResultVisualiserService } from '@/services/editor/result-visualiser/result-visualiser.service'
import { Result } from '@/model/editor/result-visualiser'

const toaster: Toaster = useToaster()

const props = defineProps<{
    consoleProps: TabComponentProps<GraphQLConsoleParams, GraphQLConsoleData>,
    visualiserService: ResultVisualiserService,
    queryResult: Result,
    facetSummaryResult: Result,
    entitySchema: EntitySchema,
}>()

const referencesWithGroupStatisticsResults = computed<[ReferenceSchema, Result[]][]>(() => {
    try {
        return props.visualiserService
            .getFacetSummaryService()
            .findFacetGroupStatisticsByReferencesResults(props.facetSummaryResult, props.entitySchema)
    } catch (e: any) {
        toaster.error(e.message)
        return []
    }
})
</script>

<template>
    <VExpansionPanels v-if="referencesWithGroupStatisticsResults && referencesWithGroupStatisticsResults.length > 0" variant="accordion">
        <VExpansionPanel v-for="referenceWithGroup in referencesWithGroupStatisticsResults" :key="referenceWithGroup[0].name">
            <VExpansionPanelTitle>
                {{ referenceWithGroup[0].name }} ({{ referenceWithGroup[1].length }})
            </VExpansionPanelTitle>
            <VExpansionPanelText>
                <LabEditorGraphQLConsoleVisualiserReferenceFacetGroupStatistics
                    :console-props="consoleProps"
                    :visualiser-service="visualiserService"
                    :query-result="queryResult"
                    :reference-schema="referenceWithGroup[0]"
                    :group-statistics-results="referenceWithGroup[1]"
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
