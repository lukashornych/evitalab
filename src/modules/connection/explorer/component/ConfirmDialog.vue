<template>
    <VDialog v-model="visible" class="w-25">
        <VCard>
            <VCardTitleWithActions>
                <template #default>
                    {{ t('explorer.catalog.confirmCatalog.title') }}
                </template>
            </VCardTitleWithActions>
            <VCardText>
                <p>{{ t('explorer.catalog.confirmCatalog.description') }}</p>
                <div class="buttons">
                    <VBtn
                        variant="outlined"
                        density="compact"
                        @click="setResult(false)"
                    >
                        {{ t('common.button.cancel') }}
                        <VTooltip activator="parent">
                            {{ t('common.button.cancel') }}
                        </VTooltip>
                    </VBtn>
                    <VBtn
                        prepend-icon="mdi-exclamation"
                        variant="outlined"
                        color="error"
                        density="compact"
                        class="border"
                        @click="setResult(true)"
                    >
                        {{ t('common.button.confirm') }}
                        <VTooltip activator="parent">
                            {{ t('common.button.confirm') }}
                        </VTooltip>
                    </VBtn>
                </div>
            </VCardText>
        </VCard>
    </VDialog>
</template>

<script setup lang="ts">
import VCardTitleWithActions from '@/modules/base/component/VCardTitleWithActions.vue';
import { VBtn, VCard, VCardText, VDialog, VTooltip } from 'vuetify/lib/components/index.mjs';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const visible = ref<boolean>(true)
const { t } = useI18n();

const emit = defineEmits<{ (e: 'confirmed', value: boolean): void }>()

function setResult(confirmed: boolean){
    emit('confirmed', confirmed)
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';
.buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-top: 15px;
}
.border {
    border-color: $error !important;
}
</style>
