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
import { CatalogSchema, EntitySchema } from '@/model/evitadb'
import { LabService, useLabService } from '@/services/lab.service'
import { Toaster, useToaster } from '@/services/editor/toaster'
import { UnexpectedError } from '@/model/lab'
import VLoadingCircular from '@/components/base/VLoadingCircular.vue'
import LabEditorGraphQLConsoleVisualiserHierarchy
    from '@/components/lab/editor/graphql-console/visualiser/hierarchy/LabEditorGraphQLConsoleVisualiserHierarchy.vue'

enum VisualiserType {
    FacetSummary = 'facet-summary',
    Hierarchy = 'hierarchy'
}

const labService: LabService = useLabService()
const toaster: Toaster = useToaster()

const props = defineProps<{
    consoleProps: TabComponentProps<GraphQLConsoleParams, GraphQLConsoleData>,
    result: any | undefined
}>()

const queries = computed<string[]>(() => {
    if (props.result == undefined) {
        return []
    }
    const data: any | undefined = props.result['data']
    if (data == undefined) {
        return []
    }
    // we currently support visualisations only of extra results, so we need only full queries
    return Object.keys(data)
})
watch(queries, (newValue) => {
    if (selectedQuery.value != undefined && !newValue.includes(selectedQuery.value as string)) {
        // selected query was removed
        selectedQuery.value = undefined
    }
})

const selectedQuery = ref<string | undefined>()
const selectedQueryResult = computed<any | undefined>(() => {
    if (selectedQuery.value == undefined) {
        return undefined
    }
    const data: any | undefined = props.result['data']
    if (data == undefined) {
        return undefined
    }
    return data[selectedQuery.value]
})
const selectedQueryEntitySchema = ref<EntitySchema | undefined>()
watch(selectedQuery, async () => {
    selectedQueryEntitySchema.value = undefined
    selectedVisualiserType.value = undefined
    if (selectedQuery.value == undefined) {
        return
    }

    const entityType: string = (selectedQuery.value as string).replace(/^(get|list|query)/, '')
    const catalogSchema: CatalogSchema = await labService.getCatalogSchema(
        props.consoleProps.params.instancePointer.connection,
        props.consoleProps.params.instancePointer.catalogName
    )
    const entitySchema: EntitySchema | undefined = Object.values(catalogSchema.entitySchemas)
        .find(it => it.nameVariants.pascalCase === entityType)
    if (entitySchema == undefined) {
        toaster.error(new UnexpectedError(props.consoleProps.params.instancePointer.connection, `Entity schema '${entityType}' not found in catalog '${props.consoleProps.params.instancePointer.catalogName}'.`))
    }

    selectedQueryEntitySchema.value = entitySchema
})


const visualiserTypes = computed<any[]>(() => {
    if (selectedQuery.value == undefined || selectedQueryResult.value == undefined) {
        return []
    }

    const visualiserTypes: any | undefined = []

    const extraResults = selectedQueryResult.value['extraResults']
    if (extraResults) {
        if (extraResults['facetSummary']) {
            visualiserTypes.push({
                title: 'Facet summary',
                value: VisualiserType.FacetSummary
            })
        }
        if (extraResults['hierarchy']) {
            visualiserTypes.push({
                title: 'Hierarchy',
                value: VisualiserType.Hierarchy
            })
        }
    }

    return visualiserTypes
})
watch(visualiserTypes, (newValue) => {
    if (selectedVisualiserType.value != undefined && !newValue.map(it => it.value).includes(selectedVisualiserType.value as string)) {
        // selected visualiser type was removed
        selectedVisualiserType.value = undefined
    }
})
const selectedVisualiserType = ref<string | undefined>()

const resultForVisualiser = computed<any | undefined>(() => {
    switch (selectedVisualiserType.value) {
        case VisualiserType.FacetSummary:
            return selectedQueryResult.value?.['extraResults']?.['facetSummary']
        case VisualiserType.Hierarchy:
            return selectedQueryResult.value?.['extraResults']?.['hierarchy']
        default:
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
            v-if="selectedVisualiserType == VisualiserType.FacetSummary && selectedQueryEntitySchema != undefined && resultForVisualiser != undefined"
            :console-props="consoleProps"
            :query-result="selectedQueryResult"
            :facet-summary-result="resultForVisualiser"
            :entity-schema="selectedQueryEntitySchema"
        />
        <LabEditorGraphQLConsoleVisualiserHierarchy
            v-if="selectedVisualiserType == VisualiserType.Hierarchy && selectedQueryEntitySchema != undefined && resultForVisualiser != undefined"
            :console-props="consoleProps"
            :query-result="selectedQueryResult"
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
        <LabEditorGraphQLConsoleVisualiserMissingDataIndicator v-else-if="selectedQueryEntitySchema == undefined || resultForVisualiser == undefined">
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
