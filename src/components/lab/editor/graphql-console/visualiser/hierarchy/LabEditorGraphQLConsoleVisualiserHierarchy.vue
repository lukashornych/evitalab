<script setup lang="ts">
/**
 * Visualises raw JSON hierarchies.
 */

import { EntitySchema, ReferenceSchema } from '@/model/evitadb'
import { TabComponentProps } from '@/model/editor/editor'
import { GraphQLConsoleData, GraphQLConsoleParams } from '@/model/editor/graphql-console'
import { computed } from 'vue'
import { LabService, useLabService } from '@/services/lab.service'
import { Toaster, useToaster } from '@/services/editor/toaster'
import { UnexpectedError } from '@/model/lab'
import LabEditorGraphQLConsoleVisualiserMissingDataIndicator
    from '@/components/lab/editor/graphql-console/visualiser/LabEditorGraphQLConsoleVisualiserMissingDataIndicator.vue'
import LabEditorGraphQLConsoleVisualiserReferenceHierarchies
    from '@/components/lab/editor/graphql-console/visualiser/hierarchy/LabEditorGraphQLConsoleVisualiserReferenceHierarchies.vue'

const labService: LabService = useLabService()
const toaster: Toaster = useToaster()

const props = defineProps<{
    consoleProps: TabComponentProps<GraphQLConsoleParams, GraphQLConsoleData>,
    queryResult: any,
    hierarchyResult: any,
    entitySchema: EntitySchema,
}>()

const referencesWithHierarchies = computed<[ReferenceSchema | undefined, any][]>(() => {
    const referencesWithHierarchies: [ReferenceSchema | undefined, any][] = []
    for (const referenceName of Object.keys(props.hierarchyResult)) {
        const hierarchiesResult = props.hierarchyResult[referenceName]
        if (referenceName === 'self') {
            referencesWithHierarchies.push([undefined, hierarchiesResult])
        } else {
            const referenceSchema: ReferenceSchema | undefined = Object.values(props.entitySchema.references)
                .find(reference => reference.nameVariants.camelCase === referenceName)
            if (referenceSchema == undefined) {
                throw new UnexpectedError(props.consoleProps.params.instancePointer.connection, `Reference '${referenceName}' not found in entity '${props.entitySchema.name}' in catalog '${props.consoleProps.params.instancePointer.catalogName}'.`)
            }
            referencesWithHierarchies.push([referenceSchema, hierarchiesResult])
        }
    }
    return referencesWithHierarchies
})

function getPanelKey(referenceSchema: ReferenceSchema | undefined): string {
    if (referenceSchema == undefined) {
        return 'self'
    }
    return referenceSchema.name
}
</script>

<template>
    <VExpansionPanels v-if="referencesWithHierarchies && referencesWithHierarchies.length > 0" variant="accordion">
        <VExpansionPanel v-for="referenceWithHierarchies in referencesWithHierarchies" :key="getPanelKey(referenceWithHierarchies[0])">
            <VExpansionPanelTitle>
                {{ referenceWithHierarchies[0]?.name ?? `${entitySchema.name} (self)` }} ({{ Object.values(referenceWithHierarchies[1]).length }})
            </VExpansionPanelTitle>
            <VExpansionPanelText>
                <LabEditorGraphQLConsoleVisualiserReferenceHierarchies
                    :console-props="consoleProps"
                    :query-result="queryResult"
                    :parent-entity-schema="entitySchema"
                    :reference-schema="referenceWithHierarchies[0]"
                    :hierarchy-results="referenceWithHierarchies[1]"
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
