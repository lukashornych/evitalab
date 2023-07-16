<script setup lang="ts">
import { inject, onMounted, provide, readonly, ref } from 'vue'
import { LabService, useLabService } from '@/services/lab.service'
import { EvitaDBConnection } from '@/model/lab'
import TreeViewItem from '@/components/TreeViewItem.vue'
import LabExplorerCollectionItem from '@/components/LabExplorerCollectionItem.vue'
import { GraphqlConsoleRequest } from '@/model/graphql-console-request'
import { GraphQLInstanceType } from '@/model/graphql-console'
import { EditorService, useEditorService } from '@/services/editor.service'

enum ActionType {
    OpenEvitaQLConsole = 'open-evitaql-console',
    OpenGraphQLDataAPIConsole = 'open-graphql-data-api-console',
    OpenGraphQLSchemaAPIConsole = 'open-graphql-schema-api-console',
    ViewSchema = 'view-schema',
    Delete = 'delete'
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
    },
    {
        value: ActionType.Delete,
        title: 'Delete catalog',
        props: {
            prependIcon: 'mdi-delete'
        }
    },
])

const labService: LabService = useLabService()
const editorService: EditorService = useEditorService()

const props = defineProps<{
    catalog: any
}>()

const connection = inject('connection') as EvitaDBConnection

const catalogSchema = ref({})
provide('catalogSchema', readonly(catalogSchema))

onMounted(async () => {
    if (!props.catalog.corrupted) {
        catalogSchema.value = await labService.getCatalogSchema(connection, props.catalog.name)
    }
})

function handleAction(action: string) {
    switch (action) {
        case ActionType.OpenEvitaQLConsole:
            throw new Error('Not implemented yet.')
        case ActionType.OpenGraphQLDataAPIConsole:
            editorService.createTabRequest(
                new GraphqlConsoleRequest(
                    connection,
                    props.catalog.name,
                    GraphQLInstanceType.DATA
                )
            )
            break
        case ActionType.OpenGraphQLSchemaAPIConsole:
            editorService.createTabRequest(
                new GraphqlConsoleRequest(
                    connection,
                    props.catalog.name,
                    GraphQLInstanceType.SCHEMA
                )
            )
            break
        case ActionType.ViewSchema:
            throw new Error('Not implemented yet.')
        case ActionType.Delete:
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
                v-bind="props"
                openable
                :is-open="isOpen"
                prepend-icon="mdi-book-open"
                :actions="actions"
                @click:action="handleAction"
            >
                {{ catalog.name }}
            </TreeViewItem>
        </template>

        <div
            v-if="!catalog.corrupted"
        >
            <LabExplorerCollectionItem
                v-for="entitySchema in catalogSchema.entitySchemas"
                :key="entitySchema.name"
                :entity-schema="entitySchema"
            />
        </div>
    </VListGroup>
</template>

<style scoped>

</style>
