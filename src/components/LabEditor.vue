<script setup lang="ts">

import { computed, ref, watch } from 'vue'
import { TabRequest, TabRequestComponentProps } from '@/model/editor/editor'
import { EditorService, useEditorService } from '@/services/editor/editor.service'
import LabEditorTabWindow from '@/components/LabEditorTabWindow.vue'
import { ellipsis } from '../utils/text-utils'

const editorService: EditorService = useEditorService()

const tabs = computed<TabRequest<any>[]>(() => {
    return editorService.getTabRequests()
})
watch(tabs, () => {
    // switch to newly opened tab
    const newTab: TabRequest<any> | undefined = editorService.getNewTabRequest()
    if (newTab) {
        currentTabId.value = newTab.id
        editorService.markTabRequestAsVisited(newTab.id)
    }
}, { deep: true})

const currentTabId = ref<string | null>()
const currentTab = computed(() => {
    if (!currentTabId.value) {
        return null
    }
    return editorService.getTabRequest(currentTabId.value as string) as TabRequest<TabRequestComponentProps>
})

function closeTab(tabId: string) {
    const closedTabIndex: number = tabs.value.findIndex(tab => tab.id === tabId)
    editorService.destroyTabRequest(tabId)

    if (tabs.value.length === 0) {
        currentTabId.value = null
    } else if (closedTabIndex === 0) {
        currentTabId.value = tabs.value[0].id
    } else if (tabs.value.length <= closedTabIndex) {
        currentTabId.value = tabs.value[closedTabIndex - 1].id
    } else {
        currentTabId.value = tabs.value[closedTabIndex].id
    }
}

</script>

<template>
    <VAppBar
        v-if="tabs.length > 0"
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
                    {{ ellipsis(tab.title, 30) }}

                    <VTooltip
                        v-if="tab.title.length > 30"
                        activator="parent"
                    >
                        {{ tab.title }}
                    </VTooltip>
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
                :transition="false"
                :reverse-transition="false"
            >
                <LabEditorTabWindow
                    v-if="currentTab"
                    :component="currentTab.component"
                    :component-props="currentTab.componentProps"
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
