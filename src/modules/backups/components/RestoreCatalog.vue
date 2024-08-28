<template>
    <VDialog>
        <VCard>
            <VCardTitleWithActions>
                <template #default>
                    {{
                        t('backups.createDialog.titleFirst') +
                        t('backups.createDialog.titleSecond')
                    }}
                </template>
            </VCardTitleWithActions>
        </VCard>
    </VDialog>
</template>

<script setup lang="ts">
import VCardTitleWithActions from '@/modules/base/component/VCardTitleWithActions.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n()


</script>

<style scoped>

</style>