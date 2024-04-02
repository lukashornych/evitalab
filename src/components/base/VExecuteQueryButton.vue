<script setup lang="ts">

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

/**
 * Pre-defined button to execute queries.
 */
const props = withDefaults(defineProps<{
    loading?: boolean
}>(), {
    loading: false
})
const emit = defineEmits<{
    (e: 'click'): void
}>()
</script>

<template>
    <VBtn
        :loading="loading"
        density="compact"
        @click="emit('click')"
        class="v-btn--variant-primary ml-3"
    >
        <VIcon>mdi-play-outline</VIcon>

        <slot>
            <VTooltip activator="parent">
                {{ t('common.button.executeQuery') }}
            </VTooltip>
            {{ t('common.button.run') }}
        </slot>
    </VBtn>
</template>

<style lang="scss" scoped>

</style>
