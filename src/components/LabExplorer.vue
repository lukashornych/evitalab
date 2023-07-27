<script setup lang="ts">
import LabExplorerConnectionItem from '@/components/LabExplorerConnectionItem.vue'
import { LabService, useLabService } from '@/services/lab.service'
import { computed } from 'vue'
import { EvitaDBConnection } from '@/model/lab'

const labService: LabService = useLabService()

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const connections = computed<EvitaDBConnection[]>(() => labService.getConnections())
</script>

<template>
    <VNavigationDrawer
        permanent
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
    >
        <VList
            density="compact"
            nav
        >
            <LabExplorerConnectionItem
                v-for="connection in connections"
                :key="connection.name"
                :connection="connection"
            />
        </VList>

        <template #append>
            <div
                class="pa-2"
            >
                <VBtn
                    prepend-icon="mdi-plus"
                    block
                    variant="tonal"
                >
                    Add connection
                </VBtn>
            </div>
        </template>
    </VNavigationDrawer>
</template>

<style scoped>

</style>
