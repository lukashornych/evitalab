<script setup lang="ts">
export interface Props {
    openable?: boolean,
    isOpen?: boolean,
    prependIcon: string,
    actions?: object[]
}

const props = withDefaults(defineProps<Props>(), {
    openable: false,
    isOpen: false,
    actions: () => []
})

const emit = defineEmits<{
    (e: 'click:action', value: string): void
}>()
</script>

<template>
    <VListItem
        :prepend-icon="null"
        :append-icon="null"
    >
        <div
            class="tree-view-item__content"
        >
            <VIcon
                v-if="openable"
            >
                {{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </VIcon>
            <VIcon
                v-else
            >

            </VIcon>

            <VIcon>
                {{ prependIcon }}
            </VIcon>
            <span class="text-truncate">
                <slot />
            </span>
            <VMenu
                v-if="actions && actions.length > 0"
                :menu-items="actions"
            >
                <template #activator="{ props }">
                    <VIcon
                        v-bind="props"
                    >
                        mdi-dots-vertical
                    </VIcon>
                </template>

                <VList
                    density="compact"
                    :items="actions"
                    @click:select="$emit('click:action', $event.id)"
                />
            </VMenu>
        </div>
    </VListItem>
</template>

<style lang="scss" scoped>
.tree-view-item {
    &__content {
        width: 100%;
        height: 2rem;
        display: inline-grid;
        grid-template-columns: 1.5rem 1.5rem 1fr 1.5rem;
        column-gap: 0.5rem;
        align-items: center;
    }
}
</style>
