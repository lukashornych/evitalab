<script setup lang="ts">
/**
 * GraphQL console. Allows to execute GraphQL queries against a evitaDB instance.
 */

import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

import { Extension } from '@codemirror/state'
import { graphql } from 'cm6-graphql'
import { json } from '@codemirror/lang-json'

import { onBeforeMount, ref } from 'vue'
import { GraphQLConsoleService, useGraphQLConsoleService } from '@/services/editor/graphql-console.service'
import { GraphQLSchema, printSchema } from 'graphql'
import { GraphQLConsoleData, GraphQLConsoleParams, GraphQLInstanceType } from '@/model/editor/graphql-console'
import CodemirrorFull from '@/components/base/CodemirrorFull.vue'
import { Toaster, useToaster } from '@/services/editor/toaster'
import { TabComponentProps } from '@/model/editor/editor'

const graphQLConsoleService: GraphQLConsoleService = useGraphQLConsoleService()
const toaster: Toaster = useToaster()

const props = defineProps<TabComponentProps<GraphQLConsoleParams, GraphQLConsoleData>>()

const path = ref<string[]>([])
if (props.params.instancePointer.instanceType !== GraphQLInstanceType.SYSTEM) {
    path.value.push(props.params.instancePointer.catalogName)
}
path.value.push(props.params.instancePointer.instanceType) // todo lho i18n
const editorTab = ref<string>('query')

const graphQLSchema = ref<GraphQLSchema>()

const queryCode = ref<string>(props.data?.query ? props.data.query : `# Write your GraphQL query for catalog ${props.params.instancePointer.catalogName} here.\n`)
const queryExtensions: Extension[] = []

const variablesCode = ref<string>(props.data?.variables ? props.data.variables : '{\n  \n}')
const variablesExtensions: Extension[] = [json()]

const schemaEditorInitialized = ref<boolean>(false)
const schemaCode = ref<string>('')
const schemaExtensions: Extension[] = [graphql()]

const resultCode = ref<string>('')
const resultExtensions: Extension[] = [json()]

const initialized = ref<boolean>(false)

onBeforeMount(() => {
    graphQLConsoleService.getGraphQLSchema(props.params.instancePointer)
        .then(schema => {
            graphQLSchema.value = schema
            queryExtensions.push(graphql(schema))
            initialized.value = true
            if (props.params.executeOnOpen) {
                executeQuery()
            }
        })
        .catch(error => {
            toaster.error(error)
        })
})

async function executeQuery(): Promise<void> {
    try {
        resultCode.value = await graphQLConsoleService.executeGraphQLQuery(props.params.instancePointer, queryCode.value, JSON.parse(variablesCode.value))
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
        <VToolbar
            density="compact"
            elevation="2"
            class="graphql-editor__header"
        >
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
                    <VTooltip activator="parent">
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

                    <VTooltip activator="parent">
                        Execute query
                    </VTooltip>
                </VBtn>
            </template>
        </VToolbar>

        <div class="graphql-editor__body">
            <VSheet class="graphql-editor-query-sections">
                <VTabs
                    v-model="editorTab"
                    direction="vertical"
                    class="graphql-editor-query-sections__tab"
                >
                    <VTab value="query">
                        <VIcon>mdi-database-search</VIcon>
                        <VTooltip activator="parent">
                            Query
                        </VTooltip>
                    </VTab>
                    <VTab value="variables">
                        <VIcon>mdi-variable</VIcon>
                        <VTooltip activator="parent">
                            Variables
                        </VTooltip>
                    </VTab>
                    <VTab value="schema">
                        <VIcon>mdi-file-code</VIcon>
                        <VTooltip activator="parent">
                            Schema
                        </VTooltip>
                    </VTab>
                </VTabs>

                <VDivider />
            </VSheet>

            <Splitpanes vertical>
                <Pane class="graphql-editor-query">
                    <VWindow
                        v-model="editorTab"
                        direction="vertical"
                    >
                        <VWindowItem value="query">
                            <CodemirrorFull
                                v-model="queryCode"
                                :additional-extensions="queryExtensions"
                                @execute="executeQuery"
                            />
                        </VWindowItem>

                        <VWindowItem value="variables">
                            <CodemirrorFull
                                v-model="variablesCode"
                                :additional-extensions="variablesExtensions"
                                @execute="executeQuery"
                            />
                        </VWindowItem>

                        <VWindowItem
                            value="schema"
                            @group:selected="initializeSchemaEditor"
                        >
                            <CodemirrorFull
                                v-model="schemaCode"
                                read-only
                                :additional-extensions="schemaExtensions"
                                style="height: 100%"
                            />
                        </VWindowItem>
                    </VWindow>
                </Pane>

                <Pane>
                    <CodemirrorFull
                        v-model="resultCode"
                        placeholder="Results will be displayed here..."
                        read-only
                        :additional-extensions="resultExtensions"
                    />
                </Pane>
            </Splitpanes>
        </div>
    </div>
    <div v-else>
        Loading...
    </div>
</template>

<style lang="scss" scoped>
.graphql-editor {
    display: grid;
    grid-template-rows: 3rem 1fr;

    &__header {
        z-index: 100;
    }

    &__body {
        display: grid;
        grid-template-columns: 3rem 1fr;
    }
}

.graphql-editor-query {
    & :deep(.v-window) {
        // we need to override the default tab window styles used in LabEditor
        position: absolute;
        left: 0 !important;
        right: 0 !important;
        top: 0 !important;
        bottom: 0 !important;
    }
}

.graphql-editor-query-sections {
    display: flex;
    width: 3rem;

    &__tab {
        width: 3rem;
    }
}
</style>