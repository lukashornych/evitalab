<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    panel?: string
}>()

const emit = defineEmits<{
    (e: 'update:panel', value: boolean): void
}>()

const mainItems = ref([
    {
        title: 'Explorer',
        value: 'explorer',
        props: {
            prependIcon: 'mdi-compass'
        }
    }
])
const secondaryItems = ref([
    {
        title: 'Info',
        value: 'info',
        props: {
            prependIcon: 'mdi-information',
        }
    }
])

function selectPanel(item: any): void {
    if (!item.value) {
        emit('update:panel', null)
    } else {
        emit('update:panel', item.id)
    }
}

</script>

<template>
    <VNavigationDrawer
        permanent
        rail
    >
        <VList
            density="compact"
            nav
            :items="mainItems"
            :selected="[panel]"
            @click:select="selectPanel"
        />

        <template #append>
            <VList
                density="compact"
                nav
                :items="secondaryItems"
            />
        </template>
    </VNavigationDrawer>
</template>

<style scoped>

</style>
