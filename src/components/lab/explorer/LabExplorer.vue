<script setup lang="ts">
import LabExplorerConnectionItem from './LabExplorerConnectionItem.vue'
import { LabService, useLabService } from '@/services/lab.service'
import { computed, ref } from 'vue'
import { EvitaDBConnection } from '@/model/lab'
import LabExplorerConnectionEditor from './LabExplorerConnectionEditor.vue'

const labService: LabService = useLabService()

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const addConnectionDialogOpen = ref<boolean>(false)
const connections = computed<EvitaDBConnection[]>(() => labService.getConnections())
</script>

<template>
    <VNavigationDrawer
        permanent
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        class="bg-primary border-opacity-25"
    >
        <VList
            density="compact"
            nav
        >
            <VListSubheader class="text-gray-light text-sm-body-2 font-weight-medium">Connections Explorer</VListSubheader>

            <LabExplorerConnectionItem
                v-for="connection in connections"
                :key="connection.name"
                :connection="connection"
            />
        </VList>

        <template #append>
            <div
                v-if="!labService.isReadOnly()"
                class="pa-2"
            >
                <LabExplorerConnectionEditor
                    v-model="addConnectionDialogOpen"
                >
                    <template #activator="{ props }">
                        <VBtn
                            prepend-icon="mdi-plus"
                            block
                            variant="plain"
                            v-bind="props"
                            @click="addConnectionDialogOpen = true"
                            class="btn-add-connection"
                        >
                            Add connection
                        </VBtn>
                    </template>
                </LabExplorerConnectionEditor>
            </div>
        </template>
    </VNavigationDrawer>
</template>

<style lang="scss" scoped>
.btn-add-connection {
    border: .1px solid rgba(white, .5);
    border-radius: 18px;
    color: white;
    opacity: 1;
    transition: border-color .2s ease-in-out;

    &:hover {
        border-color: rgba(white, 1);
        transition: border-color .2s ease-in-out;
    }
}

</style>
