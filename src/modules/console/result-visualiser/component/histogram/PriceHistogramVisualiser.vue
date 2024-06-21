<script setup lang="ts">
/**
 * Visualises the raw JSON price histogram.
 */

import { ResultVisualiserService } from '@/services/editor/result-visualiser/result-visualiser.service'
import { Result, VisualisedHistogram } from '@/model/editor/result-visualiser'
import LabEditorResultVisualiserMissingDataIndicator
    from '@/components/lab/editor/result-visualiser/LabEditorResultVisualiserMissingDataIndicator.vue'
import { computed } from 'vue'
import { Toaster, useToaster } from '@/services/editor/toaster'
import LabEditorResultVisualiserHistogram
    from '@/components/lab/editor/result-visualiser/histogram/LabEditorResultVisualiserHistogram.vue'
import { useI18n } from 'vue-i18n'

const toaster: Toaster = useToaster()
const { t } = useI18n()

const props = defineProps<{
    visualiserService: ResultVisualiserService,
    priceHistogramResult: Result
}>()

const histogram = computed<VisualisedHistogram | undefined>(() => {
    try {
        return props.visualiserService
            .getPriceHistogramService()
            .resolvePriceHistogram(props.priceHistogramResult)
    } catch (e: any) {
        toaster.error(e)
        return undefined
    }
})
</script>

<template>
    <LabEditorResultVisualiserHistogram v-if="histogram" :histogram="histogram" />

    <LabEditorResultVisualiserMissingDataIndicator
        v-else
        icon="mdi-text-search"
        :title="t('resultVisualizer.priceHistogram.placeholder.noPriceHistograms')"
    />
</template>

<style lang="scss" scoped>

</style>
