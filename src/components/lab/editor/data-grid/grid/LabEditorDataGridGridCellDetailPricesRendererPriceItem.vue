<script setup lang="ts">
/**
 * Represents single item in all entity prices list in price renderer.
 */

import { QueryPriceMode } from '@/model/evitadb'
import { EntityPrice, priceTypeKey } from '@/model/editor/tab/dataGrid/data-grid'
import { mandatoryInject } from '@/helpers/reactivity'
import LabEditorDataGridGridCellDetailPricesRendererPrice
    from '@/components/lab/editor/data-grid/grid/LabEditorDataGridGridCellDetailPricesRendererPrice.vue'
import VMarkdown from '@/components/base/VMarkdown.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = withDefaults(defineProps<{
    price: EntityPrice
    priceForSale?: boolean
    virtualPriceForSale?: boolean
}>(), {
    priceForSale: false,
    virtualPriceForSale: false
})
const priceType = mandatoryInject(priceTypeKey)

</script>

<template>
    <VExpansionPanel :key="price.priceId">
        <VExpansionPanelTitle>
            <VTooltip v-if="priceForSale">
                <template #activator="{ props }">
                    <VIcon class="mr-3" v-bind="props">mdi-cart-outline</VIcon>
                </template>

                {{ t('entityGrid.grid.priceRenderer.price.help.priceForSale') }}
            </VTooltip>

            <VTooltip>
                <template #activator="{ props }">
                    <VIcon class="mr-3" v-bind="props">{{ price.sellable ? 'mdi-cash' : 'mdi-cash-off' }}</VIcon>
                </template>

                <template v-if="price.sellable">
                    {{ t('entityGrid.grid.priceRenderer.price.tooltip.sellablePrice') }}
                </template>
                <template v-else>
                    {{ t('entityGrid.grid.priceRenderer.price.tooltip.notSellablePrice') }}
                </template>
            </VTooltip>

            <VChipGroup>
                <VChip v-if="!virtualPriceForSale" prepend-icon="mdi-identifier">
                    <span>
                        {{ price.priceId }}

                        <VTooltip activator="parent">
                            {{ t('entityGrid.grid.priceRenderer.price.label.priceId') }}
                        </VTooltip>
                    </span>
                        <span v-if="price.innerRecordId != undefined">
                        &nbsp;/&nbsp;{{ price.innerRecordId }}

                        <VTooltip activator="parent">
                            {{ t('entityGrid.grid.priceRenderer.price.label.innerRecordId') }}
                        </VTooltip>
                    </span>
                </VChip>
                <VChip v-else prepend-icon="mdi-identifier" variant="flat">
                    <span>
                        {{ t('entityGrid.grid.priceRenderer.price.label.virtual' )}}

                        <VTooltip activator="parent">
                            <VMarkdown :source="t('entityGrid.grid.priceRenderer.price.help.virtualPriceForSale')"/>
                        </VTooltip>
                    </span>
                </VChip>

                <VChip prepend-icon="mdi-format-list-bulleted">
                    {{ price.priceList }}

                    <VTooltip activator="parent">
                        {{ t('entityGrid.grid.priceRenderer.price.label.priceList') }}
                    </VTooltip>
                </VChip>

                <VChip>
                    {{ price.toPreviewString({ priceType }) }}

                    <VTooltip activator="parent">
                        <template v-if="priceType == QueryPriceMode.WithTax">
                            {{ t('entityGrid.grid.priceRenderer.price.label.priceWithTax') }}
                        </template>
                        <template v-else>
                            {{ t('entityGrid.grid.priceRenderer.price.label.priceWithoutTax') }}
                        </template>
                    </VTooltip>
                </VChip>
            </VChipGroup>
        </VExpansionPanelTitle>

        <VExpansionPanelText>
            <LabEditorDataGridGridCellDetailPricesRendererPrice :price="price" />
        </VExpansionPanelText>
    </VExpansionPanel>
</template>

<style lang="scss" scoped>

</style>
