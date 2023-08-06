<script setup lang="ts">
import { inject, provide, readonly, ref } from 'vue'
import { LabService, useLabService } from '@/services/lab.service'
import { EvitaDBConnection } from '@/model/lab'
import TreeViewItem from '@/components/TreeViewItem.vue'
import LabExplorerCollectionItem from '@/components/LabExplorerCollectionItem.vue'
import { GraphQLConsoleRequest } from '@/model/tab/graphql-console-request'
import { GraphQLInstanceType } from '@/model/tab/graphql-console'
import { EditorService, useEditorService } from '@/services/editor.service'
import { Catalog } from '@/model/evitadb/system'
import { CatalogSchema } from '@/model/evitadb/schema'
import { EvitaQLConsoleRequest } from '@/model/tab/evitaql-console-request'

enum ActionType {
    OpenEvitaQLConsole = 'open-evitaql-console',
    OpenGraphQLDataAPIConsole = 'open-graphql-data-api-console',
    OpenGraphQLSchemaAPIConsole = 'open-graphql-schema-api-console',
    ViewSchema = 'view-schema'
}

const actions = ref<object[]>([
    {
        value: ActionType.OpenEvitaQLConsole,
        title: 'Open EvitaQL console',
        props: {
            prependIcon: 'mdi-console'
        }
    },
    {
        value: ActionType.OpenGraphQLDataAPIConsole,
        title: 'Open GraphQL Data API console',
        props: {
            prependIcon: 'mdi-graphql'
        }
    },
    {
        value: ActionType.OpenGraphQLSchemaAPIConsole,
        title: 'Open GraphQL Schema API console',
        props: {
            prependIcon: 'mdi-graphql'
        }
    },
    {
        value: ActionType.ViewSchema,
        title: 'View schema',
        props: {
            prependIcon: 'mdi-file-code'
        }
    }
])

const labService: LabService = useLabService()
const editorService: EditorService = useEditorService()

const props = defineProps<{
    catalog: Catalog
}>()

const connection = inject('connection') as EvitaDBConnection

const catalogSchema = ref<CatalogSchema>()
provide('catalogSchema', readonly(catalogSchema))

async function loadCatalogSchema(): Promise<void> {
    if (catalogSchema.value !== undefined || props.catalog.corrupted) {
        return
    }
    catalogSchema.value = await labService.getCatalogSchema(connection, props.catalog.name)
}

function handleAction(action: string) {
    switch (action) {
        case ActionType.OpenEvitaQLConsole:
            editorService.createTabRequest(
                new EvitaQLConsoleRequest(
                    connection,
                    props.catalog.name
                )
            )
            break
        case ActionType.OpenGraphQLDataAPIConsole:
            editorService.createTabRequest(
                new GraphQLConsoleRequest(
                    connection,
                    props.catalog.name,
                    GraphQLInstanceType.DATA
                )
            )
            break
        case ActionType.OpenGraphQLSchemaAPIConsole:
            editorService.createTabRequest(
                new GraphQLConsoleRequest(
                    connection,
                    props.catalog.name,
                    GraphQLInstanceType.SCHEMA
                )
            )
            break
        case ActionType.ViewSchema:
            throw new Error('Not implemented yet.')
    }
}
</script>

<template>
    <VListGroup
        :value="catalog.name"
    >
        <template v-slot:activator="{ isOpen, props }">
            <TreeViewItem
                v-if="!catalog.corrupted"
                v-bind="props"
                openable
                :is-open="isOpen"
                prepend-icon="mdi-book-open"
                :actions="actions"
                @click="loadCatalogSchema"
                @click:action="handleAction"
            >
                {{ catalog.name }}
            </TreeViewItem>

            <TreeViewItem
                v-else
                v-bind="props"
                prepend-icon="mdi-book-open"
                class="text-red"
            >
                {{ catalog.name }}
                <VTooltip
                    activator="parent"
                >
                    This catalog couldn't be loaded because it's corrupted.
                </VTooltip>
            </TreeViewItem>
        </template>

        <div v-if="!catalog.corrupted && catalogSchema !== undefined">
            <LabExplorerCollectionItem
                v-for="entitySchema in catalogSchema.allEntitySchemas"
                :key="entitySchema.name"
                :entity-schema="entitySchema"
            />
        </div>
    </VListGroup>
</template>

<style scoped>

</style>
