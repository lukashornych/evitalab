<script setup lang="ts">
import LabExplorerCatalogItem from '@/components/LabExplorerCatalogItem.vue'

import { EvitaDBConnection } from '@/model/lab'
import { provide, readonly, ref } from 'vue'
import { LabService, useLabService } from '@/services/lab.service'
import VTreeViewItem from '@/components/VTreeViewItem.vue'
import { Catalog } from '@/model/evitadb/system'

enum ActionType {
    Edit = 'edit',
    Remove = 'remove'
}

const actions = ref<object[]>([
    {
        value: ActionType.Edit,
        title: 'Edit connection',
        props: {
            prependIcon: 'mdi-pencil'
        }
    },
    {
        value: ActionType.Remove,
        title: 'Remove connection',
        props: {
            prependIcon: 'mdi-delete'
        }
    },
])


const labService: LabService = useLabService()

const props = defineProps<{
    connection: EvitaDBConnection
}>()

provide('connection', readonly(props.connection))

const catalogs = ref<Catalog[]>()

async function loadCatalogs(): Promise<void> {
    if (catalogs.value !== undefined) {
        return
    }
    catalogs.value = await labService.getCatalogs(props.connection)
}

function handleAction(action: string, payload?: any) {
    switch (action) {
        case ActionType.Edit:
            throw new Error('Not implemented yet.')
        case ActionType.Remove:
            labService.removeConnection(payload)
            break
    }
}
</script>

<template>
    <VListGroup
        :value="connection.name"
    >
        <template v-slot:activator="{ isOpen, props }">
            <VTreeViewItem
                v-bind="props"
                openable
                :is-open="isOpen"
                prepend-icon="mdi-server"
                :actions="actions"
                @click="loadCatalogs"
                @click:action="handleAction"
            >
                {{ connection.name }}
            </VTreeViewItem>
        </template>

        <div
            v-if="catalogs !== undefined"
        >
            <LabExplorerCatalogItem
                v-for="catalog in catalogs"
                :key="catalog.name"
                :catalog="catalog"
            />
        </div>
    </VListGroup>
</template>

<style lang="scss" scoped>

</style>
