<script setup lang="ts">
/**
 * Explorer tree item representing a single collection in evitaDB within a catalog.
 */

import { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CollectionActionType } from '@/modules/connection/explorer/model/CollectionActionType'
import { MenuAction } from '@/modules/base/model/menu/MenuAction'
import { useWorkspaceService, WorkspaceService } from '@/modules/workspace/service/WorkspaceService'
import { EntitySchema } from '@/modules/connection/model/schema/EntitySchema'
import { Connection } from '@/modules/connection/model/Connection'
import { CatalogSchema } from '@/modules/connection/model/schema/CatalogSchema'
import {
    SchemaViewerTabFactory,
    useSchemaViewerTabFactory
} from '@/modules/schema-viewer/viewer/workspace/service/SchemaViewerTabFactory'
import { EntitySchemaPointer } from '@/modules/schema-viewer/viewer/model/EntitySchemaPointer'
import {
    EntityViewerTabFactory,
    useEntityViewerTabFactory
} from '@/modules/entity-viewer/viewer/workspace/service/EntityViewerTabFactory'
import { useCatalogSchema, useConnection } from '@/modules/connection/explorer/component/dependecies'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import VTreeViewItem from '@/modules/base/component/VTreeViewItem.vue'

const workspaceService: WorkspaceService = useWorkspaceService()
const entityViewerTabFactory: EntityViewerTabFactory = useEntityViewerTabFactory()
const schemaViewerTabFactory: SchemaViewerTabFactory = useSchemaViewerTabFactory()
const { t } = useI18n()

const props = defineProps<{
    entitySchema: EntitySchema
}>()

const connection: Connection = useConnection()
const catalogSchema: Ref<CatalogSchema | undefined> = useCatalogSchema()
const actions: Map<CollectionActionType, MenuAction<CollectionActionType>> = createActions()
const actionList: MenuAction<CollectionActionType>[] = Array.from(actions.values())

if (catalogSchema.value == undefined) {
    throw new UnexpectedError(`Catalog schema is not loaded yet, but collection item is already rendered!`)
}

function openDataGrid() {
    workspaceService.createTab(entityViewerTabFactory.createNew(
        connection as Connection,
        catalogSchema.value!.name ,
        props.entitySchema.name,
        undefined,
        true // we want to display data to user right away, there is no malicious code here
    ))
}

function handleAction(action: string) {
    actions.get(action as CollectionActionType)?.execute()
}

function createActions(): Map<CollectionActionType, MenuAction<CollectionActionType>> {
    const actions: Map<CollectionActionType, MenuAction<CollectionActionType>> = new Map()
    // todo lho consider moving these static actions directly into HTML code
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
            'mdi-file-code',
            () => workspaceService.createTab(
                schemaViewerTabFactory.createNew(
                    connection,
                    new EntitySchemaPointer(
                        catalogSchema.value!.name,
                        props.entitySchema.name
                    )
                )
            )
        )
    )
    return actions
}

function createMenuAction(actionType: CollectionActionType, prependIcon: string, execute: () => void): MenuAction<CollectionActionType> {
    return new MenuAction(
        actionType,
        t(`explorer.collection.actions.${actionType}`),
        prependIcon,
        execute
    )
}

</script>

<template>
    <VTreeViewItem
        prepend-icon="mdi-list-box-outline"
        :actions="actionList"
        @click="openDataGrid"
        @click:action="handleAction"
        class="text-gray-light text-sm-body-2"
    >
        {{ entitySchema.name }}
        <VTooltip activator="parent">
            {{ entitySchema.name }}
        </VTooltip>
    </VTreeViewItem>
</template>

<style lang="scss" scoped>

</style>
