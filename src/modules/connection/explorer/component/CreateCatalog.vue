<template>
    <VDialog v-model="visibleCreateCatalog" class="w-25">
        <VCard>
            <VCardTitleWithActions>
                <template #default>
                    {{ t('explorer.connection.createCatalog.title') }}
                </template>
            </VCardTitleWithActions>
            <VCardText>
                <VLabel>{{
                    t('explorer.connection.createCatalog.description')
                }}</VLabel>
                <VTextField
                    variant="outlined"
                    append-inner-icon="mdi-pencil-outline"
                    class="mt-2"
                    v-model="catalogName"
                />

                <div class="buttons">
                    <VBtn variant="outlined" density="compact" @click="changeVisibility(false)">
                        {{ t('common.button.cancel') }}
                        <VTooltip activator="parent">
                            {{ t('common.button.cancel') }}
                        </VTooltip>
                    </VBtn>
                    <VBtn
                        color="success"
                        class="border"
                        variant="outlined"
                        density="compact"
                        prepend-icon="mdi-plus"
                        @click="confirmed(true)"
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
import { ModifyActionService, useModifyActionService } from '@/modules/connection/explorer/service/ModifyActionService'

const { t } = useI18n()

const props = defineProps<{
    visible: boolean
    connection: Connection
}>()

const emit = defineEmits<{
    (e: 'visibleChanged', visible: boolean): void
    (e: 'confirmed'): void
}>()

const visibleCreateCatalog = ref<boolean>(props.visible)
const catalogName = ref<string>('')
const modifyActionService: ModifyActionService = useModifyActionService()

function changeVisibility(visible: boolean) {
    visibleCreateCatalog.value = visible
    emit('visibleChanged', visibleCreateCatalog.value)
}

async function confirmed(value: boolean) {
    if (value) {
        const res = await modifyActionService.createCatalog(props.connection, catalogName.value)
        if(res){
            emit('confirmed')
        }
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
