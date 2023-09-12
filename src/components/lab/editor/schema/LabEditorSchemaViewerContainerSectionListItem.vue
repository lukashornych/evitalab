<script setup lang="ts">
const props = withDefaults(defineProps<{
    name: string,
    deprecated?: boolean,
    flags?: string[]
}>(), {
    deprecated: false,
    flags: () => []
})

const emit = defineEmits<{
    (e: 'open'): void
}>()
</script>

<template>
    <VListItem
        class="rounded"
        @click="emit('open')"
    >
        <div class="item-body">
            <VListItemTitle>
                <span :class="['mr-5', { 'text-decoration-line-through': deprecated }]">
                    {{ name }}
                </span>
            </VListItemTitle>
            <VChipGroup>
                <VChip
                    v-for="flag in flags"
                    :key="flag"
                >
                    {{ flag }}
                </VChip>
            </VChipGroup>
        </div>

        <template #append>
            <VIcon>mdi-open-in-new</VIcon>
        </template>
    </VListItem>
</template>

<style lang="scss" scoped>
.item-body {
    display: flex;
    align-items: center;
}
</style>
