<template>
    <VDialog v-if="visibleDropCollection" v-model="visibleDropCollection" class="w-25">
        <VCard>
            <VCardTitleWithActions>
                <template #default>
                    {{ t('serverActions.dropCollection.title') }}
                </template>
            </VCardTitleWithActions>
            <VCardText>
                <p>{{ t('serverActions.dropCollection.description') }} <b>{{ props.collectionName }}</b></p>
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
                        color="error"
                        class="border"
                        @click="showConfirmation"
                    >
                        {{ t('common.button.drop') }}
                        <VTooltip activator="parent">
                            {{ t('common.button.drop') }}
                        </VTooltip>
                    </VBtn>
                </div>
            </VCardText>
        </VCard>
    </VDialog>
    <ConfirmDialog v-else @confirmed="confirmed" />
</template>

<script setup lang="ts">
import VCardTitleWithActions from '@/modules/base/component/VCardTitleWithActions.vue'
import { Connection } from '@/modules/connection/model/Connection';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n'
import { VBtn, VCard, VCardText, VDialog, VTooltip } from 'vuetify/lib/components/index.mjs'
import { ModifyActionService, useModifyActionService } from '../services/ModifyActionService';
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError';
import ConfirmDialog from './ConfirmDialog.vue';
import { Catalog } from '@/modules/connection/model/Catalog';

const { t } = useI18n()
const props = defineProps<{
    visible: boolean
    collectionName: string
    catalogName: string
    connection: Connection
}>()
const visibleDropCollection = ref<boolean>(props.visible)
const modifyActionService: ModifyActionService = useModifyActionService()
const emit = defineEmits<{ (e: 'visibleChanged', visible: boolean): void, (e: 'confirmed', value?: Catalog[] | undefined):void }>()

function changeVisibility(visible: boolean) {
    visibleDropCollection.value = visible
    emit('visibleChanged', visibleDropCollection.value)
}

function showConfirmation() {
    visibleDropCollection.value = false
}

async function confirmed(value: boolean) {
    if (value) {
        const res = await modifyActionService.dropCollection(props.connection, props.collectionName, props.catalogName)
        if(res)
            emit('confirmed', res)
        else
            throw new UnexpectedError('Collection can not be deleted. Try it again')
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
    border-color: $error !important;
}
</style>
