<script setup lang="ts">
/**
 * Pre-defined button to execute queries.
 */

const emit = defineEmits<{
    (e: 'click'): void
}>()
</script>

<template>
    <VBtn
        variant="outlined"
        density="compact"
        @click="emit('click')"
        class="text-primary-lightest font-weight-bold bg-primary-light rounded-lg border-md h-auto py-1 rounded-xl border-opacity-100 border-primary-lightest"
    >
        <VIcon>mdi-play-outline</VIcon>

        <VTooltip activator="parent">
            Execute query
        </VTooltip>
        Run
    </VBtn>
</template>

<style lang="scss" scoped>

</style>
