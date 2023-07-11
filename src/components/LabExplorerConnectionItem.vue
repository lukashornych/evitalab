<script setup lang="ts">
import LabExplorerCatalogItem from '@/components/LabExplorerCatalogItem.vue'

import { Connection } from '@/model/connection'
import { onMounted, ref } from 'vue'
import { getCatalogs } from '@/services/evitadb.service'

const props = defineProps<{
    connection: Connection
}>()

const catalogs = ref([])

onMounted(async () => {
    catalogs.value = await getCatalogs(props.connection)
})
</script>

<template>
    <VListGroup
        :value="connection.name"
    >
        <template v-slot:activator="{ props }">
            <VListItem
                v-bind="props"
                prepend-icon="mdi-database"
                :title="connection.name"
            />
        </template>

        <LabExplorerCatalogItem
            v-for="catalog in catalogs"
            :key="catalog.name"
            :connection="connection"
            :catalog="catalog"
        />
    </VListGroup>
</template>

<style scoped>

</style>
