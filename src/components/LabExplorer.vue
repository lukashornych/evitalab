<script setup lang="ts">
import LabExplorerConnectionItem from '@/components/LabExplorerConnectionItem.vue'

import { Connection } from '@/model/connection'

const props = defineProps<{
    connections: Connection[],
    modelValue: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
    <VNavigationDrawer
        permanent
        :model-value="modelValue"
        @update:model-value="$emit('modelValue', $event)"
    >
        <VList
            density="compact"
        >
            <LabExplorerConnectionItem
                v-for="connection in connections"
                :key="connection.name"
                :connection="connection"
            />
        </VList>
    </VNavigationDrawer>
</template>

<style scoped>

</style>
