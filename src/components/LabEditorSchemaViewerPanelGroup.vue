<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
    redirecting?: boolean
}>(), {
    redirecting: false
})

const openedItems = ref<string[]>([])
watch(openedItems, (newVal) => {
    if (!props.redirecting || newVal.length === 0) {
        return
    }
    openedItems.value = []
})
</script>

<template>
    <VExpansionPanels
        v-model="openedItems"
        multiple
    >
        <slot />
    </VExpansionPanels>
</template>

<style lang="scss" scoped>

</style>
