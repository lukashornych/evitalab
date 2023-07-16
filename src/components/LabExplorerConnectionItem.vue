<script setup lang="ts">
import LabExplorerCatalogItem from '@/components/LabExplorerCatalogItem.vue'

import { EvitaDBConnection } from '@/model/lab'
import { onMounted, provide, readonly, ref } from 'vue'
import { LabService, useLabService } from '@/services/lab.service'
import TreeViewItem from '@/components/TreeViewItem.vue'

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

const catalogs = ref([])

onMounted(async () => {
    catalogs.value = await labService.getCatalogs(props.connection)
})

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
            <TreeViewItem
                v-bind="props"
                openable
                :is-open="isOpen"
                prepend-icon="mdi-server"
                :actions="actions"
                @click:action="handleAction"
            >
                {{ connection.name }}
            </TreeViewItem>
        </template>

        <LabExplorerCatalogItem
            v-for="catalog in catalogs"
            :key="catalog.name"
            :catalog="catalog"
        />
    </VListGroup>
</template>

<style lang="scss" scoped>

</style>
