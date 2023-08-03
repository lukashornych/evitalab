<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'

import { ref, watch } from 'vue'
import { DataGridConsoleProps } from '@/model/tab/data-grid-console'
import { Extension } from '@codemirror/state'
import { DataGridConsoleService, useDataGridConsoleService } from '@/services/tab/data-grid-console.service'
import { EntitySchema } from '@/model/evitadb/schema'
import CodemirrorOneLine from '@/components/CodemirrorOneLine.vue'
import { QueryLanguage } from '@/model/lab'
import { DataGridQueryResult } from '@/services/tab/data-grid-console/query-executor'

const dataGridConsoleService: DataGridConsoleService = useDataGridConsoleService()

const props = defineProps<DataGridConsoleProps>()

const path = ref<string[]>([
    props.dataPointer.catalogName,
    props.dataPointer.entityType
])

const queryLanguages = [
    {
        title: 'EvitaQL',
        value: QueryLanguage.EvitaQL
    },
    {
        title: 'GraphQL',
        value: QueryLanguage.GraphQL
    }
]
const selectedQueryLanguage = ref<QueryLanguage[]>([QueryLanguage.EvitaQL])
watch(selectedQueryLanguage, (newValue, oldValue) => {
    if (newValue[0] === oldValue[0]) {
        return
    }

    filterByCode.value = ''
    orderByCode.value = ''
})

const entityProperties = ref<string[]>([])

const loading = ref<boolean>(false)
const pageNumber = ref<number>(1)
const pageSize = ref<number>(20)

const filterByCode = ref<string>('')
const filterByExtensions: Extension[] = []

const orderByCode = ref<string>('')
const orderByExtensions: Extension[] = []

const dataLocales = ref<string[]>([])
const selectedDataLocales = ref<string[]>(['none'])
watch(selectedDataLocales, () => executeQuery())

const displayedData = ref<string[]>([])
watch(displayedData, (newValue, oldValue) => {
    updateGridHeaders()

    // re-fetch entities only if new properties were added, only in such case there could be missing data when displaying
    // the new properties
    if (newValue.length > oldValue.length) {
        executeQuery()
    }
})

const gridHeaders = ref<any[]>([])
const resultEntities = ref<any[]>([])
const totalResultCount = ref<number>(0)

async function initializeConsole(): Promise<void> {
    dataLocales.value = await dataGridConsoleService.getDataLocales(props.dataPointer)
    entityProperties.value = await dataGridConsoleService.getEntityProperties(props.dataPointer)

    // preselect all properties
    toggleAllEntityProperties()
    // pre-build grid headers from initial properties
    updateGridHeaders()
}

async function updateGridHeaders(): Promise<void> {
    gridHeaders.value = []
    for (const property of displayedData.value) {
        // todo lho more toplevel header
        gridHeaders.value.push({
            key: property,
            title: property,
            sortable: await dataGridConsoleService.isEntityPropertySortable(props.dataPointer, property)
        })
    }

    // sort grid headers by entity properties order
    gridHeaders.value.sort((a, b) => {
        return entityProperties.value.indexOf(a.key) - entityProperties.value.indexOf(b.key)
    })
}

function toggleAllEntityProperties(): void {
    if (displayedData.value.length < entityProperties.value.length) {
        displayedData.value = entityProperties.value.slice()
    } else {
        displayedData.value = []
    }
}

async function gridUpdated({ page, itemsPerPage, sortBy }): Promise<void> {
    pageNumber.value = page
    pageSize.value = itemsPerPage
    orderByCode.value = await dataGridConsoleService.buildOrderByFromGridColumns(props.dataPointer, selectedQueryLanguage.value[0], sortBy)

    await executeQuery()
}

async function executeQuery(): Promise<void> {
    loading.value = true

    const result: DataGridQueryResult = await dataGridConsoleService.executeQuery(
        props.dataPointer,
        selectedQueryLanguage.value[0],
        filterByCode.value,
        orderByCode.value,
        dataLocales.value.length === 0 ? undefined : dataLocales.value[0],
        displayedData.value,
        pageNumber.value,
        pageSize.value
    )
    resultEntities.value = result.entities
    totalResultCount.value = result.totalEntitiesCount

    loading.value = false
}

await initializeConsole()
</script>

