<template>
    <VDialog v-model="visibleDropDialog" class="w-25">
        <VCard>
            <VCardTitleWithActions>
                <template #default>
                    {{ t('serverActions.createCollection.title') }}
                </template>
            </VCardTitleWithActions>
            <VCardText>
                <p>{{ t('serverActions.createCollection.newCatalogName') }}</p>
                <VTextField variant="outlined" class="mt-3" v-model="collectionName"></VTextField>
                <div class="buttons">
                    <VBtn variant="outlined" density="compact" @click="changeVisibility(false)">
                        {{ t('common.button.cancel') }}
                        <VTooltip activator="parent">
                            {{ t('common.button.cancel') }}
                        </VTooltip>
                    </VBtn>
                    <VBtn
                        prepend-icon="mdi-plus"
                        variant="outlined"
                        density="compact"
                        color="success"
                        class="border"
                        @click="confirmed"
                    >
                        {{ t('common.button.add') }}
                        <VTooltip activator="parent">
                            {{ t('common.button.add') }}
                        </VTooltip>
                    </VBtn>
                </div>
            </VCardText>
        </VCard>
    </VDialog>
</template>

<script setup lang="ts">
import VCardTitleWithActions from '@/modules/base/component/VCardTitleWithActions.vue'
import { Connection } from '@/modules/connection/model/Connection'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
    VBtn,
    VCard,
    VCardText,
    VDialog,
    VTextField,
    VTooltip,
} from 'vuetify/lib/components/index.mjs'
import { ModifyActionService, useModifyActionService } from '../services/ModifyActionService'

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
const visibleDropDialog = ref<boolean>(props.visible)
const collectionName = ref<string>('')
const modifyActionService: ModifyActionService = useModifyActionService()

function changeVisibility(visible: boolean) {
    visibleDropDialog.value = visible
    emit('visibleChanged', visibleDropDialog.value)
}

async function confirmed(value: boolean) {
    console.log(collectionName.value)
    if (value) {
        const res = await modifyActionService.createCollection(props.connection, collectionName.value, props.catalogName)
        if(res)
            emit('confirmed')
    }
    changeVisibility(false)
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
    border-color: $success !important;
}
</style>
