<script setup lang="ts">
const props = defineProps<{
    selectedDataLocale: string | undefined,
    dataLocales: string[]
}>()
const emit = defineEmits<{
    (e: 'update:selectedDataLocale', value: string | undefined): void
}>()

function handleDataLocaleSelect(selected: string[]) {
    if (selected.length > 0) {
        const dataLocale: string = selected[0]
        if (dataLocale === 'none') {
            emit('update:selectedDataLocale', undefined)
        } else {
            emit('update:selectedDataLocale', dataLocale)
        }
    } else {
        emit('update:selectedDataLocale', undefined)
    }
}
</script>

<template>
    <VBtn
        icon
        density="comfortable"
    >
        <VIcon v-if="!selectedDataLocale">mdi-translate-off</VIcon>
        <VIcon v-else>mdi-translate</VIcon>

        <VTooltip activator="parent">
            Select data locale
        </VTooltip>

        <VMenu activator="parent">
            <VList
                :selected="[selectedDataLocale ? selectedDataLocale : 'none']"
                density="compact"
                min-width="100"
                @update:selected="handleDataLocaleSelect"
            >
                <VListItem
                    value="none"
                >
                    <VListItemTitle>None</VListItemTitle>
                </VListItem>

                <VDivider class="mt-2 mb-2" />

                <VListItem
                    v-for="locale in dataLocales"
                    :key="locale"
                    :value="locale"
                >
                    <VListItemTitle>{{ locale }}</VListItemTitle>
                </VListItem>
            </VList>
        </VMenu>
    </VBtn>
</template>

<style lang="scss" scoped>

</style>
