<template>
    <VDialog v-if="visibleRenameDialog" v-model="visibleRenameDialog" class="w-25 min-width">
        <VCard>
            <VCardTitleWithActions>
                <template #default>
                    {{ t('explorer.catalog.renameCatalog.title') }}
                </template>
            </VCardTitleWithActions>
            <VCardText>
                <p>{{ t('explorer.catalog.renameCatalog.description') }} <b>{{ props.catalogName }}</b></p>
                <VTextField
                    :label="t('explorer.catalog.renameCatalog.form.rename.label')"
                    variant="outlined"
                    class="rename-input"
                    append-inner-icon="mdi-pencil-outline"
                    v-model="newCatalogName">

                </VTextField>
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
                        prepend-icon="mdi-pencil-outline"
                        variant="outlined"
                        density="compact"
                        color="error"
                        class="border"
                        @click="showConfirmation"
                    >
                        {{ t('common.button.rename') }}
                        <VTooltip activator="parent">
                            {{ t('common.button.rename') }}
                        </VTooltip>
                    </VBtn>
                </div>
            </VCardText>
        </VCard>
    </VDialog>
    <ConfirmDialog @confirmed="confirmed" v-else> </ConfirmDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Connection } from '@/modules/connection/model/Connection'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { ModifyActionService, useModifyActionService } from '@/modules/connection/explorer/service/ModifyActionService'
import VCardTitleWithActions from '@/modules/base/component/VCardTitleWithActions.vue'
import ConfirmDialog from '@/modules/connection/explorer/component/ConfirmDialog.vue'

const modifyActionService: ModifyActionService = useModifyActionService()

const { t } = useI18n()
const props = defineProps<{
    visible: boolean
    catalogName: string
    connection: Connection
}>()
const emit = defineEmits<{ (e: 'visibleChanged', visible: boolean): void, (e: 'confirmed'):void }>()

const visibleRenameDialog = ref<boolean>(props.visible)
const newCatalogName = ref<string>('')

function changeVisibility(visible: boolean) {
    visibleRenameDialog.value = visible
    emit('visibleChanged', visibleRenameDialog.value)
}

function showConfirmation() {
    visibleRenameDialog.value = false
}

async function confirmed(value: boolean) {
    if (value) {
        const res = await modifyActionService.renameCatalog(props.connection, props.catalogName, newCatalogName.value)
        if(res)
            emit('confirmed')
        else
            throw new UnexpectedError('Catalog can not be renamed. Try it again')
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

.rename-input {
    margin-top: 15px
}

.min-width {
    min-width: 400px;
}
</style>
