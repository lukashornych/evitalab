<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ConnectionService, useConnectionService } from '@/modules/connection/service/ConnectionService'
import { Connection } from '@/modules/connection/model/Connection'
import ConnectionItem from '@/modules/connection/explorer/component/ConnectionItem.vue'
import { EvitaLabConfig, useEvitaLabConfig } from '@/modules/config/EvitaLabConfig'
import ConnectionEditor from '@/modules/connection/explorer/component/ConnectionEditor.vue'

const evitaLabConfig: EvitaLabConfig = useEvitaLabConfig()
const connectionService: ConnectionService = useConnectionService()
const { t } = useI18n()

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const addConnectionDialogOpen = ref<boolean>(false)
const connections = computed<Connection[]>(() => connectionService.getConnections())
</script>

<template>
    <VNavigationDrawer
        permanent
        :model-value="modelValue"
        :width="325"
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
                v-if="!evitaLabConfig.readOnly"
                class="pa-2"
            >
                <ConnectionEditor v-model="addConnectionDialogOpen">
                    <template #activator="{ props }">
                        <VBtn
                            prepend-icon="mdi-power-plug-outline"
                            block
                            variant="outlined"
                            v-bind="props"
                            @click="addConnectionDialogOpen = true"
                        >
                            {{ t('explorer.button.connect') }}
                        </VBtn>
                    </template>
                </ConnectionEditor>
            </div>
        </template>
    </VNavigationDrawer>
</template>

<style lang="scss" scoped>
</style>
