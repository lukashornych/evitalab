<script setup lang="ts">
/**
 * Explorer tree item representing a single catalog in evitaDB.
 */

import { computed, ref, Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Catalog } from '@/modules/connection/model/Catalog'
import { Connection } from '@/modules/connection/model/Connection'
import { MenuAction } from '@/modules/base/model/menu/MenuAction'
import { CatalogActionType } from '@/modules/connection/explorer/model/CatalogActionType'
import { GraphQLInstanceType } from '@/modules/graphql-console/console/model/GraphQLInstanceType'
import { CatalogSchemaPointer } from '@/modules/schema-viewer/viewer/model/CatalogSchemaPointer'
import { useWorkspaceService, WorkspaceService } from '@/modules/workspace/service/WorkspaceService'
import {
    EvitaQLConsoleTabFactory,
    useEvitaQLConsoleTabFactory
} from '@/modules/evitaql-console/console/workspace/service/EvitaQLConsoleTabFactory'
import {
    GraphQLConsoleTabFactory,
    useGraphQLConsoleTabFactory
} from '@/modules/graphql-console/console/workspace/service/GraphQLConsoleTabFactory'
import {
    SchemaViewerTabFactory,
    useSchemaViewerTabFactory
} from '@/modules/schema-viewer/viewer/workspace/service/SchemaViewerTabFactory'
import VTreeViewItem from '@/modules/base/component/VTreeViewItem.vue'
import VTreeViewEmptyItem from '@/modules/base/component/VTreeViewEmptyItem.vue'
import CollectionItem from '@/modules/connection/explorer/component/CollectionItem.vue'
import { provideCatalog, useConnection } from '@/modules/connection/explorer/component/dependecies'
import { MenuItem } from '@/modules/base/model/menu/MenuItem'
import { MenuSubheader } from '@/modules/base/model/menu/MenuSubheader'
import { EvitaLabConfig, useEvitaLabConfig } from '@/modules/config/EvitaLabConfig'
import RenameCatalogDialog from '@/modules/connection/explorer/component/RenameCatalogDialog.vue'
import DropCatalogDialog from '@/modules/connection/explorer/component/DropCatalogDialog.vue'
import ReplaceCatalogDialog from '@/modules/connection/explorer/component/ReplaceCatalogDialog.vue'
import CreateCollectionDialog from '@/modules/connection/explorer/component/CreateCollectionDialog.vue'
import SwitchCatalogToAliveStateDialog
    from '@/modules/connection/explorer/component/SwitchCatalogToAliveStateDialog.vue'

const evitaLabConfig: EvitaLabConfig = useEvitaLabConfig()
const workspaceService: WorkspaceService = useWorkspaceService()
const evitaQLConsoleTabFactory: EvitaQLConsoleTabFactory = useEvitaQLConsoleTabFactory()
const graphQLConsoleTabFactory: GraphQLConsoleTabFactory = useGraphQLConsoleTabFactory()
const schemaViewerTabFactory: SchemaViewerTabFactory = useSchemaViewerTabFactory()
const { t } = useI18n()

const props = defineProps<{
    catalog: Catalog
}>()
const emit = defineEmits<{ (e: 'change'): void }>()

const showRenameCatalogDialog = ref<boolean>(false)
const showReplaceCatalogDialog = ref<boolean>(false)
const showSwitchCatalogToAliveStateDialog = ref<boolean>(false)
const showDropCatalogDialog = ref<boolean>(false)
const showCreateCollectionDialog = ref<boolean>(false)

const connection: Connection = useConnection()
const actions = computed<Map<CatalogActionType, MenuItem<CatalogActionType>>>(() => createActions())
const actionList = computed<MenuItem<CatalogActionType>[]>(() => Array.from(actions.value.values()))

const catalogRef = ref(props.catalog)
provideCatalog(catalogRef as Ref<Catalog>)

const loading = ref<boolean>(false)

function handleAction(action: string): void {
    const foundedAction = actions.value?.get(action as CatalogActionType)
    if (foundedAction && foundedAction instanceof MenuAction) {
        (foundedAction as MenuAction<CatalogActionType>).execute()
    }
}

