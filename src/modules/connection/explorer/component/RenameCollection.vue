<template>
    <VDialog v-if="visibleRenameCollection" v-model="visibleRenameCollection" class="w-25 min-width">
        <VCard>
            <VCardTitleWithActions>
                <template #default>
                    {{ t('serverActions.renameCollection.title') }}
                </template>
            </VCardTitleWithActions>
            <VCardText>
                <p>{{ t('serverActions.renameCatalog.description') }} <b>{{ props.collectionName }}</b></p>
                <VTextField
                    :label="t('serverActions.renameCollection.rename')"
                    variant="outlined"
                    class="rename-input"
                    append-inner-icon="mdi-pencil-outline"
                    v-model="newCollectionName">

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
import VCardTitleWithActions from '@/modules/base/component/VCardTitleWithActions.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError';
import { Connection } from '@/modules/connection/model/Connection';
import ConfirmDialog from './ConfirmDialog.vue';
import { Catalog } from '@/modules/connection/model/Catalog';
import { ModifyActionService, useModifyActionService } from '@/modules/connection/explorer/service/ModifyActionService'

const modifyActionService: ModifyActionService = useModifyActionService()

const props = defineProps<{
    visible: boolean
    catalogName: string
    collectionName: string
    connection: Connection
}>()

const { t } = useI18n()
const emit = defineEmits<{ (e: 'visibleChanged', visible: boolean): void, (e: 'confirmed', value?: Catalog[] | undefined):void }>()

const visibleRenameCollection = ref<boolean>(props.visible)
const newCollectionName = ref<string>('')

function changeVisibility(visible: boolean) {
    visibleRenameCollection.value = visible
    emit('visibleChanged', visibleRenameCollection.value)
}

function showConfirmation() {
    visibleRenameCollection.value = false
}

async function confirmed(value: boolean) {
    if (value) {
        const res = await modifyActionService.renameCollection(props.connection, props.collectionName, newCollectionName.value, props.catalogName)
        if(res)
            emit('confirmed', res)
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
