<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { VDataTableServer } from 'vuetify/labs/VDataTable'

import { ref, watch } from 'vue'
import { DataGridConsoleProps } from '@/model/tab/data-grid-console'
import { Extension } from '@codemirror/state'
import { DataGridConsoleService, useDataGridConsoleService } from '@/services/tab/data-grid-console.service'
import CodemirrorOneLine from '@/components/CodemirrorOneLine.vue'
import { QueryLanguage } from '@/model/lab'
import { DataGridQueryResult } from '@/services/tab/data-grid-console/query-executor'
import CodemirrorFull from '@/components/CodemirrorFull.vue'

const dataGridConsoleService: DataGridConsoleService = useDataGridConsoleService()

const props = defineProps<DataGridConsoleProps>()

// static data
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

let entityProperties: string[] = []
let dataLocales: string[] = []

let gridHeaders: Map<String, any> = new Map<String, any>()

// dynamic user data
const selectedQueryLanguage = ref<QueryLanguage[]>([QueryLanguage.EvitaQL])
watch(selectedQueryLanguage, (newValue, oldValue) => {
    if (newValue[0] === oldValue[0]) {
        return
    }

    filterByCode.value = ''
    orderByCode.value = ''
})

const loading = ref<boolean>(false)
const pageNumber = ref<number>(1)
const pageSize = ref<number>(20)

const filterByCode = ref<string>('')
const filterByExtensions: Extension[] = []

const orderByCode = ref<string>('')
const orderByExtensions: Extension[] = []

const selectedDataLocales = ref<string[]>(['none'])
watch(selectedDataLocales, () => executeQuery())

const displayedData = ref<string[]>([])
watch(displayedData, (newValue, oldValue) => {
    updateDisplayedGridHeaders()

    // re-fetch entities only if new properties were added, only in such case there could be missing data when displaying
    // the new properties
    if (newValue.length > oldValue.length) {
        executeQuery()
    }
})

const displayedGridHeaders = ref<any[]>([])
const resultEntities = ref<any[]>([])
const totalResultCount = ref<number>(0)


const showPropertyDetail = ref<boolean>(false)
const propertyDetailName = ref<string>('')
const propertyDetailValue = ref<string>('')

const initialized = ref<boolean>(false)


function initializeConsole(): void {
    // note: we can use async/await here, because that would make this component async which currently doesn't seem to work
    // properly in combination with dynamic <component> rendering and tabs

    dataGridConsoleService.getDataLocales(props.dataPointer)
        .then(dl => {
            dataLocales = dl
            return dataGridConsoleService.getEntityProperties(props.dataPointer)
        })
        .then(ep => {
            entityProperties = ep
            return initializeGridHeaders(ep)
        })
        .then(gh => {
            gridHeaders = gh

            // preselect all properties
            toggleAllEntityProperties()

            initialized.value = true
        })
}

async function initializeGridHeaders(entityProperties: string[]): Promise<Map<string, any>> {
    const gridHeaders: Map<string, any> = new Map<string, any>()
    for (const property of entityProperties) {
        gridHeaders.set(
            property,
            {
                key: property,
                title: property,
                sortable: await dataGridConsoleService.isEntityPropertySortable(props.dataPointer, property)
            }
        )
    }
    return gridHeaders
}

async function updateDisplayedGridHeaders(): Promise<void> {
    displayedGridHeaders.value = displayedData.value.map(property => gridHeaders.get(property))

    // sort grid headers by entity properties order
    displayedGridHeaders.value.sort((a, b) => {
        return entityProperties.indexOf(a.key) - entityProperties.indexOf(b.key)
    })
}

function toggleAllEntityProperties(): void {
    if (displayedData.value.length < entityProperties.length) {
        displayedData.value = entityProperties.slice()
    } else {
        displayedData.value = []
    }
}

async function gridUpdated({ page, itemsPerPage, sortBy }): Promise<void> {
    pageNumber.value = page
    if (itemsPerPage > -1) {
        // -1 means all items, that would be too much data to render
        pageSize.value = itemsPerPage
    }
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
        selectedDataLocales.value.length === 0 ? undefined : selectedDataLocales.value[0],
        displayedData.value,
        pageNumber.value,
        pageSize.value
    )
    resultEntities.value = result.entities
    totalResultCount.value = result.totalEntitiesCount

    loading.value = false
}

function openPropertyDetail(property: string, value: string): void {
    propertyDetailName.value = property
    propertyDetailValue.value = value
    showPropertyDetail.value = true
}

function closePropertyDetail(): void {
    showPropertyDetail.value = false
    propertyDetailName.value = ''
    propertyDetailValue.value = ''
}

initializeConsole()
</script>

<template>
    <div v-if="initialized">
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

                <template #append>
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
                </template>

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

        <Splitpanes vertical>
            <Pane
                size="70"
                min-size="30"
            >
                <VDataTableServer
                    :headers="displayedGridHeaders"
                    :loading="loading"
                    :items="resultEntities"
                    :items-length="totalResultCount"
                    density="compact"
                    multi-sort
                    @update:options="gridUpdated"
                >
                    <template #item="{ item }">
                        <tr>
                            <td
                                v-for="(propertyValue, propertyName) in item.columns"
                                :key="propertyName"
                                @click="openPropertyDetail(propertyName, propertyValue)"
                            >
                                {{ propertyValue !== undefined && propertyValue.length > 20 ? propertyValue.substring(0, 20) + '...' : propertyValue }}
                            </td>
                        </tr>
                    </template>
                </VDataTableServer>
            </Pane>
            <Pane
                v-if="showPropertyDetail"
                size="30"
            >
                <VCard>
                    <VCardTitle>
                        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
                            <span>
                                {{ propertyDetailName }}
                            </span>
                            <VBtn
                                icon
                                variant="flat"
                                density="compact"
                                @click="closePropertyDetail"
                            >
                                <VIcon>mdi-close</VIcon>
                            </VBtn>
                        </div>
                    </VCardTitle>
                    <VDivider />
                    <VCardText>
                        <CodemirrorFull v-model="propertyDetailValue" />
                    </VCardText>
                </VCard>
            </Pane>
        </Splitpanes>
    </div>
    <div v-else>
        Loading...
    </div>
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
