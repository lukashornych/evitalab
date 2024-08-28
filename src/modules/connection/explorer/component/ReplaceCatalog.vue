<template>
    <VDialog
        v-if="visibleReplaceCatalog"
        v-model="visibleReplaceCatalog"
        class="w-25"
    >
        <VCard>
            <VCardTitleWithActions>
                <template #default>
                    {{ t('explorer.catalog.replaceCatalog.title') }}
                </template>
            </VCardTitleWithActions>
            <VCardText>
                <VLabel>{{
                    t('explorer.catalog.replaceCatalog.form.fromCatalog.help')
                }}</VLabel>
                <VCombobox
                    :label="t('explorer.catalog.replaceCatalog.form.fromCatalog.label')"
                    variant="outlined"
                    v-model="selectedFrom"
                    :items="
                        catalogs
                            ?.filter((x) => x.name !== selectedTo)
                            .map((x) => x.name)
                    "
                    class="mt-4"
                >
                </VCombobox>
                <VLabel>{{
                    t('explorer.catalog.replaceCatalog.form.toCatalog.help')
                }}</VLabel>
                <VCombobox
                    :label="t('explorer.catalog.replaceCatalog.form.toCatalog.label')"
                    variant="outlined"
                    :items="
                        catalogs
                            ?.filter((x) => x.name !== selectedFrom)
                            .map((x) => x.name)
                    "
                    class="mt-4"
                    v-model="selectedTo"
                ></VCombobox>
                <div class="buttons">
                    <VBtn
                        density="compact"
                        variant="outlined"
                        @click="changeVisibility(false)"
                    >
                        {{ t('common.button.cancel') }}
                        <VTooltip activator="parent">
                            {{ t('common.button.cancel') }}
                        </VTooltip>
                    </VBtn>
                    <VBtn
                        density="compact"
                        variant="outlined"
                        prepend-icon="mdi-arrow-right-bottom"
                        color="error"
                        class="border"
                        @click="showConfirmation"
                    >
                        {{ t('common.button.replace') }}
                        <VTooltip>
                            {{ t('common.button.replace') }}
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
import { Connection } from '@/modules/connection/model/Connection'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Catalog } from '@/modules/connection/model/Catalog'
import ConfirmDialog from './ConfirmDialog.vue'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { ModifyActionService, useModifyActionService } from '@/modules/connection/explorer/service/ModifyActionService'

const modifyActionService: ModifyActionService = useModifyActionService()
const { t } = useI18n()

const props = defineProps<{
    visible: boolean
    catalogName: string
    connection: Connection
}>()

const visibleReplaceCatalog = ref<boolean>(props.visible)
const selectedFrom = ref<string>(props.catalogName)
const selectedTo = ref<string>('')
const loadedCatalogs = ref<boolean>(false)
const catalogs = ref<Catalog[]>()

modifyActionService.getCatalogs(props.connection).then((x) => {
    catalogs.value = x
    loadedCatalogs.value = true
})

const emit = defineEmits<{
    (e: 'visibleChanged', visible: boolean): void
    (e: 'confirmed'): void
}>()

function changeVisibility(visible: boolean) {
    visibleReplaceCatalog.value = visible
    emit('visibleChanged', visibleReplaceCatalog.value)
}

function showConfirmation() {
    visibleReplaceCatalog.value = false
}

async function confirmed(value: boolean) {
    if (value) {
        const res = await modifyActionService.replaceCatalog(
            props.connection,
            selectedTo.value,
            selectedFrom.value
        )
        if (res) emit('confirmed')
        else
            throw new UnexpectedError(
                'Catalog can not be replaced. Try it again'
            )
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
