<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCatalogSchema } from '@/services/evitadb.service'
import { Connection } from '@/model/connection'

const props = defineProps<{
    connection: Connection,
    catalog: any
}>()

const catalogSchema = ref({})

onMounted(async () => {
    if (!props.catalog.corrupted) {
        catalogSchema.value = await getCatalogSchema(props.connection, props.catalog.name)
    }
})
</script>

<template>
    <VListGroup
        :value="catalog.name"
    >
        <template v-slot:activator="{ props }">
            <VListItem
                v-bind="props"
                prepend-icon="mdi-book-open-variant"
                :title="catalog.name"
            />
        </template>

        <div
            v-if="!catalog.corrupted"
        >
            <VListItem
                v-for="entitySchema in catalogSchema.entitySchemas"
                :key="entitySchema.name"
                :title="entitySchema.name"
                :value="entitySchema.name"
            />
        </div>
    </VListGroup>
</template>

<style scoped>

</style>
