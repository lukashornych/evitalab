<script setup lang="ts">

import { EntityPrice } from '@/model/editor/tab/dataGrid/data-grid'
import VPropertiesTable from '@/components/base/VPropertiesTable.vue'
import { computed } from 'vue'
import { KeywordValue, Property, PropertyValue, RangeValue } from '@/model/properties-table'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
    price: EntityPrice
}>()

const properties = computed<Property[]>(() => {
    const priceFormatter = new Intl.NumberFormat(
        navigator.language,
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )
    const taxFormatter = new Intl.NumberFormat(
        navigator.language,
        { style: 'percent', maximumFractionDigits: 0 }
    )

    return [
        { name: t('entityGrid.grid.priceRenderer.price.label.priceId'), value: new PropertyValue(props.price.priceId) },
        { name: t('entityGrid.grid.priceRenderer.price.label.priceList'), value: new PropertyValue(new KeywordValue(props.price.priceList)) },
        { name: t('entityGrid.grid.priceRenderer.price.label.currency'), value: new PropertyValue(new KeywordValue(props.price.currency)) },
        { name: t('entityGrid.grid.priceRenderer.price.label.innerRecordId'), value: new PropertyValue(props.price.innerRecordId) },
        { name: t('entityGrid.grid.priceRenderer.price.label.sellable'), value: new PropertyValue(props.price.sellable) },
        { name: t('entityGrid.grid.priceRenderer.price.label.validity'), value: new PropertyValue(new RangeValue(props.price.validity)) },
        { name: t('entityGrid.grid.priceRenderer.price.label.priceWithoutTax'), value: new PropertyValue(priceFormatter.format(parseFloat(props.price.priceWithoutTax))) },
        { name: t('entityGrid.grid.priceRenderer.price.label.priceWithTax'), value: new PropertyValue(priceFormatter.format(parseFloat(props.price.priceWithTax))) },
        { name: t('entityGrid.grid.priceRenderer.price.label.taxRate'), value: new PropertyValue(new KeywordValue(taxFormatter.format(parseFloat(props.price.taxRate) / 100))) }
    ]
})
</script>

<template>
    <VPropertiesTable :properties="properties" class="price-table"/>
</template>

<style lang="scss" scoped>
.price-table {
    table, th, td {
        border: none !important;
    }
}
</style>
