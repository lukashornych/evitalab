<script setup lang="ts">

import { computed, ref } from 'vue'
import { TabRequest } from '@/model/editor'
import { EditorService, useEditorService } from '@/services/editor.service'

const editorService: EditorService = useEditorService()

const tabs = computed<TabRequest[]>(() => {
    return editorService.getTabRequests()
})
const currentTabId = ref<string>()
const currentTab = computed(() => {
    if (!currentTabId.value) {
        return null
    }
    return editorService.getTabRequest(currentTabId.value) as TabRequest
})

function closeTab(tabId: string) {
    editorService.destroyTabRequest(tabId)
}
</script>

<template>
    <VAppBar
        density="compact"
    >
        <VTabs
            v-model="currentTabId"
            show-arrows
        >
            <VTab
                v-for="tab in tabs"
                :key="tab.id"
                :value="tab.id"
                :prepend-icon="tab.icon"
            >
                <span>
                    {{ tab.title }}
                </span>

                <VBtn
                    icon
                    variant="plain"
                    density="compact"
                    class="ml-3"
                    @click.stop="closeTab(tab.id)"
                >
                    <VIcon>mdi-close</VIcon>
                    <VTooltip
                        activator="parent"
                    >
                        Close tab
                    </VTooltip>
                </VBtn>
            </VTab>
        </VTabs>
    </VAppBar>

    <VMain
        :scrollable="false"
        class="lab-editor"
    >
        <VWindow
            v-if="tabs.length > 0"
            v-model="currentTabId"
        >
            <VWindowItem
                v-for="tab in tabs"
                :key="tab.id"
                :value="tab.id"
            >
                <Component
                    v-if="currentTab"
                    :is="currentTab.component"
                    v-bind="currentTab.componentProps"
                />
            </VWindowItem>
        </VWindow>
        <div v-else>
            No tabs are open
        </div>
    </VMain>
</template>

<style scoped>
.lab-editor {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    justify-items: stretch;
    align-items: stretch;
}
</style>
