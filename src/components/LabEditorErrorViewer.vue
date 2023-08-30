<script setup lang="ts">
import CodemirrorFull from '@/components/CodemirrorFull.vue'
import { ErrorViewerProps } from '@/model/editor/error-viewer'

const props = defineProps<ErrorViewerProps>()
</script>

<template>
    <VToolbar density="compact">
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
    </VToolbar>

    <VSheet class="pa-4">
        <CodemirrorFull :model-value="props.detail"/>

        <!-- todo lho link to submit an issue to github -->
    </VSheet>
</template>

<style lang="scss" scoped>

</style>