function createActions(): Map<CatalogActionType, MenuItem<CatalogActionType>> {
    const actions: Map<CatalogActionType, MenuItem<CatalogActionType>> = new Map()
    actions.set(
        CatalogActionType.OpenEvitaQLConsole,
        createMenuAction(
            CatalogActionType.OpenEvitaQLConsole,
            'mdi-variable',
            () => {
                workspaceService.createTab(
                    evitaQLConsoleTabFactory.createNew(
                        connection,
                        props.catalog.name
                    )
                )
            }
        )
    )
    actions.set(
        CatalogActionType.OpenGraphQLDataAPIConsole,
        createMenuAction(
            CatalogActionType.OpenGraphQLDataAPIConsole,
            'mdi-graphql',
            () => {
                workspaceService.createTab(
                    graphQLConsoleTabFactory.createNew(
                        connection,
                        props.catalog.name,
                        GraphQLInstanceType.Data
                    )
                )
            }
        )
    )
    actions.set(
        CatalogActionType.OpenGraphQLSchemaAPIConsole,
        createMenuAction(
            CatalogActionType.OpenGraphQLSchemaAPIConsole,
            'mdi-graphql',
            () => {
                workspaceService.createTab(
                    graphQLConsoleTabFactory.createNew(
                        connection,
                        props.catalog.name,
                        GraphQLInstanceType.Schema
                    )
                )
            }
        )
    )
    actions.set(
        CatalogActionType.ViewSchema,
        createMenuAction(
            CatalogActionType.ViewSchema,
            'mdi-file-code-outline',
            () => {
                workspaceService.createTab(
                    schemaViewerTabFactory.createNew(
                        connection,
                        new CatalogSchemaPointer(props.catalog.name)
                    )
                )
            }
        )
    )
    if (!evitaLabConfig.readOnly) {
        actions.set(
            CatalogActionType.ModifySubheader,
            new MenuSubheader(t('explorer.catalog.subheader.modify'))
        )
        actions.set(
            CatalogActionType.RenameCatalog,
            createMenuAction(
                CatalogActionType.RenameCatalog,
                'mdi-pencil-outline',
                () => showRenameCatalogDialog.value = true
            )
        )
        actions.set(
            CatalogActionType.ReplaceCatalog,
            createMenuAction(
                CatalogActionType.ReplaceCatalog,
                'mdi-file-replace-outline',
                () => showReplaceCatalogDialog.value = true
            )
        )
        if (props.catalog.isInWarmup) {
            actions.set(
                CatalogActionType.SwitchCatalogToAliveState,
                createMenuAction(
                    CatalogActionType.SwitchCatalogToAliveState,
                    'mdi-toggle-switch-outline',
                    () => showSwitchCatalogToAliveStateDialog.value = true
                )
            )
        }
        actions.set(
            CatalogActionType.DropCatalog,
            createMenuAction(
                CatalogActionType.DropCatalog,
                'mdi-delete-outline',
                () => showDropCatalogDialog.value = true
            )
        )

        actions.set(
            CatalogActionType.CollectionsSubheader,
            new MenuSubheader(t('explorer.catalog.subheader.collections'))
        )

        actions.set(
            CatalogActionType.CreateCollection,
            createMenuAction(
                CatalogActionType.CreateCollection,
                'mdi-plus',
                () => showCreateCollectionDialog.value = true
            )
        )
    }
    return new Map(actions)
}

function createMenuAction(
    actionType: CatalogActionType,
    prependIcon: string,
    execute: () => void
): MenuItem<CatalogActionType> {
    return new MenuAction(
        actionType,
        t(`explorer.catalog.actions.${actionType}`),
        prependIcon,
        execute
    )
}
</script>

<template>
    <VListGroup :value="`${connection.name}|${catalog.name}`">
        <template #activator="{ isOpen, props }">
            <VTreeViewItem
                v-if="!catalog.corrupted"
                v-bind="props"
                openable
                :is-open="isOpen"
                prepend-icon="mdi-menu"
                :loading="loading"
                :actions="actionList"
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

        <div v-if="!catalog.corrupted">
            <template v-if="catalog.entityCollections.size > 0">
                <CollectionItem
                    v-for="entityCollection in catalog.entityCollections"
                    :key="entityCollection.entityType"
                    :entity-collection="entityCollection"
                    @change="emit('change')"
                />
            </template>
            <template v-else>
                <VTreeViewEmptyItem />
            </template>
        </div>

        <RenameCatalogDialog
            v-if="showRenameCatalogDialog"
            v-model="showRenameCatalogDialog"
            :connection="connection"
            :catalog-name="catalog.name"
            @rename="emit('change')"
        />
        <ReplaceCatalogDialog
            v-if="showReplaceCatalogDialog"
            v-model="showReplaceCatalogDialog"
            :connection="connection"
            :catalog-name="catalog.name"
            @replace="emit('change')"
        />
        <SwitchCatalogToAliveStateDialog
            v-if="showSwitchCatalogToAliveStateDialog"
            v-model="showSwitchCatalogToAliveStateDialog"
            :connection="connection"
            :catalog-name="catalog.name"
            @switch="emit('change')"
        />
        <DropCatalogDialog
            v-if="showDropCatalogDialog"
            v-model="showDropCatalogDialog"
            :connection="connection"
            :catalog-name="catalog.name"
            @drop="emit('change')"
        />
        <CreateCollectionDialog
            v-if="showCreateCollectionDialog"
            v-model="showCreateCollectionDialog"
            :connection="connection"
            :catalog-name="catalog.name"
            @create="emit('change')"
        />
    </VListGroup>
</template>

<style scoped></style>
