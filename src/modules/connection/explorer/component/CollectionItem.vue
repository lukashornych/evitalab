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
import { EntityCollectionStatistics } from '../../model/EntityCollectionStatistics'
import { EvitaLabConfig, useEvitaLabConfig } from '@/modules/config/EvitaLabConfig'
import { markRaw, ref, shallowRef } from 'vue'
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
    entityType: EntityCollectionStatistics
    catalogName: string
}>()

const emits = defineEmits<{ (e: 'changed', value?: Catalog[] | undefined): void }>()
const componentVisible = ref<boolean>(false)
const PopupComponent = shallowRef(DropCollection || RenameCollection)

const connection: Connection = useConnection()
const catalogSchema = useCatalog()
const actions: Map<
    CollectionActionType,
    MenuItem<CollectionActionType>
> = createActions()
const actionList: MenuItem<CollectionActionType>[] = Array.from(
    actions.values()
)

if (catalogSchema.value == undefined) {
    throw new UnexpectedError(
        `Catalog schema is not loaded yet, but collection item is already rendered!`
    )
}

function openDataGrid() {
    workspaceService.createTab(
        entityViewerTabFactory.createNew(
            connection as Connection,
            catalogSchema.value!.name,
            props.entityType.entityType.getOrThrow(),
            undefined,
            true // we want to display data to user right away, there is no malicious code here
        )
    )
}

function handleAction(action: string) {
    const item: MenuItem<CollectionActionType> | undefined = actions.get(action as CollectionActionType)
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
    // todo lho consider moving these static actions directly into HTML code
    actions.set(
        CollectionActionType.ViewEntities,
        createMenuAction(
            CollectionActionType.ViewEntities,
            'mdi-table',
            openDataGrid
        )
    )
    const items = catalogSchema.value?.entityTypes.getIfSupported()
    if (items) {
        for (const item of items) {
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
                                    item.entityType.getOrThrow(),
                                    props.entityType.entityType.getOrThrow()
                                )
                            )
                        )
                )
            )
        }
    }
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
            {{ entityType.entityType.getOrThrow() }}
            <VTooltip activator="parent">
                {{ entityType.entityType.getOrThrow() }}
            </VTooltip>
        </VTreeViewItem>
        <PopupComponent
            v-if="componentVisible"
            :visible="true"
            :collection-name="entityType.entityType.getOrThrow()"
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
