<script setup lang="ts">
/**
 * Explorer tree item representing a single connection to evitaDB.
 */

import { computed, ComputedRef, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWorkspaceService, WorkspaceService } from '@/modules/workspace/service/WorkspaceService'
import { ConnectionService, useConnectionService } from '@/modules/connection/service/ConnectionService'
import { Toaster, useToaster } from '@/modules/notification/service/Toaster'
import { Connection } from '@/modules/connection/model/Connection'
import { EvitaLabConfig, useEvitaLabConfig } from '@/modules/config/EvitaLabConfig'
import { Catalog } from '@/modules/connection/model/Catalog'
import {
    GraphQLConsoleTabFactory,
    useGraphQLConsoleTabFactory
} from '@/modules/graphql-console/console/workspace/service/GraphQLConsoleTabFactory'
import { GraphQLInstanceType } from '@/modules/graphql-console/console/model/GraphQLInstanceType'
import { ConnectionActionType } from '@/modules/connection/explorer/model/ConnectionActionType'
import { MenuAction } from '@/modules/base/model/menu/MenuAction'
import { provideConnection } from '@/modules/connection/explorer/component/dependecies'
import VTreeViewItem from '@/modules/base/component/VTreeViewItem.vue'
import CatalogItem from '@/modules/connection/explorer/component/CatalogItem.vue'
import RemoveConnectionDialog from '@/modules/connection/explorer/component/RemoveConnectionDialog.vue'
import VTreeViewEmptyItem from '@/modules/base/component/VTreeViewEmptyItem.vue'
import { MenuSubheader } from '@/modules/base/model/menu/MenuSubheader'
import { MenuItem } from '@/modules/base/model/menu/MenuItem'
import {
    ServerStatusTabFactory,
    useServerStatusTabFactory
} from '@/modules/server-status/service/ServerStatusTabFactory'
import CreateCatalogDialog from '@/modules/connection/explorer/component/CreateCatalogDialog.vue'

const evitaLabConfig: EvitaLabConfig = useEvitaLabConfig()
const workspaceService: WorkspaceService = useWorkspaceService()
const connectionService: ConnectionService = useConnectionService()
const graphQLConsoleTabFactory: GraphQLConsoleTabFactory = useGraphQLConsoleTabFactory()
const serverStatusTabFactory: ServerStatusTabFactory = useServerStatusTabFactory()
const toaster: Toaster = useToaster()
const { t } = useI18n()

const props = defineProps<{
    connection: Connection
}>()
provideConnection(props.connection)

const actions: ComputedRef<
    Map<ConnectionActionType, MenuItem<ConnectionActionType>>
> = computed(() => createActions())
const actionList: ComputedRef<MenuItem<ConnectionActionType>[]> = computed(
    () => Array.from(actions.value.values())
)

const catalogs = ref<Catalog[]>()
const loading = ref<boolean>(false)

const showRemoveConnectionDialog = ref<boolean>(false)
const showCreateCatalogDialog = ref<boolean>(false)

async function loadCatalogs(): Promise<void> {
    loading.value = true
    try {
        catalogs.value = await connectionService.getCatalogs(
            props.connection,
            true
        )
    } catch (e: any) {
        toaster.error(e)
    }
    loading.value = false
}

function handleAction(action: string): void {
    const item: MenuItem<ConnectionActionType> | undefined = actions.value.get(action as ConnectionActionType)
    if (item instanceof MenuAction) {
        item.execute()
    }
}

// todo lho these should be some kind of factories
function createActions(): Map<ConnectionActionType, MenuItem<ConnectionActionType>> {
    const actions: Map<ConnectionActionType, MenuItem<ConnectionActionType>> = new Map()
    actions.set(
        ConnectionActionType.Refresh,
        createMenuAction(
            ConnectionActionType.Refresh,
            'mdi-refresh',
            () => loadCatalogs()
        )
    )
    actions.set(
        ConnectionActionType.OpenGraphQLSystemAPIConsole,
        createMenuAction(
            ConnectionActionType.OpenGraphQLSystemAPIConsole,
            'mdi-graphql',
            () =>
                workspaceService.createTab(
                    graphQLConsoleTabFactory.createNew(
                        props.connection,
                        'system', // todo lho: this is not needed
                        GraphQLInstanceType.System
                    )
                )
        )
    )
    actions.set(
        ConnectionActionType.Detail,
        createMenuAction(
            ConnectionActionType.Detail,
            'mdi-database-outline',
            () =>
                workspaceService.createTab(
                    serverStatusTabFactory.createNew(props.connection)
                )
        )
    )
    if (!evitaLabConfig.readOnly) {
        if (!props.connection.preconfigured) {
            // todo lho implement
            // actions.set(
            //     ConnectionActionType.Edit,
            //     createMenuAction(
            //         ConnectionActionType.Edit,
            //         'mdi-pencil',
            //         () => {
            //             throw new UnexpectedError('Not implemented yet.')
            //         }
            //     )
            // )
            actions.set(
                ConnectionActionType.Remove,
                createMenuAction(
                    ConnectionActionType.Remove,
                    'mdi-delete-outline',
                    () => (showRemoveConnectionDialog.value = true)
                )
            )
        }
        actions.set(
            ConnectionActionType.CatalogsSubheader,
            new MenuSubheader(t('explorer.connection.subheader.catalogs'))
        )
        actions.set(
            ConnectionActionType.CreateCatalog,
            createMenuAction(ConnectionActionType.CreateCatalog, 'mdi-plus', () => {
                showCreateCatalogDialog.value = true
            })
        )
    }
    return actions
}
function createMenuAction(
    actionType: ConnectionActionType,
    prependIcon: string,
    execute: () => void
): MenuAction<ConnectionActionType> {
    return new MenuAction(
        actionType,
        t(`explorer.connection.actions.${actionType}`),
        prependIcon,
        execute
    )
}
</script>

<template>
    <div>
        <VListGroup :value="connection.name">
            <template #activator="{ isOpen, props }">
                <VTreeViewItem
                    v-bind="props"
                    openable
                    :is-open="isOpen"
                    prepend-icon="mdi-power-plug-outline"
                    :loading="loading"
                    :actions="actionList"
                    @click="loadCatalogs()"
                    @click:action="handleAction"
                    class="font-weight-bold"
                >
                    {{ connection.name }}
                    <VTooltip activator="parent">
                        {{ connection.name }}
                    </VTooltip>
                </VTreeViewItem>
            </template>

            <div v-if="catalogs !== undefined">
                <template v-if="catalogs.length > 0">
                    <CatalogItem
                        v-for="catalog in catalogs"
                        :key="catalog.name"
                        :catalog="catalog"
                        @change="loadCatalogs"
                    />
                </template>
                <template v-else>
                    <VTreeViewEmptyItem />
                </template>
            </div>

            <RemoveConnectionDialog
                v-if="showRemoveConnectionDialog"
                v-model="showRemoveConnectionDialog"
                :connection="connection"
            />
            <CreateCatalogDialog
                v-if="showCreateCatalogDialog"
                v-model="showCreateCatalogDialog"
                :connection="connection"
                @create="loadCatalogs"
            />
        </VListGroup>
    </div>
</template>

<style lang="scss" scoped></style>
