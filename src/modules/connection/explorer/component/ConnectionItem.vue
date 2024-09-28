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
import { ConnectionItemType } from '@/modules/connection/explorer/model/ConnectionItemType'
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
import { TaskViewerTabFactory, useTaskViewerTabFactory } from '@/modules/task-viewer/services/TaskViewerTabFactory'
import { JfrViewerTabFactory, useJfrViewerTabFactory } from '@/modules/jfr-viewer/service/JfrViewerTabFactory'
import { ItemFlag } from '@/modules/base/model/tree-view/ItemFlag'
import { ItemFlagType } from '@/modules/base/model/tree-view/ItemFlagType'

const evitaLabConfig: EvitaLabConfig = useEvitaLabConfig()
const workspaceService: WorkspaceService = useWorkspaceService()
const connectionService: ConnectionService = useConnectionService()
const graphQLConsoleTabFactory: GraphQLConsoleTabFactory = useGraphQLConsoleTabFactory()
const serverStatusTabFactory: ServerStatusTabFactory = useServerStatusTabFactory()
const taskViewerTabFactory: TaskViewerTabFactory = useTaskViewerTabFactory()
const jfrViewerTabFactory: JfrViewerTabFactory = useJfrViewerTabFactory()

const toaster: Toaster = useToaster()
const { t } = useI18n()

const props = defineProps<{
    connection: Connection
}>()
provideConnection(props.connection)

const flags = computed<ItemFlag[]>(() => {
    const flags: ItemFlag[] = []
    if (props.connection.preconfigured) {
        flags.push(ItemFlag.info(
            t('explorer.connection.flag.preconfigured')
        ))
    }
    return flags
})
const actions = computed<Map<ConnectionItemType, MenuItem<ConnectionItemType>>>(() =>
    createActions())
const actionList = computed<MenuItem<ConnectionItemType>[]>(
    () => Array.from(actions.value.values()))

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
    const item: MenuItem<ConnectionItemType> | undefined = actions.value.get(action as ConnectionItemType)
    if (item instanceof MenuAction) {
        item.execute()
    }
}

// todo lho these should be some kind of factories
function createActions(): Map<ConnectionItemType, MenuItem<ConnectionItemType>> {
    const actions: Map<ConnectionItemType, MenuItem<ConnectionItemType>> = new Map()
    actions.set(
        ConnectionItemType.Refresh,
        createMenuAction(
            ConnectionItemType.Refresh,
            'mdi-refresh',
            () => loadCatalogs()
        )
    )
    actions.set(
        ConnectionItemType.OpenGraphQLSystemAPIConsole,
        createMenuAction(
            ConnectionItemType.OpenGraphQLSystemAPIConsole,
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
        ConnectionItemType.Detail,
        createMenuAction(
            ConnectionItemType.Detail,
            'mdi-database-outline',
            () =>
                workspaceService.createTab(
                    serverStatusTabFactory.createNew(props.connection)
                )
        )
    )
    actions.set(ConnectionItemType.Tasks, createMenuAction(
        ConnectionItemType.Tasks,
        'mdi-chart-gantt',
        () => {
            workspaceService.createTab(
                taskViewerTabFactory.createNew(
                    props.connection
                )
            )
        }
    ))
    actions.set(ConnectionItemType.JfrRecordings, createMenuAction(
        ConnectionItemType.JfrRecordings,
        'mdi-chart-timeline',
        () => {
            workspaceService.createTab(
                jfrViewerTabFactory.createNew(
                    props.connection
                )
            )
        }
    ))
    actions.set(
        ConnectionItemType.ModifySubheader,
        new MenuSubheader(t('explorer.connection.subheader.modify'))
    )
    // todo lho implement
    // actions.set(
    //     ConnectionActionType.Edit,
    //     createMenuAction(
    //         ConnectionActionType.Edit,
    //         'mdi-pencil',
    //         () => {
    //             throw new UnexpectedError('Not implemented yet.')
    //         },
    //          props.connection.preconfigured
    //     )
    // )
    actions.set(
        ConnectionItemType.Remove,
        createMenuAction(
            ConnectionItemType.Remove,
            'mdi-delete-outline',
            () => (showRemoveConnectionDialog.value = true),
            props.connection.preconfigured
        )
    )
    actions.set(
        ConnectionItemType.CatalogsSubheader,
        new MenuSubheader(t('explorer.connection.subheader.catalogs'))
    )
    actions.set(
        ConnectionItemType.CreateCatalog,
        createMenuAction(
            ConnectionItemType.CreateCatalog,
            'mdi-plus',
            () => showCreateCatalogDialog.value = true,
            evitaLabConfig.readOnly
        )
    )
    return actions
}
function createMenuAction(
    actionType: ConnectionItemType,
    prependIcon: string,
    execute: () => void,
    disabled?: boolean
): MenuAction<ConnectionItemType> {
    return new MenuAction(
        actionType,
        t(`explorer.connection.actions.${actionType}`),
        prependIcon,
        execute,
        undefined,
        disabled
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
                    :flags="flags"
                    :actions="actionList"
                    @click="loadCatalogs()"
                    @click:action="handleAction"
                >
                    {{ connection.name }}
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
