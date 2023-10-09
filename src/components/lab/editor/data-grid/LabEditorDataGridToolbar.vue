<script setup lang="ts">
/**
 * Toolbar for the LabEditorDataGrid component.
 */

const props = defineProps<{
    path: string[]
    loading: boolean
}>()
const emit = defineEmits<{
    (e: 'executeQuery'): void
}>()

</script>

<template>
    <VToolbar
        density="compact"
        elevation="2"
        class="data-grid__header bg-primary-light"
    >
        <VAppBarNavIcon
            icon="mdi-text-box-edit-outline"
            :disabled="true"
            style="opacity: 1"
            class="ml-0"
        />

        <VToolbarTitle class="ml-0">
            <VBreadcrumbs
                :items="path"
                class="pl-0 pr-0 font-weight-bold pt-0 pb-0"
            />
        </VToolbarTitle>

        <template #append>
            <VBtn
                variant="outlined"
                :loading="loading"
                density="compact"
                @click="emit('executeQuery')"
                class="text-primary-lightest font-weight-bold bg-primary-light rounded-lg border-md h-auto py-1 rounded-xl border-opacity-100 border-primary-lightest"
            >
                <VIcon>mdi-play-outline</VIcon>

                <VTooltip activator="parent">
                    Execute query
                </VTooltip>
                Run
            </VBtn>
        </template>

        <template #extension>
            <slot name="query" />
        </template>
    </VToolbar>
</template>

<style lang="scss" scoped>
.data-grid__header {
    z-index: 100;
}
.v-btn--variant-outlined {
    border-color: #21BFE3!important;
}
</style>
