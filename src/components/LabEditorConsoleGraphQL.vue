<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

import { Codemirror } from 'vue-codemirror'
import { graphql } from 'cm6-graphql';
import { json } from '@codemirror/lang-json'

import { onMounted, ref } from 'vue'
import { GraphQLConsoleService, useGraphQLConsoleService } from '@/services/graphql-console.service'
import { GraphQLSchema, printSchema } from 'graphql'
import { GraphQLInstancePointer } from '@/model/graphql-console'

const graphQLConsoleService: GraphQLConsoleService = useGraphQLConsoleService()

const props = defineProps<{
    instancePointer: GraphQLInstancePointer
}>()

const path = ref<string[]>([
    props.instancePointer.catalogName,
    props.instancePointer.instanceType, // todo lho i18n
])
const editorTab = ref<string>('query')

const graphQLSchema = ref<GraphQLSchema>()

const queryCode = ref<string>(
`{
\t# Write your evitaDB GraphQL query here...
\t
}`
)
const queryExtensions = ref<any[]>([])

const variablesCode = ref<string>('{\n  \n}')
const variablesExtensions = ref<any[]>([json()])

const schemaEditorInitialized = ref<boolean>(false)
const schemaCode = ref<string>('')
const schemaExtensions = ref<any[]>([])

const resultCode = ref<string>('')
const resultExtensions = ref<any[]>([json()])

onMounted(async () => {
    graphQLSchema.value = await graphQLConsoleService.getGraphQLSchema(props.instancePointer)
    queryExtensions.value.push(graphql(graphQLSchema.value))
    schemaExtensions.value.push(graphql())
})

async function executeQuery(): Promise<void> {
    resultCode.value = await graphQLConsoleService.executeGraphQLQuery(props.instancePointer, queryCode.value, JSON.parse(variablesCode.value))
}

function initializeSchemaEditor(): void {
    if (!schemaEditorInitialized.value) {
        if (graphQLSchema.value) {
            schemaCode.value = printSchema(graphQLSchema.value)
            schemaEditorInitialized.value = true
        } else {
            schemaCode.value = ''
        }
    }
}
</script>

<template>
    <div
        class="graphql-editor"
    >
        <VToolbar>
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

            <VSpacer />

            <VBtn
                icon
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
                prepend-icon="mdi-send"
                variant="tonal"
                @click="executeQuery"
            >
                Execute query
            </VBtn>
        </VToolbar>

        <div
            class="editors"
        >
            <VSheet
                class="editors__tabs"
            >
                <VTabs
                    v-model="editorTab"
                    density="compact"
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
                            <Codemirror
                                v-model="queryCode"
                                :extensions="queryExtensions"
                                style="height: 100%"
                            />
                        </VWindowItem>

                        <VWindowItem
                            value="variables"
                            style="height: 100%"
                        >
                            <Codemirror
                                v-model="variablesCode"
                                :extensions="variablesExtensions"
                                style="height: 100%"
                            />
                        </VWindowItem>

                        <VWindowItem
                            value="schema"
                            style="height: 100%"
                            @group:selected="initializeSchemaEditor"
                        >
                            <Codemirror
                                v-model="schemaCode"
                                :extensions="schemaExtensions"
                                style="height: 100%"
                            />
                        </VWindowItem>
                    </VWindow>
                </Pane>
                <Pane>
                    <Codemirror
                        v-model="resultCode"
                        placeholder="Results will be displayed here..."
                        disabled
                        :extensions="resultExtensions"
                        style="height: 100%"
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
