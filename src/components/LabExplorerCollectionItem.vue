<script setup lang="ts">

import TreeViewItem from '@/components/TreeViewItem.vue'
import { EvitaDBConnection } from '@/model/lab'
import { inject, ref } from 'vue'
import { EditorService, useEditorService } from '@/services/editor.service'
import { DataGridConsoleRequest } from '@/model/tab/data-grid-console-request'
import { GraphQLConsoleRequest } from '@/model/tab/graphql-console-request'
import { GraphQLInstanceType } from '@/model/tab/graphql-console'
import { CatalogSchema, EntitySchema } from '@/model/evitadb/schema'

enum ActionType {
    ViewEntities = 'view-entities',
    OpenEvitaQLConsole = 'open-evitaql-console',
    OpenGraphQLDataAPIConsole = 'open-graphql-data-api-console',
    OpenGraphQLSchemaAPIConsole = 'open-graphql-schema-api-console',
    ViewSchema = 'view-schema',
    Delete = 'delete'
}

const actions = ref<object[]>([
    {
        value: ActionType.ViewEntities,
        title: 'View entities',
        props: {
            prependIcon: 'mdi-table'
        }
    },
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
        title: 'Delete collection',
        props: {
            prependIcon: 'mdi-delete'
        }
    },
])

const editorService: EditorService = useEditorService()

const props = defineProps<{
    entitySchema: EntitySchema
}>()

const connection = inject('connection') as EvitaDBConnection
const catalogSchema = inject('catalogSchema').value as CatalogSchema

function openDataGrid() {
    editorService.createTabRequest(new DataGridConsoleRequest(
        connection as EvitaDBConnection,
        catalogSchema.name,
        props.entitySchema.name
    ))
}

function handleAction(action: string) {
    switch (action) {
        case ActionType.ViewEntities:
            openDataGrid()
            break
        case ActionType.OpenEvitaQLConsole:
            throw new Error('Not implemented yet.')
        case ActionType.OpenGraphQLDataAPIConsole:
            editorService.createTabRequest(
                new GraphQLConsoleRequest(
                    connection,
                    catalogSchema.name,
                    GraphQLInstanceType.DATA
                )
            )
            break
        case ActionType.OpenGraphQLSchemaAPIConsole:
            editorService.createTabRequest(
                new GraphQLConsoleRequest(
                    connection,
                    catalogSchema.name,
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
    <TreeViewItem
        prepend-icon="mdi-list-box"
        :actions="actions"
        @click="openDataGrid"
        @click:action="handleAction"
    >
        {{ entitySchema.name }}
    </TreeViewItem>
</template>

<style lang="scss" scoped>

</style>
