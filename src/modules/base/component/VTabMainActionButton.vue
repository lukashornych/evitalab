<script setup lang="ts">
/**
 * Pre-defined button representing the main action of tab (in the tab toolbar)
 */

const props = withDefaults(defineProps<{
    loading?: boolean
}>(), {
    loading: false
})
const emit = defineEmits<{
    (e: 'click'): void
}>()
</script>

<template>
    <VBtn
        :loading="loading"
        density="compact"
        @click="emit('click')"
        class="v-btn--variant-primary ml-3"
    >
        <slot />
    </VBtn>
</template>

<style lang="scss" scoped>

</style>
