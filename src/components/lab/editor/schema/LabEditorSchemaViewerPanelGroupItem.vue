<script setup lang="ts">
import { useSlots } from 'vue'

const slots = useSlots()

const props = withDefaults(defineProps<{
    name: string,
    deprecated?: boolean,
    flags?: string[]
}>(), {
    deprecated: false,
    flags: () => []
})

const emits = defineEmits<{
    (e: 'open'): void
}>()

const redirecting: boolean = slots.default === undefined || slots.default === null
</script>

<template>
    <VExpansionPanel @click.stop="$emit('open')">
        <VExpansionPanelTitle
            :expand-icon="redirecting ? 'mdi-open-in-new' : 'mdi-chevron-down'"
        >
            <span :class="['mr-5', { 'text-decoration-line-through': deprecated }]">
                {{ name }}
            </span>

            <VChipGroup>
                <VChip
                    v-for="flag in flags"
                    :key="flag"
                >
                    {{ flag }}
                </VChip>
            </VChipGroup>
        </VExpansionPanelTitle>

        <VExpansionPanelText>
            <slot />
        </VExpansionPanelText>
    </VExpansionPanel>
</template>

<style lang="scss" scoped>

</style>
