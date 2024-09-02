<template>
    <VDialog v-model="visibleRestoreCatalog" class="w-25">
        <VCard>
            <VCardTitleWithActions>
                <template #default>
                    {{ t('backups.restoreDialog.title') }}
                </template>
            </VCardTitleWithActions>
            <VCardText>
                <VTextField :label="t('backups.restoreDialog.catalogName')" v-model="newCatalogName" />
                <VAlert
                    icon="mdi-information-outline"
                    type="info"
                    :text="t('backups.restoreDialog.infoAlert')"
                />
                <div class="mt-4 buttons">
                    <VBtn
                        :text="t('common.button.cancel')"
                        @click="close"
                    ></VBtn>
                    <VBtn variant="outlined" @click="restore">
                        <VIcon>mdi-cloud-upload-outline</VIcon>
                        {{ t('common.button.restore') }}
                    </VBtn>
                </div>
            </VCardText>
        </VCard>
    </VDialog>
</template>

<script setup lang="ts">
import VCardTitleWithActions from '@/modules/base/component/VCardTitleWithActions.vue'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t } = useI18n()

const visibleRestoreCatalog = ref<boolean>(true)
const newCatalogName = ref<string>('')

const emit = defineEmits<{
    (e: 'restore', newCatalogName: string): void
    (e: 'exit'): void
}>()

function close() {
    visibleRestoreCatalog.value = false
    emit('exit')
}

function restore(){
    emit('restore', newCatalogName.value)
}
</script>

<style scoped>
.buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>
