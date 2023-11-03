<script setup lang="ts">
/**
 * Visualises the raw JSON result of a GraphQL queries in human-readable GUI.
 */
import { computed, ref, watch } from 'vue'
import LabEditorGraphQLConsoleVisualiserFacetSummary
    from '@/components/lab/editor/graphql-console/visualiser/facet-summary/LabEditorGraphQLConsoleVisualiserFacetSummary.vue'
import { TabComponentProps } from '@/model/editor/editor'
import { GraphQLConsoleData, GraphQLConsoleParams } from '@/model/editor/graphql-console'
import LabEditorGraphQLConsoleVisualiserMissingDataIndicator
    from '@/components/lab/editor/graphql-console/visualiser/LabEditorGraphQLConsoleVisualiserMissingDataIndicator.vue'
import { EntitySchema } from '@/model/evitadb'
import { Toaster, useToaster } from '@/services/editor/toaster'
import VLoadingCircular from '@/components/base/VLoadingCircular.vue'
import LabEditorGraphQLConsoleVisualiserHierarchy
    from '@/components/lab/editor/graphql-console/visualiser/hierarchy/LabEditorGraphQLConsoleVisualiserHierarchy.vue'
import { Result, VisualiserType, VisualiserTypeType } from '@/model/editor/result-visualiser'
import { ResultVisualiserService } from '@/services/editor/result-visualiser/result-visualiser.service'

const toaster: Toaster = useToaster()

const props = defineProps<{
    consoleProps: TabComponentProps<GraphQLConsoleParams, GraphQLConsoleData>,
    visualiserService: ResultVisualiserService,
    result: Result | undefined
}>()


const queries = computed<string[]>(() => {
    if (props.result == undefined) {
        return []
    }
    try {
        return props.visualiserService.findQueries(props.result)
    } catch (e: any) {
        toaster.error(e)
        return []
    }
})
watch(queries, (newValue) => {
    if (selectedQuery.value != undefined && !newValue.includes(selectedQuery.value as string)) {
        // selected query was removed
        selectedQuery.value = undefined
    }
})

const selectedQuery = ref<string | undefined>()
const selectedQueryResult = computed<Result | undefined>(() => {
    if (props.result == undefined || selectedQuery.value == undefined) {
        return undefined
    }
    try {
        return props.visualiserService.findQueryResult(props.result, selectedQuery.value as string)
    } catch (e: any) {
        toaster.error(e)
        return undefined
    }
})
const selectedQueryEntitySchema = ref<EntitySchema | undefined>()
watch(selectedQuery, async () => {
    selectedQueryEntitySchema.value = undefined
    selectedVisualiserType.value = undefined
    if (selectedQuery.value == undefined) {
        return
    }

    try {
        selectedQueryEntitySchema.value = await props.visualiserService.getEntitySchemaForQuery(
            selectedQuery.value as string,
            props.consoleProps.params.instancePointer.connection,
            props.consoleProps.params.instancePointer.catalogName
        )
    } catch (e: any) {
        toaster.error(e)
    }
})


const visualiserTypes = computed<VisualiserType[]>(() => {
    if (selectedQuery.value == undefined || selectedQueryResult.value == undefined) {
        return []
    }
    try {
        return props.visualiserService.findVisualiserTypes(selectedQueryResult.value)
    } catch (e: any) {
        toaster.error(e)
        return []
    }
})
watch(visualiserTypes, (newValue) => {
    if (selectedVisualiserType.value != undefined && !newValue.map(it => it.value).includes(selectedVisualiserType.value as VisualiserTypeType)) {
        // selected result-visualiser type was removed
        selectedVisualiserType.value = undefined
    }
})
const selectedVisualiserType = ref<VisualiserTypeType | undefined>()

const resultForVisualiser = computed<Result | undefined>(() => {
    if (selectedQueryResult.value == undefined || selectedVisualiserType.value == undefined) {
        return undefined
    }
    try {
        return props.visualiserService
            .findResultForVisualiser(selectedQueryResult.value, selectedVisualiserType.value as VisualiserTypeType)
    } catch (e: any) {
        toaster.error(e)
        return undefined
    }
})
</script>

<template>
    <div class="visualiser">
        <header>
            <VSelect
                v-model="selectedQuery"
                :disabled="queries.length == 0"
                prepend-inner-icon="mdi-database-search"
                label="Query"
                :items="queries"
                class="visualiser__select"
                hide-details
            />
            <VSelect
                v-model="selectedVisualiserType"
                :disabled="selectedQuery == undefined"
                prepend-inner-icon="mdi-format-list-bulleted-type"
                label="Visualise"
                :items="visualiserTypes"
                class="visualiser__select"
                hide-details
            />
        </header>

        <LabEditorGraphQLConsoleVisualiserFacetSummary
            v-if="selectedVisualiserType == VisualiserTypeType.FacetSummary && selectedQueryResult != undefined && selectedQueryEntitySchema != undefined && resultForVisualiser != undefined"
            :console-props="consoleProps"
            :visualiser-service="visualiserService"
            :query-result="selectedQueryResult"
            :facet-summary-result="resultForVisualiser"
            :entity-schema="selectedQueryEntitySchema"
        />
        <LabEditorGraphQLConsoleVisualiserHierarchy
            v-if="selectedVisualiserType == VisualiserTypeType.Hierarchy && selectedQueryEntitySchema != undefined && resultForVisualiser != undefined"
            :console-props="consoleProps"
            :visualiser-service="visualiserService"
            :hierarchy-result="resultForVisualiser"
            :entity-schema="selectedQueryEntitySchema"
        />

        <LabEditorGraphQLConsoleVisualiserMissingDataIndicator
            v-else-if="queries.length == 0"
            icon="mdi-text-search"
            title="No queries to visualise"
        />
        <LabEditorGraphQLConsoleVisualiserMissingDataIndicator
            v-else-if="selectedQuery == undefined"
            icon="mdi-database-search"
            title="Select query to visualise"
        />
        <LabEditorGraphQLConsoleVisualiserMissingDataIndicator
            v-else-if="selectedVisualiserType == undefined"
            icon="mdi-format-list-bulleted-type"
            title="Select what to visualise"
        />
        <LabEditorGraphQLConsoleVisualiserMissingDataIndicator v-else-if="selectedQueryResult == undefined || selectedQueryEntitySchema == undefined || resultForVisualiser == undefined">
            <VLoadingCircular :size="64" />
        </LabEditorGraphQLConsoleVisualiserMissingDataIndicator>
    </div>
</template>

<style lang="scss" scoped>
.visualiser {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;

    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    header {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    &__select {
        flex: 1;
        min-width: 10rem;
    }
}


</style>
