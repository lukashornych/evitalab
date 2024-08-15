<template>
    <VDialog class="w-25">
        <VCard>
            <VCardTitleWithActions>
                <template #default>
                    {{ t('serverActions.replaceCatalog.title') }}
                </template>
            </VCardTitleWithActions>
            <VCardText>

            </VCardText>
        </VCard>
    </VDialog>
</template>

<script setup lang="ts">
import VCardTitleWithActions from '@/modules/base/component/VCardTitleWithActions.vue';
import { Connection } from '@/modules/connection/model/Connection';
import { useI18n } from 'vue-i18n';
import { VCard, VCardText, VDialog } from 'vuetify/lib/components/index.mjs';

const { t } = useI18n()

const props = defineProps<{
    visible: boolean
    catalogName: string
    connection: Connection
}>()
const emit = defineEmits<{
    (e: 'visibleChanged', visible: boolean): void
    (e: 'confirmed'): void
}>()
</script>

<style scoped>

</style>