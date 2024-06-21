<script setup lang="ts">
import { LabService, useLabService } from '@/services/lab.service'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ConnectionItem from '@/modules/connection/explorer/component/ConnectionItem.vue'
import ConnectionEditor from '@/modules/connection/explorer/component/ConnectionEditor.vue'
import { EvitaDBConnection } from '@/model/EvitaDBConnection'

const labService: LabService = useLabService()
const { t } = useI18n()

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
        class="bg-primary"
    >
        <VList
            density="compact"
            nav
        >
            <VListSubheader class="text-gray-light text-sm-body-2 font-weight-medium">{{ t('explorer.title') }}</VListSubheader>

            <ConnectionItem
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
                <ConnectionEditor
                    v-model="addConnectionDialogOpen"
                >
                    <template #activator="{ props }">
                        <VBtn
                            prepend-icon="mdi-plus"
                            block
                            variant="outlined"
                            v-bind="props"
                            @click="addConnectionDialogOpen = true"
                        >
                            Add connection
                        </VBtn>
                    </template>
                </ConnectionEditor>
            </div>
        </template>
    </VNavigationDrawer>
</template>

<style lang="scss" scoped>
</style>
