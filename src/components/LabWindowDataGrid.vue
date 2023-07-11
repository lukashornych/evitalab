<script setup lang="ts">
import { VDataTable } from 'vuetify/labs/VDataTable'

import { defineProps, ref, onMounted } from 'vue'
import { getEntities } from '@/services/evitadb.service'
import { Connection } from '@/model/connection'

const props = defineProps<{
    connection: Connection
}>()

const filterBy = ref<string>('')
const orderBy = ref<string>('')

const entities = ref([])

onMounted(async () => {
    entities.value = await getEntities(props.connection)
})

async function sendQuery(): void {
    entities.value = await getEntities(props.connection, filterBy.value, orderBy.value)
}
</script>

<template>
    <VContainer>
        <VRow no-gutters>
            <VCol>
                <VTextField
                    label="Filter by"
                    v-model="filterBy"
                />
            </VCol>
            <VCol>
                <VTextField
                    label="Order by"
                    v-model="orderBy"
                />
            </VCol>
            <VCol>
                <VBtn
                    icon="mdi-send"
                    @click="sendQuery"
                />
            </VCol>
        </VRow>

        <VRow>
            <VDataTable
                :headers="[{key: 'primaryKey', title: 'Primary key'}, {key: 'type', title: 'Type'}]"
                :items="entities"
            />
        </VRow>
    </VContainer>
</template>

<style scoped>

</style>
