<script setup lang="ts">
/**
 * Explorer tree item representing a single collection in evitaDB within a catalog.
 */
import { useI18n } from 'vue-i18n'
import { CollectionActionType } from '@/modules/connection/explorer/model/CollectionActionType'
import { MenuAction } from '@/modules/base/model/menu/MenuAction'
import { useWorkspaceService, WorkspaceService } from '@/modules/workspace/service/WorkspaceService'
import { Connection } from '@/modules/connection/model/Connection'
import {
    SchemaViewerTabFactory,
    useSchemaViewerTabFactory
} from '@/modules/schema-viewer/viewer/workspace/service/SchemaViewerTabFactory'
import { EntitySchemaPointer } from '@/modules/schema-viewer/viewer/model/EntitySchemaPointer'
import {
    EntityViewerTabFactory,
    useEntityViewerTabFactory
} from '@/modules/entity-viewer/viewer/workspace/service/EntityViewerTabFactory'
import { useCatalog, useConnection } from '@/modules/connection/explorer/component/dependecies'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import VTreeViewItem from '@/modules/base/component/VTreeViewItem.vue'
import { EntityCollection } from '../../model/EntityCollection'
import { EvitaLabConfig, useEvitaLabConfig } from '@/modules/config/EvitaLabConfig'
import { computed, ComputedRef, markRaw, ref, shallowRef } from 'vue'
import DropCollection from '@/modules/server-actions/modify/components/DropCollection.vue'
import RenameCollection from '@/modules/server-actions/modify/components/RenameCollection.vue'
import { Catalog } from '../../model/Catalog'
import { MenuSubheader } from '@/modules/base/model/menu/MenuSubheader'
import { MenuItem } from '@/modules/base/model/menu/MenuItem'

const workspaceService: WorkspaceService = useWorkspaceService()
const entityViewerTabFactory: EntityViewerTabFactory =
    useEntityViewerTabFactory()
const schemaViewerTabFactory: SchemaViewerTabFactory =
    useSchemaViewerTabFactory()
const { t } = useI18n()
const evitaLabConfig: EvitaLabConfig = useEvitaLabConfig()

const props = defineProps<{
    entityCollection: EntityCollection
    catalogName: string
}>()

const emits = defineEmits<{ (e: 'changed', value?: Catalog[] | undefined): void }>()
const componentVisible = ref<boolean>(false)
const PopupComponent = shallowRef(DropCollection || RenameCollection)

const connection: Connection = useConnection()
const catalog = useCatalog()
const actions: ComputedRef<Map<CollectionActionType, MenuItem<CollectionActionType>>> = computed(() => createActions())
const actionList: ComputedRef<MenuItem<CollectionActionType>[]> = computed(() => Array.from(
    actions.value.values()
))

if (catalog.value == undefined) {
    throw new UnexpectedError(
        `Catalog schema is not loaded yet, but collection item is already rendered!`
    )
}

function openDataGrid() {
    workspaceService.createTab(
        entityViewerTabFactory.createNew(
            connection as Connection,
            catalog.value!.name,
            props.entityCollection.entityType,
            undefined,
            true // we want to display data to user right away, there is no malicious code here
        )
    )
}

function handleAction(action: string) {
    const item: MenuItem<CollectionActionType> | undefined = actions.value.get(action as CollectionActionType)
    if (item instanceof MenuAction) {
        item.execute()
    }
}

function createActions(): Map<
    CollectionActionType,
    MenuItem<CollectionActionType>
> {
    const actions: Map<
        CollectionActionType,
        MenuItem<CollectionActionType>
    > = new Map()
    actions.set(
        CollectionActionType.ViewEntities,
        createMenuAction(
            CollectionActionType.ViewEntities,
            'mdi-table',
            openDataGrid
        )
    )
    actions.set(
        CollectionActionType.ViewSchema,
        createMenuAction(
            CollectionActionType.ViewSchema,
            'mdi-file-code-outline',
            () =>
                workspaceService.createTab(
                    schemaViewerTabFactory.createNew(
                        connection,
                        new EntitySchemaPointer(
                            props.catalogName,
                            props.entityCollection.entityType
                        )
                    )
                )
        )
    )
    if (!evitaLabConfig.readOnly) {
        actions.set(
            CollectionActionType.ModifySubheader,
            new MenuSubheader(t('explorer.collection.subheader.modify'))
        )
        actions.set(
            CollectionActionType.DropCollection,
            createMenuAction(
                CollectionActionType.DropCollection,
                'mdi-delete-outline',
                () => {
                    PopupComponent.value = markRaw(DropCollection)
                    componentVisible.value = true
                }
            )
        )
        actions.set(
            CollectionActionType.RenameCollection,
            createMenuAction(
                CollectionActionType.RenameCollection,
                'mdi-delete-outline',
                () => {
                    PopupComponent.value = markRaw(RenameCollection)
                    componentVisible.value = true
                }
            )
        )
    }
    return actions
}

function createMenuAction(
    actionType: CollectionActionType,
    prependIcon: string,
    execute: () => void
): MenuAction<CollectionActionType> {
    return new MenuAction(
        actionType,
        t(`explorer.collection.actions.${actionType}`),
        prependIcon,
        execute
    )
}
</script>

<template>
    <div>
        <VTreeViewItem
            prepend-icon="mdi-list-box-outline"
            :actions="actionList"
            @click="openDataGrid"
            @click:action="handleAction"
            class="text-gray-light text-sm-body-2"
        >
            {{ entityCollection.entityType }}
            <VTooltip activator="parent">
                {{ entityCollection.entityType }}
            </VTooltip>
        </VTreeViewItem>
        <PopupComponent
            v-if="componentVisible"
            :visible="true"
            :collection-name="entityCollection.entityType"
            :catalog-name="catalogName"
            :connection="connection"
            @visible-changed="
                () => {
                    componentVisible = false
                }
            "
            @confirmed="
                (value?: Catalog[] | undefined) => {
                    emits('changed', value)
                }
            "
        />
    </div>
</template>

<style lang="scss" scoped></style>
