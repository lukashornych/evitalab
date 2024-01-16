<script setup lang="ts">
import { ref } from 'vue'
import LabEditorTabLoadingScreen from '@/components/lab/editor/tab/LabEditorTabLoadingScreen.vue'

const props = defineProps<{
    component: any,
    componentProps: any
}>()

const componentReady = ref<boolean>(false)
</script>

<template>
    <KeepAlive>
        <Component
            v-show="componentReady"
            :is="component"
            v-bind="componentProps"
            @ready="componentReady = true"
        />
    </KeepAlive>
    <LabEditorTabLoadingScreen v-if="!componentReady" />
</template>

<style lang="scss" scoped>

</style>
