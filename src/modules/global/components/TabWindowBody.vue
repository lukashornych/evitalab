<template>
    <div class="main">
        <VTabToolbar :prepend-icon="icon" :path="path">
            <template #append>
                <VBtn
                    icon
                    v-if="visibleButton"
                    density="compact"
                    class="me-4"
                    @click="
                        () => {
                            emit('topButtonClick')
                        }
                    "
                >
                    <VIcon>{{ icon }}</VIcon>
                </VBtn>
            </template>
        </VTabToolbar>
        <VSheet>
            <slot />
        </VSheet>
    </div>
</template>

<script setup lang="ts">
import VTabToolbar from '@/modules/base/component/VTabToolbar.vue';
import { List } from 'immutable';

const props = defineProps<{
    path: List<string>
    icon: string
    visibleButton: boolean
}>()
const emit = defineEmits<{
    (e: 'topButtonClick'): void
}>()
</script>

<style scoped>
.main {
    display: grid;
    grid-template-rows: 3rem 1fr;

    &__header {
        z-index: 100;
    }

    &__body {
        position: relative;
    }
}
</style>
