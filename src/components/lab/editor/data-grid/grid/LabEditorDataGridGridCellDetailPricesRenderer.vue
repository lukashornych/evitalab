<script setup lang="ts">
/**
 * Special entity property value renderer for prices.
 */

import { computed, ref, watch } from 'vue'
import {
    EntityPrice,
    EntityPrices,
    EntityPropertyValue,
    priceTypeKey,
    queryFilterKey,
    queryLanguageKey
} from '@/model/editor/data-grid'
import { Toaster, useToaster } from '@/services/editor/toaster'
import VMarkdown from '@/components/base/VMarkdown.vue'
import LabEditorDataGridGridCellDetailPricesRendererPrice
    from '@/components/lab/editor/data-grid/grid/LabEditorDataGridGridCellDetailPricesRendererPrice.vue'
import { mandatoryInject } from '@/helpers/reactivity'
import { QueryPriceMode } from '@/model/evitadb'
import VExpansionPanelLazyIterator from '@/components/base/VExpansionPanelLazyIterator.vue'
import { QueryLanguage } from '@/model/lab'

const priceInPriceListsConstraintPattern = new Map<QueryLanguage, RegExp>([
    [QueryLanguage.EvitaQL, /priceInPriceLists\(\s*['"]([A-Za-z0-9_.\-~]*)['"]/],
    [QueryLanguage.GraphQL, /priceInPriceLists\s*:\s*\[?\s*"([A-Za-z0-9_.\-~]+)"/]
])
const priceInCurrencyConstraintPattern = new Map<QueryLanguage, RegExp>([
    [QueryLanguage.EvitaQL, /priceInCurrency\(\s*['"]([A-Za-z0-9_.\-~]*)['"]\s*\)/],
    [QueryLanguage.GraphQL, /priceInCurrency\s*:\s*([A-Z_]+)/]
])
type FilterData = {
    priceIds: number[],
    priceLists: string[],
    currencies: string[],
    innerRecordIds: number[]
}

const toaster: Toaster = useToaster()

const props = withDefaults(defineProps<{
    value: EntityPropertyValue | EntityPropertyValue[],
    fillSpace?: boolean
}>(), {
    fillSpace: true
})
const queryLanguage = mandatoryInject(queryLanguageKey)
const priceType = mandatoryInject(priceTypeKey)
const queryFilter = mandatoryInject(queryFilterKey)

const prices = computed<EntityPrices>(() => {
    if (!(props.value instanceof EntityPrices)) {
        toaster.error('Invalid prices object!')
        return new EntityPrices(undefined, [])
    }
    return props.value as EntityPrices
})

const filterData = computed<FilterData>(() => {
    const priceIds: number[] = []
    const priceLists: string[] = []
    const currencies: string[] = []
    const innerRecordIds: number[] = []

    for (const price of prices.value.prices) {
        if (!priceIds.includes(price.priceId)) {
            priceIds.push(price.priceId)
        }
        if (!priceLists.includes(price.priceList)) {
            priceLists.push(price.priceList)
        }
        if (!currencies.includes(price.currency)) {
            currencies.push(price.currency)
        }
        if (price.innerRecordId != undefined && !innerRecordIds.includes(price.innerRecordId)) {
            innerRecordIds.push(price.innerRecordId)
        }
    }

    return {
        priceIds,
        priceLists,
        currencies,
        innerRecordIds
    }
})

const selectedPriceId = ref<number | undefined>()
const selectedPriceList = ref<string | undefined>()
const selectedCurrency = ref<string | undefined>()
const selectedInnerRecordId = ref<number | undefined>()
const filteredAllPrices = computed<EntityPrice[]>(() => {
    // note: originally we wanted to do server call here for filtering, but it seems to be really fast in browser (tested on hundreds of prices)
    return prices.value.prices.filter((price) => {
        if (selectedPriceId.value != undefined && price.priceId !== selectedPriceId.value) {
            return false
        }
        if (selectedPriceList.value != undefined && price.priceList !== selectedPriceList.value) {
            return false
        }
        if (selectedCurrency.value != undefined && price.currency !== selectedCurrency.value) {
            return false
        }
        if (selectedInnerRecordId.value != undefined && price.innerRecordId !== selectedInnerRecordId.value) {
            return false
        }
        return true
    })
})

const allPricesPage = ref<number>(1)
watch(filteredAllPrices, () => {
    // reset paging when filter changes
    allPricesPage.value = 1
})

async function preselectFilterFromQuery(): Promise<void> {
    return new Promise(() => {
        const priceList: string | undefined = priceInPriceListsConstraintPattern.get(queryLanguage.value!)!.exec(queryFilter?.value || '')?.[1]
        const currency: string | undefined = priceInCurrencyConstraintPattern.get(queryLanguage.value!)!.exec(queryFilter?.value || '')?.[1]
        if (priceList != undefined) {
            selectedPriceList.value = priceList
        }
        if (currency != undefined) {
            selectedCurrency.value = currency
        }
    })
}
watch(queryFilter, () => {
    preselectFilterFromQuery()
})
preselectFilterFromQuery()

</script>

<template>
    <div class="price-renderer">
        <div  class="price-renderer-price-for-sale">
            <header>
                <h3>Price for sale</h3>
            </header>

            <VMarkdown v-if="prices.priceForSale == undefined" :source="'No price for sale found. To compute price for sale, following constraints need to be present in the filter: `priceInPriceLists`, `priceInCurrency`.'" />
            <LabEditorDataGridGridCellDetailPricesRendererPrice v-else :price="prices.priceForSale"/>
        </div>

        <div class="price-renderer-all-prices">
            <header>
                <h3>All prices</h3>

                <div class="price-renderer-all-prices__filter">
                    <VCombobox
                        v-model="selectedPriceId"
                        :disabled="filterData.priceIds.length === 0"
                        prepend-inner-icon="mdi-identifier"
                        label="Price ID"
                        :items="filterData.priceIds"
                        class="price-renderer-all-prices__select"
                        clearable
                        hide-details
                    />
                    <VCombobox
                        v-model="selectedPriceList"
                        :disabled="filterData.priceLists.length === 0"
                        prepend-inner-icon="mdi-format-list-bulleted"
                        label="Price list"
                        :items="filterData.priceLists"
                        class="price-renderer-all-prices__select"
                        clearable
                        hide-details
                    />
                    <VCombobox
                        v-model="selectedCurrency"
                        :disabled="filterData.currencies.length === 0"
                        prepend-inner-icon="mdi-currency-usd"
                        label="Currency"
                        :items="filterData.currencies"
                        class="price-renderer-all-prices__select"
                        clearable
                        hide-details
                    />
                    <VCombobox
                        v-model="selectedInnerRecordId"
                        :disabled="filterData.innerRecordIds.length === 0"
                        prepend-inner-icon="mdi-format-list-group"
                        label="Inner record IDs"
                        :items="filterData.innerRecordIds"
                        class="price-renderer-all-prices__select"
                        clearable
                        hide-details
                    />
                </div>
            </header>

            <VExpansionPanels variant="accordion" multiple>
                <VExpansionPanelLazyIterator
                    v-model:page="allPricesPage"
                    :page-size="10"
                    :items="filteredAllPrices"
                >
                    <template #item="{ item, index }: { item: EntityPrice, index: number }">

                        <VExpansionPanel :key="index">
                            <VExpansionPanelTitle>
                                <VTooltip>
                                    <template #activator="{ props }">
                                        <VIcon class="mr-3" v-bind="props">{{ item.sellable ? 'mdi-cash' : 'mdi-cash-off' }}</VIcon>
                                    </template>

                                    <template v-if="item.sellable">
                                        This price is sellable.
                                    </template>
                                    <template v-else>
                                        This price is not sellable.
                                    </template>
                                </VTooltip>

                                <VChipGroup>
                                    <VChip prepend-icon="mdi-identifier">
                                        <span>
                                            {{ item.priceId }}

                                            <VTooltip activator="parent">
                                                Price ID
                                            </VTooltip>
                                        </span>
                                        <span v-if="item.innerRecordId != undefined">
                                            &nbsp;/&nbsp;{{ item.innerRecordId }}

                                            <VTooltip activator="parent">
                                                Inner record ID
                                            </VTooltip>
                                        </span>
                                    </VChip>
                                    <VChip prepend-icon="mdi-format-list-bulleted">
                                        {{ item.priceList }}

                                        <VTooltip activator="parent">
                                            Price list
                                        </VTooltip>
                                    </VChip>
                                    <VChip>
                                        {{ item.toPreviewString({ priceType }) }}

                                        <VTooltip activator="parent">
                                            <template v-if="priceType == QueryPriceMode.WithTax">
                                                Price with tax
                                            </template>
                                            <template v-else>
                                                Price without tax
                                            </template>
                                        </VTooltip>
                                    </VChip>
                                </VChipGroup>
                            </VExpansionPanelTitle>

                            <VExpansionPanelText>
                                <LabEditorDataGridGridCellDetailPricesRendererPrice :price="item" />
                            </VExpansionPanelText>
                        </VExpansionPanel>
                    </template>
                </VExpansionPanelLazyIterator>

            </VExpansionPanels>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.price-renderer {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 1rem;

    h3 {
        margin-bottom: 1rem;
    }

    &-all-prices {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        &__filter {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }

        &__select {
            flex: 1;
            min-width: 10rem;
        }
    }
}

.array-item__title {
    text-overflow: ellipsis;
    text-wrap: nowrap;
    overflow: hidden;
    padding-right: 1rem;
}
</style>
