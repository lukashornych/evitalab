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
    from '@/components/lab/editor/graphql-console/visualiser/LabEditorGraphQLConsoleVisualiserReferenceFacetGroupStatistics.vue'
import { UnexpectedError } from '@/model/lab'

const labService: LabService = useLabService()
const toaster: Toaster = useToaster()

const props = defineProps<{
    consoleProps: TabComponentProps<GraphQLConsoleParams, GraphQLConsoleData>,
    queryResult: any,
    facetSummaryResult: any,
    entitySchema: EntitySchema,
}>()

const groups = computed<[ReferenceSchema, any][]>(() => {
    const referenceGroups: [ReferenceSchema, any][] = []
    for (const referenceName of Object.keys(props.facetSummaryResult)) {
        const referenceSchema: ReferenceSchema | undefined = Object.values(props.entitySchema.references)
            .find(reference => reference.nameVariants.camelCase === referenceName)
        if (referenceSchema == undefined) {
            throw new UnexpectedError(props.consoleProps.params.instancePointer.connection, `Reference '${referenceName}' not found in entity '${props.entitySchema.name}' in catalog '${props.consoleProps.params.instancePointer.catalogName}'.`)
        }
        referenceGroups.push([referenceSchema, props.facetSummaryResult[referenceName]])
    }
    return referenceGroups
})
</script>

<template>
    <VExpansionPanels v-if="groups && groups.length > 0" variant="accordion">
        <VExpansionPanel v-for="group in groups" :key="group[0].name">
            <VExpansionPanelTitle>
                {{ group[0].name }} ({{ group[1].length }})
            </VExpansionPanelTitle>
            <VExpansionPanelText>
                <LabEditorGraphQLConsoleVisualiserReferenceFacetGroupStatistics
                    :console-props="consoleProps"
                    :query-result="queryResult"
                    :reference-schema="group[0]"
                    :groups="group[1]"
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
