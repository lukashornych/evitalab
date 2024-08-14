<script setup lang="ts">
/**
 * Explorer tree item representing a single catalog in evitaDB.
 */

import { markRaw, ref, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { Toaster, useToaster } from '@/modules/notification/service/Toaster'
import { Catalog } from '@/modules/connection/model/Catalog'
import { Connection } from '@/modules/connection/model/Connection'
import { CatalogSchema } from '@/modules/connection/model/schema/CatalogSchema'
import {
    ConnectionService,
    useConnectionService,
} from '@/modules/connection/service/ConnectionService'
import { MenuAction } from '@/modules/base/model/menu/MenuAction'
import { CatalogActionType } from '@/modules/connection/explorer/model/CatalogActionType'
import { GraphQLInstanceType } from '@/modules/graphql-console/console/model/GraphQLInstanceType'
import { CatalogSchemaPointer } from '@/modules/schema-viewer/viewer/model/CatalogSchemaPointer'
import {
    useWorkspaceService,
    WorkspaceService,
} from '@/modules/workspace/service/WorkspaceService'
import {
    EvitaQLConsoleTabFactory,
    useEvitaQLConsoleTabFactory,
} from '@/modules/evitaql-console/console/workspace/service/EvitaQLConsoleTabFactory'
import {
    GraphQLConsoleTabFactory,
    useGraphQLConsoleTabFactory,
} from '@/modules/graphql-console/console/workspace/service/GraphQLConsoleTabFactory'
import {
    SchemaViewerTabFactory,
    useSchemaViewerTabFactory,
} from '@/modules/schema-viewer/viewer/workspace/service/SchemaViewerTabFactory'
import VTreeViewItem from '@/modules/base/component/VTreeViewItem.vue'
import VTreeViewEmptyItem from '@/modules/base/component/VTreeViewEmptyItem.vue'
import CollectionItem from '@/modules/connection/explorer/component/CollectionItem.vue'
import { EntitySchema } from '@/modules/connection/model/schema/EntitySchema'
import {
    provideCatalogSchema,
    useConnection,
} from '@/modules/connection/explorer/component/dependecies'
import { Map as ImmutableMap } from 'immutable'
import DropCatalog from '@/modules/server-actions/modify/components/DropCatalog.vue'
import { MenuItem } from '@/modules/base/model/menu/MenuItem'
import { MenuSubheader } from '@/modules/base/model/menu/MenuSubheader'
import RenameCatalog from '@/modules/server-actions/modify/components/RenameCatalog.vue'
//TODO: add dialog options
const connectionService: ConnectionService = useConnectionService()
const workspaceService: WorkspaceService = useWorkspaceService()
const evitaQLConsoleTabFactory: EvitaQLConsoleTabFactory =
    useEvitaQLConsoleTabFactory()
const graphQLConsoleTabFactory: GraphQLConsoleTabFactory =
    useGraphQLConsoleTabFactory()
const schemaViewerTabFactory: SchemaViewerTabFactory =
    useSchemaViewerTabFactory()
const toaster: Toaster = useToaster()
const { t } = useI18n()
const componentVisible = ref<boolean>(false)
const PopupComponent = shallowRef(DropCatalog || RenameCatalog)
const emits = defineEmits<{(e: 'changed'):void }>()

const props = defineProps<{
    catalog: Catalog
}>()

const connection: Connection = useConnection()
const actions: ImmutableMap<
    CatalogActionType,
    MenuItem<CatalogActionType>
> = createActions()
const actionList: MenuItem<CatalogActionType>[] = Array.from(actions.values())

const catalogSchema = ref<CatalogSchema>()
provideCatalogSchema(catalogSchema)
const entitySchemas = ref<EntitySchema[]>()

const loading = ref<boolean>(false)

async function loadCatalogSchema(): Promise<void> {
    if (
        catalogSchema.value !== undefined ||
        props.catalog.corrupted.getOrElse(false)
    ) {
        return
    }

    loading.value = true
    try {
        catalogSchema.value = await connectionService.getCatalogSchema(
            connection,
            props.catalog.name
        )
        if (catalogSchema.value) {
            entitySchemas.value = (await catalogSchema.value.entitySchemas())
                .map((it) => Array.from(it.values()))
                .getOrElseGet(() => [])
        }
    } catch (e: any) {
        toaster.error(e)
    }
    loading.value = false
}

function handleAction(action: string): void {
    const foundedAction = actions.get(action as CatalogActionType)
    if(foundedAction && foundedAction instanceof MenuAction){
        (foundedAction as MenuAction<CatalogActionType>).execute()       
    }
}

function createActions(): ImmutableMap<
    CatalogActionType,
    MenuItem<CatalogActionType>
> {
    const actions: Map<
        CatalogActionType,
        MenuItem<CatalogActionType>
    > = new Map()
    // todo lho consider moving these static actions directly into HTML code
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
    ),
    actions.set(CatalogActionType.ModifySubheader,
        new MenuSubheader(t('explorer.catalog.subitems.modify'))
    )
    actions.set(
        CatalogActionType.DropCatalog,
        createMenuAction(
            CatalogActionType.DropCatalog,
            'mdi-delete-outline',
            () => {
                PopupComponent.value = markRaw(DropCatalog)
                componentVisible.value = true
            }
        )
    )

    actions.set(
        CatalogActionType.RenameCatalog,
        createMenuAction(
            CatalogActionType.RenameCatalog,
            'mdi-rename-box',
            () => {
                PopupComponent.value = markRaw(RenameCatalog)
                componentVisible.value = true
            }
        )
    )
    return ImmutableMap(actions)
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

 function changeVisibility(visible:boolean){
    componentVisible.value = visible
 }

 function confirmed(){
    emits('changed')
 }
</script>

<template>
    <VListGroup :value="`${connection.name}|${catalog.name}`">
        <template #activator="{ isOpen, props }">
            <VTreeViewItem
                v-if="!catalog.corrupted.getOrElse(false)"
                v-bind="props"
                openable
                :is-open="isOpen"
                prepend-icon="mdi-menu"
                :loading="loading"
                :actions="actionList"
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

        <div
            v-if="
                !catalog.corrupted.getOrElse(false) &&
                catalogSchema !== undefined
            "
        >
            <template v-if="entitySchemas != null && entitySchemas?.length > 0">
                <CollectionItem
                    v-for="entitySchema in entitySchemas"
                    :key="entitySchema.name"
                    :entity-schema="entitySchema"
                />
            </template>
            <template v-else>
                <VTreeViewEmptyItem />
            </template>
        </div>
    </VListGroup>
    <PopupComponent v-if="componentVisible" :visible="true" :connection="connection" :catalog-name="catalog.name" @visible-changed="changeVisibility" @confirmed="confirmed" />
</template>

<style scoped></style>
