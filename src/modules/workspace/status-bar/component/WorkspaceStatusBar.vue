<script setup lang="ts">

/*
    Global status bar for entire workspace. Individual components can
    display info via workspace API.
 */

import { useWorkspaceService, WorkspaceService } from '@/modules/workspace/service/WorkspaceService'
import { computed } from 'vue'
import { ActiveEditorStatus as ActiveEditorStatusInfo } from '@/modules/workspace/status-bar/model/ActiveEditorStatus'
import ActiveEditorStatus from './ActiveEditorStatus.vue'

const workspaceService: WorkspaceService = useWorkspaceService()

const activeEditorStatus = computed<ActiveEditorStatusInfo | undefined>(() =>
    workspaceService.getActiveEditorStatus())
</script>

<template>
    <VAppBar
        height="24"
        location="bottom"
        flat
        class="bg-primary-dark status-bar"
        border
    >
        <div class="left-content"></div>
        <div class="right-content">
            <ActiveEditorStatus v-if="activeEditorStatus != undefined" :status="activeEditorStatus" />
        </div>
    </VAppBar>
</template>

<style lang="scss" scoped>
.status-bar :deep(.v-toolbar__content) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: 1rem;
    padding: 0 0.51rem;
    font-size: 0.75rem;
}

.left-content, .right-content {
    display: flex;
    column-gap: 1rem;
}

.left-content {
    justify-content: left;
}

.right-content {
    justify-content: right;
}
</style>
