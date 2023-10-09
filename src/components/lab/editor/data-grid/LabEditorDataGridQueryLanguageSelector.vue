<script setup lang="ts">

import { QueryLanguage } from '@/model/lab'
import { computed } from 'vue'

const queryLanguages = [
    {
        title: 'EvitaQL',
        icon: 'mdi-application-braces-outline',
        value: QueryLanguage.EvitaQL
    },
    {
        title: 'GraphQL',
        icon: 'mdi-graphql',
        value: QueryLanguage.GraphQL
    }
]

const props = defineProps<{
    selected: QueryLanguage
}>()
const emit = defineEmits<{
    (e: 'update:selected', value: QueryLanguage): void
}>()

const selectedIcon = computed<string>(() => {
    const language = queryLanguages.find(language => language.value === props.selected)
    return language ? language.icon : 'mdi-application-braces-outline'
})
</script>

<template>
    <VBtn
        icon
        density="comfortable"
    >
        <VIcon>{{ selectedIcon }}</VIcon>
        <VTooltip activator="parent">Select query language</VTooltip>

        <VMenu activator="parent">
            <VList
                :selected="[selected]"
                density="compact"
                @update:selected="emit('update:selected', $event.length > 0 ? $event[0] as QueryLanguage : QueryLanguage.EvitaQL)"
            >
                <VListItem
                    v-for="language in queryLanguages"
                    :key="language.value"
                    :value="language.value"
                >
                    <template #prepend>
                        <VIcon>{{ language.icon }}</VIcon>
                    </template>
                    <VListItemTitle>{{ language.title }}</VListItemTitle>
                </VListItem>
            </VList>
        </VMenu>
    </VBtn>
</template>

<style lang="scss" scoped>

.v-btn {
    & :deep(.v-btn__overlay) {
        display: none;
    }
}
.v-btn::after {
    border-radius: 5px;
    border: 0;
    background: linear-gradient(to bottom, #8533C2 0%, #39B4DE 100%);
    z-index: -1;
}
.v-btn:hover::after,
.v-btn:focus::after {
    opacity: 1;
}
</style>
