<script setup lang="ts">
/**
 * Explorer tree item representing a single catalog in evitaDB.
 */

import { inject, provide, Ref, ref } from 'vue'
import { LabService, useLabService } from '@/services/lab.service'
import { EvitaDBConnection } from '@/model/lab'
import VTreeViewItem from '@/components/base/VTreeViewItem.vue'
import LabExplorerCollectionItem from './LabExplorerCollectionItem.vue'
import { EditorService, useEditorService } from '@/services/editor/editor.service'
import { Catalog, CatalogSchema } from '@/model/evitadb'
import { Toaster, useToaster } from '@/services/editor/toaster'
import VTreeViewItemEmpty from '@/components/base/VTreeViewItemEmpty.vue'
import { EvitaQLConsoleRequest } from '@/model/editor/tab/evitaQLConsole/EvitaQLConsoleRequest'
import { GraphQLConsoleRequest } from '@/model/editor/tab/graphQLConsole/GraphQLConsoleRequest'
import { GraphQLInstanceType } from '@/model/editor/tab/graphQLConsole/GraphQLInstanceType'
import { SchemaViewerRequest } from '@/model/editor/tab/schemaViewer/SchemaViewerRequest'
import { CatalogSchemaPointer } from '@/model/editor/tab/schemaViewer/CatalogSchemaPointer'
import { useI18n } from 'vue-i18n'

const labService: LabService = useLabService()
const editorService: EditorService = useEditorService()
const toaster: Toaster = useToaster()
const { t } = useI18n()

enum ActionType {
    OpenEvitaQLConsole = 'openEvitaQLConsole',
    OpenGraphQLDataAPIConsole = 'openGraphQLDataApiConsole',
    OpenGraphQLSchemaAPIConsole = 'openGraphQLSchemaApiConsole',
    ViewSchema = 'viewSchema'
}

const actions = ref<object[]>([
    {
        value: ActionType.OpenEvitaQLConsole,
        title: t(`explorer.catalog.actions.${ActionType.OpenEvitaQLConsole}`),
        props: {
            prependIcon: 'mdi-variable'
        }
    },
    {
        value: ActionType.OpenGraphQLDataAPIConsole,
        title: t(`explorer.catalog.actions.${ActionType.OpenGraphQLDataAPIConsole}`),
        props: {
            prependIcon: 'mdi-graphql'
        }
    },
    {
        value: ActionType.OpenGraphQLSchemaAPIConsole,
        title: t(`explorer.catalog.actions.${ActionType.OpenGraphQLSchemaAPIConsole}`),
        props: {
            prependIcon: 'mdi-graphql'
        }
    },
    {
        value: ActionType.ViewSchema,
        title: t(`explorer.catalog.actions.${ActionType.ViewSchema}`),
        props: {
            prependIcon: 'mdi-file-code'
        }
    }
])

const props = defineProps<{
    catalog: Catalog
}>()

const connection = inject('connection') as EvitaDBConnection

const catalogSchema = ref<CatalogSchema>()
provide<Ref<CatalogSchema | undefined>>('catalogSchema', catalogSchema)
const loading = ref<boolean>(false)

async function loadCatalogSchema(): Promise<void> {
    if (catalogSchema.value !== undefined || props.catalog.corrupted) {
        return
    }

    loading.value = true
    try {
        catalogSchema.value = await labService.getCatalogSchema(connection, props.catalog.name)
    } catch (e: any) {
        toaster.error(e)
    }
    loading.value = false
}

function handleAction(action: string) {
    switch (action) {
        case ActionType.OpenEvitaQLConsole:
            editorService.createTab(
                EvitaQLConsoleRequest.createNew(
                    connection,
                    props.catalog.name
                )
            )
            break
        case ActionType.OpenGraphQLDataAPIConsole:
            editorService.createTab(
                GraphQLConsoleRequest.createNew(
                    connection,
                    props.catalog.name,
                    GraphQLInstanceType.Data
                )
            )
            break
        case ActionType.OpenGraphQLSchemaAPIConsole:
            editorService.createTab(
                GraphQLConsoleRequest.createNew(
                    connection,
                    props.catalog.name,
                    GraphQLInstanceType.Schema
                )
            )
            break
        case ActionType.ViewSchema:
            editorService.createTab(
                SchemaViewerRequest.createNew(
                    connection,
                    new CatalogSchemaPointer(props.catalog.name)
                )
            )
            break
    }
}
</script>

<template>
    <VListGroup
        :value="`${connection.name}|${catalog.name}`"
    >
        <template #activator="{ isOpen, props }">
            <VTreeViewItem
                v-if="!catalog.corrupted"
                v-bind="props"
                openable
                :is-open="isOpen"
                prepend-icon="mdi-menu"
                :loading="loading"
                :actions="actions"
                @click="loadCatalogSchema"
                @click:action="handleAction"
                class="font-weight-bold"
            >
                {{ catalog.name }}
                <VTooltip activator="parent">
                    {{ catalog.name }}
                </VTooltip>
            </VTreeViewItem>

            <VTreeViewItem
                v-else
                v-bind="props"
                prepend-icon="mdi-menu"
                class="text-red"
            >
                {{ catalog.name }}
                <VTooltip activator="parent">
                    {{ t('explorer.catalog.errors.couldNotLoad') }}
                </VTooltip>
            </VTreeViewItem>
        </template>

        <div v-if="!catalog.corrupted && catalogSchema !== undefined">
            <template v-if="Object.values(catalogSchema.entitySchemas).length > 0">
                <LabExplorerCollectionItem
                    v-for="entitySchema in Object.values(catalogSchema.entitySchemas)"
                    :key="entitySchema.name"
                    :entity-schema="entitySchema"
                />
            </template>
            <template v-else>
                <VTreeViewItemEmpty />
            </template>
        </div>
    </VListGroup>
</template>

<style scoped>

</style>