<template>
    <div class="data-grid">
        <VToolbar density="compact">
            <VAppBarNavIcon
                icon="mdi-table"
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

            <!-- todo lho primary color? -->
            <VBtn
                icon
                variant="elevated"
                :loading="loading"
                density="compact"
                @click="executeQuery"
            >
                <VIcon>mdi-play</VIcon>

                <VTooltip activator="parent">
                    Execute query
                </VTooltip>
            </VBtn>

            <template #extension>
                <div class="query-input">
                    <VBtn
                        icon
                        density="comfortable"
                    >
                        <VIcon>mdi-code-braces</VIcon>
                        <VTooltip activator="parent">Select query language</VTooltip>

                        <VMenu activator="parent">
                            <VList
                                v-model:selected="selectedQueryLanguage"
                                density="compact"
                            >
                                <VListItem
                                    v-for="language in queryLanguages"
                                    :key="language.value"
                                    :value="language.value"
                                >
                                    <VListItemTitle>{{ language.title }}</VListItemTitle>
                                </VListItem>
                            </VList>
                        </VMenu>
                    </VBtn>

                    <CodemirrorOneLine
                        v-model="filterByCode"
                        prepend-inner-icon="mdi-filter"
                        placeholder="Filter by"
                        :additional-extensions="filterByExtensions"
                    />

                    <CodemirrorOneLine
                        v-model="orderByCode"
                        prepend-inner-icon="mdi-sort"
                        placeholder="Order by"
                        :additional-extensions="orderByExtensions"
                    />

                    <VBtn
                        icon
                        density="comfortable"
                    >
                        <VIcon>mdi-translate</VIcon>
                        <VTooltip activator="parent">
                            Select data locale
                        </VTooltip>

                        <VMenu activator="parent">
                            <VList
                                v-model:selected="selectedDataLocales"
                                density="compact"
                                min-width="100"
                            >
                                <VListItem
                                    value="none"
                                >
                                    <VListItemTitle>None</VListItemTitle>
                                </VListItem>

                                <VDivider class="mt-2 mb-2" />

                                <VListItem
                                    v-for="locale in dataLocales"
                                    :key="locale"
                                    :value="locale"
                                >
                                    <VListItemTitle>{{ locale }}</VListItemTitle>
                                </VListItem>
                            </VList>
                        </VMenu>
                    </VBtn>

                    <VBtn
                        icon
                        density="comfortable"
                    >
                        <VIcon>mdi-view-column</VIcon>
                        <VTooltip activator="parent">
                            Select displayed data
                        </VTooltip>

                        <VMenu
                            activator="parent"
                            :close-on-content-click="false"
                        >
                            <VList
                                v-model:selected="displayedData"
                                select-strategy="classic"
                                density="compact"
                            >
                                <VListItem>
                                    <template #prepend>
                                        <VListItemAction start>
                                            <VCheckboxBtn
                                                :indeterminate="displayedData.length > 0 && displayedData.length < entityProperties.length"
                                                :model-value="displayedData.length === entityProperties.length"
                                                @click="toggleAllEntityProperties"
                                            />
                                        </VListItemAction>
                                    </template>

                                    <VListItemTitle>Select all</VListItemTitle>
                                </VListItem>

                                <VDivider class="mt-2 mb-2" />

                                <VListItem
                                    v-for="property in entityProperties"
                                    :key="property"
                                    :value="property"
                                >
                                    <template v-slot:prepend="{ isActive }">
                                        <VListItemAction start>
                                            <VCheckboxBtn :model-value="isActive" />
                                        </VListItemAction>
                                    </template>

                                    <VListItemTitle>{{ property }}</VListItemTitle>
                                </VListItem>
                            </VList>
                        </VMenu>
                    </VBtn>
                </div>
            </template>
        </VToolbar>
    </div>

    <VContainer>
        <VRow>
            <VDataTableServer
                :headers="gridHeaders"
                :loading="loading"
                :items="resultEntities"
                :items-length="totalResultCount"
                density="compact"
                multi-sort
                @update:options="gridUpdated"
            />
        </VRow>
    </VContainer>
</template>

<style lang="scss" scoped>
.query-input {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 2.25rem 0.65fr 0.35fr 2.25rem 2.25rem;
    column-gap: 0.5rem;
    margin: 0 0.5rem;
    align-items: center;
    justify-items: stretch;
}
</style>
