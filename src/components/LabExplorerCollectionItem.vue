<script setup lang="ts">

import TreeViewItem from '@/components/TreeViewItem.vue'
import { EvitaDBConnection } from '@/model/lab'
import { inject, ref } from 'vue'
import { EditorService, useEditorService } from '@/services/editor.service'

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
    entitySchema: object
}>()

const connection = inject('connection')
const catalogSchema = inject('catalogSchema')

function openDataGrid() {
    // editorService.createTab(null)
    throw new Error('Not implemented')
}
</script>

<template>
    <TreeViewItem
        prepend-icon="mdi-list-box"
        :actions="actions"
        @click="openDataGrid"
    >
        {{ entitySchema.name }}
    </TreeViewItem>
</template>

<style lang="scss" scoped>

</style>
