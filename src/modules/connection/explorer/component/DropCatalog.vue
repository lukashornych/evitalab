<template>
    <VDialog v-if="visibleDropDialog" v-model="visibleDropDialog" class="w-25">
        <VCard>
            <VCardTitleWithActions>
                <template #default>
                    {{ t('explorer.catalog.dropCatalog.title') }}
                </template>
            </VCardTitleWithActions>
            <VCardText>
                <p>{{ t('explorer.catalog.dropCatalog.description') }} <b>{{ props.catalogName }}</b></p>
                <div class="buttons">
                    <VBtn
                        variant="outlined"
                        density="compact"
                        @click="changeVisibility(false)"
                    >
                        {{ t('common.button.cancel') }}
                        <VTooltip activator="parent">
                            {{ t('common.button.cancel') }}
                        </VTooltip>
                    </VBtn>
                    <VBtn
                        prepend-icon="mdi-delete-outline"
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
    <ConfirmDialog @confirmed="confirmed" v-else> </ConfirmDialog>
</template>

<script setup lang="ts">
import VCardTitleWithActions from '@/modules/base/component/VCardTitleWithActions.vue'
import ConfirmDialog from './ConfirmDialog.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Connection } from '@/modules/connection/model/Connection'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { ModifyActionService, useModifyActionService } from '@/modules/connection/explorer/service/ModifyActionService'

const { t } = useI18n()
const props = defineProps<{
    visible: boolean
    catalogName: string
    connection: Connection
}>()
const emit = defineEmits<{ (e: 'visibleChanged', visible: boolean): void, (e: 'confirmed'):void }>()

const visibleDropDialog = ref<boolean>(props.visible)
const modifyActionService: ModifyActionService = useModifyActionService()

function changeVisibility(visible: boolean) {
    visibleDropDialog.value = visible
    emit('visibleChanged', visibleDropDialog.value)
}

function showConfirmation() {
    visibleDropDialog.value = false
}

async function confirmed(value: boolean) {
    if (value) {
        const res = await modifyActionService.dropCatalog(props.connection, props.catalogName)
        if(res)
            emit('confirmed')
        else
            throw new UnexpectedError('Catalog can not be deleted. Try it again')
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
