<script setup lang="ts">
/**
 * Explorer tree item representing a single collection in evitaDB within a catalog.
 */

import VTreeViewItem from '@/components/base/VTreeViewItem.vue'
import { EvitaDBConnection } from '@/model/lab'
import { inject, Ref, ref } from 'vue'
import { EditorService, useEditorService } from '@/services/editor/editor.service'
import { CatalogSchema, EntitySchema } from '@/model/evitadb'
import { DataGridRequest } from '@/model/editor/tab/dataGrid/data-grid-request'
import { SchemaViewerRequest } from '@/model/editor/tab/schemaViewer/SchemaViewerRequest'
import { EntitySchemaPointer } from '@/model/editor/tab/schemaViewer/EntitySchemaPointer'
import { useI18n } from 'vue-i18n'

const editorService: EditorService = useEditorService()
const { t } = useI18n()

enum ActionType {
    ViewEntities = 'viewEntities',
    ViewSchema = 'viewSchema'
}

const actions = ref<object[]>([
    {
        value: ActionType.ViewEntities,
        title: t(`explorer.collection.actions.${ActionType.ViewEntities}`),
        props: {
            prependIcon: 'mdi-table'
        }
    },
    {
        value: ActionType.ViewSchema,
        title: t(`explorer.collection.actions.${ActionType.ViewSchema}`),
        props: {
            prependIcon: 'mdi-file-code'
        }
    }
])

const props = defineProps<{
    entitySchema: EntitySchema
}>()

const connection = inject<EvitaDBConnection>('connection') as EvitaDBConnection
const catalogSchema = inject<Ref<CatalogSchema | undefined>>('catalogSchema') as Ref<CatalogSchema>

function openDataGrid() {
    editorService.createTab(DataGridRequest.createNew(
        connection as EvitaDBConnection,
        catalogSchema.value.name,
        props.entitySchema.name,
        undefined,
        true // we want to display data to user right away, there is no malicious code here
    ))
}

function handleAction(action: string) {
    switch (action) {
        case ActionType.ViewEntities:
            openDataGrid()
            break
        case ActionType.ViewSchema:
            editorService.createTab(
                SchemaViewerRequest.createNew(
                    connection,
                    new EntitySchemaPointer(
                        catalogSchema.value.name,
                        props.entitySchema.name
                    )
                )
            )
            break
    }
}
</script>

<template>
    <VTreeViewItem
        prepend-icon="mdi-list-box-outline"
        :actions="actions"
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
