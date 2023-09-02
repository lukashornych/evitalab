<script setup lang="ts">
import CodemirrorFull from '@/components/CodemirrorFull.vue'
import { ErrorViewerProps } from '@/model/editor/error-viewer'

const props = defineProps<ErrorViewerProps>()
</script>

<template>
    <div class="error-viewer">
        <VToolbar
            density="compact"
            elevation="2"
            class="error-viewer__header"
        >
            <VAppBarNavIcon
                icon="mdi-alert-circle"
                color="red"
                :disabled="true"
                style="opacity: 1"
            />

            <VToolbarTitle>
                <VBreadcrumbs
                    :items="[props.message]"
                    class="pl-0 pr-0"
                />
            </VToolbarTitle>

            <!-- todo lho link to submit an issue to github -->
            <template #append>
                <VBtn
                    icon
                    density="compact"
                >
                    <VIcon>mdi-bug</VIcon>
                    <VTooltip activator="parent">
                        Submit an issue
                    </VTooltip>
                </VBtn>
            </template>
        </VToolbar>

        <VSheet class="error-viewer__body">
            <CodemirrorFull
                :model-value="props.detail"
                read-only
            />
        </VSheet>
    </div>
</template>

<style lang="scss" scoped>
.error-viewer {
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
