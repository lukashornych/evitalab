<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'

import { onMounted, ref, watch } from 'vue'
import { DataGridConsoleProps, DataGridQueryResult } from '@/model/tab/data-grid-console'
import { Extension } from '@codemirror/state'
import { DataGridConsoleService, useDataGridConsoleService } from '@/services/tab/data-grid-console.service'
import { LabService, useLabService } from '@/services/lab.service'
import { EntitySchema } from '@/model/evitadb/schema'
import CodemirrorOneLine from '@/components/CodemirrorOneLine.vue'
import { QueryLanguage } from '@/model/lab'

const labService: LabService = useLabService()
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

const dataLanguages = ref<string[]>([])
const selectedDataLanguage = ref<string[]>(['none'])

const displayedData = ref<string[]>([])

const resultHeaders = ref<any[]>([])
const resultEntities = ref<any[]>([])
const totalResultCount = ref<number>(0)

onMounted(async () => {
    const entitySchema: EntitySchema = await labService.getEntitySchema(props.dataPointer.connection, props.dataPointer.catalogName, props.dataPointer.entityType)

    dataLanguages.value = entitySchema.locales

    await buildEntityProperties(entitySchema)

    // preselect all properties
    toggleAllEntityProperties()
    // build data table headers from properties
    resultHeaders.value = entityProperties.value.map(property => {
        return {
            key: property,
            title: property
        }
    })

    await executeQuery()
})

async function buildEntityProperties(entitySchema: EntitySchema): Promise<void> {
    entityProperties.value = ['primaryKey']
    if (entitySchema.withHierarchy) {
        entityProperties.value.push('parent')
    }
    if (entitySchema.locales.length > 0) {
        entityProperties.value.push('locales')
        entityProperties.value.push('allLocales')
    }
    if (entitySchema.withPrice) {
        entityProperties.value.push('priceInnerRecordHandling')
    }
    for (const attributeSchema of entitySchema.allAttributes) {
        entityProperties.value.push(`attributes.${attributeSchema.nameVariants.camelCase}`)
    }
    for (const associatedDataSchema of entitySchema.allAssociatedData) {
        entityProperties.value.push(`associatedData.${associatedDataSchema.nameVariants.camelCase}`)
    }
    for (const referenceSchema of entitySchema.allReferences) {
        entityProperties.value.push(`references.${referenceSchema.nameVariants.camelCase}`)
    }
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
    // todo lho translate sortBy column to orderBy query

    await executeQuery()
}

async function executeQuery(): Promise<void> {
    loading.value = true

    const result: DataGridQueryResult = await dataGridConsoleService.executeQuery(
        props.dataPointer,
        selectedQueryLanguage.value[0],
        filterByCode.value,
        orderByCode.value,
        displayedData.value,
        pageNumber.value,
        pageSize.value
    )
    console.log(result)
    if (result.entities.length === 0) {
        resultEntities.value = []
        // resultEntityHeaders.value = []
    } else {
        [{key: 'primaryKey', title: 'Primary key'}, {key: 'type', title: 'Type'}]

        resultEntities.value = result.entities

    // todo lho flatten the entities ?
    //     resultEntities.value = result.entities.map(entity => {
    //         const flattenedEntity = {}
    //         Object.keys(entity).forEach(key => {
    //             flattenedEntity[key] = entity[key].value
    //         })
    //         return flattenedEntity
    //     })
    }

    totalResultCount.value = result.totalEntitiesCount

    loading.value = false
}
</script>

<template>
    <div class="data-grid">
        <VToolbar>
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
                            Select data language
                        </VTooltip>

                        <VMenu activator="parent">
                            <VList
                                v-model:selected="selectedDataLanguage"
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
                                    v-for="language in dataLanguages"
                                    :key="language"
                                    :value="language"
                                >
                                    <VListItemTitle>{{ language }}</VListItemTitle>
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
                :headers="resultHeaders"
                :loading="loading"
                :items="resultEntities"
                :items-length="totalResultCount"
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
