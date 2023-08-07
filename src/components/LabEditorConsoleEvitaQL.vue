<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

import { Extension } from '@codemirror/state';
import { json } from '@codemirror/lang-json'

import { ref } from 'vue'
import CodemirrorFull from '@/components/CodemirrorFull.vue'
import { EvitaQLConsoleService, useEvitaQLConsoleService } from '@/services/tab/evitaql-console.service'
import { EvitaQLConsoleProps } from '@/model/tab/evitaql-console'

const evitaQLConsoleService: EvitaQLConsoleService = useEvitaQLConsoleService()

const props = defineProps<EvitaQLConsoleProps>()

const path = ref<string[]>([
    props.dataPointer.catalogName
])
const editorTab = ref<string>('query')

const queryCode = ref<string>(`// Write your EvitaQL query for catalog ${props.dataPointer.catalogName} here.\n`)
const queryExtensions = ref<any[]>([])

const variablesCode = ref<string>('{\n  \n}')
const variablesExtensions = ref<Extension[]>([json()])

const resultCode = ref<string>('')
const resultExtensions = ref<Extension[]>([json()])


async function executeQuery(): Promise<void> {
    resultCode.value = await evitaQLConsoleService.executeEvitaQLQuery(props.dataPointer, queryCode.value, JSON.parse(variablesCode.value))
}
</script>

<template>
    <div
        class="evitaql-editor"
    >
        <VToolbar density="compact">
            <VAppBarNavIcon
                icon="mdi-console"
                :disabled="true"
                style="opacity: 1"
            />

            <VToolbarTitle>
                <VBreadcrumbs
                    :items="path"
                    class="pl-0 pr-0"
                />
            </VToolbarTitle>

            <template #append>
                <!-- todo lho primary color? -->
                <VBtn
                    icon
                    variant="elevated"
                    density="compact"
                    @click="executeQuery"
                >
                    <VIcon>mdi-play</VIcon>

                    <VTooltip
                        activator="parent"
                    >
                        Execute query
                    </VTooltip>
                </VBtn>
            </template>
        </VToolbar>

        <div
            class="editors"
        >
            <VSheet
                class="editors__tabs"
            >
                <VTabs
                    v-model="editorTab"
                    direction="vertical"
                    class="editors__tab"
                >
                    <VTab
                        value="query"
                    >
                        <VIcon>mdi-database-search</VIcon>
                        <VTooltip
                            activator="parent"
                        >
                            Query
                        </VTooltip>
                    </VTab>
                    <VTab
                        value="variables"
                    >
                        <VIcon>mdi-variable</VIcon>
                        <VTooltip
                            activator="parent"
                        >
                            Variables
                        </VTooltip>
                    </VTab>
                </VTabs>

                <VDivider />
            </VSheet>

            <Splitpanes
                vertical
            >
                <Pane>
                    <VWindow
                        v-model="editorTab"
                        direction="vertical"
                        style="height: 100%"
                    >
                        <VWindowItem
                            value="query"
                            style="height: 100%"
                        >
                            <CodemirrorFull
                                v-model="queryCode"
                                :additional-extensions="queryExtensions"
                            />
                        </VWindowItem>

                        <VWindowItem
                            value="variables"
                            style="height: 100%"
                        >
                            <CodemirrorFull
                                v-model="variablesCode"
                                :additional-extensions="variablesExtensions"
                            />
                        </VWindowItem>
                    </VWindow>
                </Pane>
                <Pane>
                    <CodemirrorFull
                        v-model="resultCode"
                        placeholder="Results will be displayed here..."
                        disabled
                        :additional-extensions="resultExtensions"
                    />
                </Pane>
            </Splitpanes>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.evitaql-editor {
    display: grid;
    grid-template-rows: auto 1fr;
}

.editors {
    width: 100%;
    display: grid;
    grid-template-columns: 3rem 1fr;

    &__tabs {
        display: flex;
        width: 3rem;
    }

    &__tab {
        width: 3rem;
    }
}
</style>
