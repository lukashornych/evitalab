<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

import { Extension } from '@codemirror/state';
import { graphql } from 'cm6-graphql';
import { json } from '@codemirror/lang-json'

import { onBeforeMount, ref } from 'vue'
import { GraphQLConsoleService, useGraphQLConsoleService } from '@/services/editor/graphql-console.service'
import { GraphQLSchema, printSchema } from 'graphql'
import { GraphQLConsoleProps } from '@/model/editor/graphql-console'
import CodemirrorFull from '@/components/CodemirrorFull.vue'
import { Toaster, useToaster } from '@/services/editor/toaster'

const graphQLConsoleService: GraphQLConsoleService = useGraphQLConsoleService()
const toaster: Toaster = useToaster()

const props = defineProps<GraphQLConsoleProps>()

const path = ref<string[]>([
    props.instancePointer.catalogName,
    props.instancePointer.instanceType, // todo lho i18n
])
const editorTab = ref<string>('query')

const graphQLSchema = ref<GraphQLSchema>()

const queryCode = ref<string>(`# Write your GraphQL query for catalog ${props.instancePointer.catalogName} here.\n`)
const queryExtensions: Extension[] = []

const variablesCode = ref<string>('{\n  \n}')
const variablesExtensions: Extension[] = [json()]

const schemaEditorInitialized = ref<boolean>(false)
const schemaCode = ref<string>('')
const schemaExtensions: Extension[] = [graphql()]

const resultCode = ref<string>('')
const resultExtensions: Extension[] = [json()]

const initialized = ref<boolean>(false)

onBeforeMount(() => {
    graphQLConsoleService.getGraphQLSchema(props.instancePointer)
        .then(schema => {
            graphQLSchema.value = schema
            queryExtensions.push(graphql(schema))
            initialized.value = true
        })
        .catch(error => {
            toaster.error(error)
        })
})

async function executeQuery(): Promise<void> {
    try {
        resultCode.value = await graphQLConsoleService.executeGraphQLQuery(props.instancePointer, queryCode.value, JSON.parse(variablesCode.value))
    } catch (error: any) {
        toaster.error(error)
    }
}

function initializeSchemaEditor(): void {
    if (!schemaEditorInitialized.value) {
        if (graphQLSchema.value) {
            schemaCode.value = printSchema(graphQLSchema.value as GraphQLSchema)
            schemaEditorInitialized.value = true
        } else {
            schemaCode.value = ''
        }
    }
}
</script>

<template>
    <div
        v-if="initialized"
        class="graphql-editor"
    >
        <VToolbar density="compact">
            <VAppBarNavIcon
                icon="mdi-graphql"
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
                <VBtn
                    icon
                    density="compact"
                    class="mr-3"
                >
                    <VIcon>mdi-information</VIcon>
                    <VTooltip
                        activator="parent"
                    >
                        GraphQL API instance details
                    </VTooltip>
                </VBtn>

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
                    <VTab
                        value="schema"
                    >
                        <VIcon>mdi-file-code</VIcon>
                        <VTooltip
                            activator="parent"
                        >
                            Schema
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

                        <VWindowItem
                            value="schema"
                            style="height: 100%"
                            @group:selected="initializeSchemaEditor"
                        >
                            <CodemirrorFull
                                v-model="schemaCode"
                                :additional-extensions="schemaExtensions"
                                style=": 100%"
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
.graphql-editor {
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
