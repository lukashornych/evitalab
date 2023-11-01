<script setup lang="ts">
/**
 * Visualises raw JSON hierarchies of a single reference
 */
import { ref } from 'vue'
import { EntitySchema, ReferenceSchema } from '@/model/evitadb'
import { LabService, useLabService } from '@/services/lab.service'
import { Toaster, useToaster } from '@/services/editor/toaster'
import { TabComponentProps } from '@/model/editor/editor'
import { GraphQLConsoleData, GraphQLConsoleParams } from '@/model/editor/graphql-console'
import LabEditorGraphQLConsoleVisualiserHierarchyTree
    from '@/components/lab/editor/graphql-console/visualiser/hierarchy/LabEditorGraphQLConsoleVisualiserHierarchyTree.vue'

const labService: LabService = useLabService()
const toaster: Toaster = useToaster()

const props = defineProps<{
    consoleProps: TabComponentProps<GraphQLConsoleParams, GraphQLConsoleData>,
    queryResult: any,
    hierarchyResults: any,
    parentEntitySchema: EntitySchema,
    referenceSchema: ReferenceSchema | undefined
}>()

const initialized = ref<boolean>(false)
const entityRepresentativeAttributes: string[] = []

function initialize() {
    let pipeline: Promise<string[]>
    if (!props.referenceSchema) {
        pipeline = new Promise(resolve => {
            const representativeAttributes: string[] = Object.values(props.parentEntitySchema.attributes)
                .filter(attributeSchema => 'representative' in attributeSchema && attributeSchema.representative)
                .map(attributeSchema => attributeSchema.nameVariants.camelCase)
            resolve(representativeAttributes)
        })
    } else if (!props.referenceSchema.referencedEntityTypeManaged) {
        pipeline = new Promise(resolve => resolve([]))
    } else {
        pipeline = labService.getEntitySchema(
            props.consoleProps.params.instancePointer.connection,
            props.consoleProps.params.instancePointer.catalogName,
            props.referenceSchema.referencedEntityType as string
        )
            .then((entitySchema: EntitySchema) => {
                return Object.values(entitySchema.attributes)
                    .filter(attributeSchema => 'representative' in attributeSchema && attributeSchema.representative)
                    .map(attributeSchema => attributeSchema.nameVariants.camelCase)
            })
    }

    pipeline.then((representativeAttributes: string[]) => {
        entityRepresentativeAttributes.push(...representativeAttributes)
        initialized.value = true
    })
}
initialize()
</script>

<template>
    <VList v-if="initialized" density="compact">
        <LabEditorGraphQLConsoleVisualiserHierarchyTree
            v-for="(hierarchyTreeResult, name) in hierarchyResults"
            :key="name"
            :console-props="consoleProps"
            :query-result="queryResult"
            :name="name as string"
            :hierarchy-tree-result="hierarchyTreeResult"
            :entity-representative-attributes="entityRepresentativeAttributes"
        />
    </VList>
</template>

<style lang="scss" scoped>

</style>
