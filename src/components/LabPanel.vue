<script setup lang="ts">
import { ref } from 'vue'
import { PanelType } from '@/model/lab'

const props = defineProps<{
    panel?: string
}>()

const emit = defineEmits<{
    (e: 'update:panel', value: string | null): void
}>()

const mainItems = ref([
    {
        title: 'Explorer',
        value: PanelType.Explorer,
        props: {
            prependIcon: 'mdi-compass'
        }
    }
])
const secondaryItems = ref([
    {
        title: 'Info',
        value: PanelType.Info,
        props: {
            prependIcon: 'mdi-information',
        }
    }
])

function selectPanel(item: any): void {
    if (!item.value) {
        emit('update:panel', null)
    } else {
        emit('update:panel', item.id)
    }
}

</script>

<template>
    <VNavigationDrawer
        permanent
        rail
    >
        <template #prepend>
            <div class="lab-logo">
                <!-- todo lho hp link into .env -->
                <a
                    href="https://github.com/lukashornych/evitalab"
                    target="_blank"
                >
                    <VAvatar size="24px">
                        <VImg
                            alt="evitaLab Logo"
                            src="/logo.png"
                        />
                    </VAvatar>
                </a>
            </div>
        </template>

        <VList
            density="compact"
            nav
            :items="mainItems"
            :selected="[panel]"
            @click:select="selectPanel"
        />

        <template #append>
            <VList
                density="compact"
                nav
                :items="secondaryItems"
            />
        </template>
    </VNavigationDrawer>
</template>

<style scoped>
.lab-logo {
    height: 3.5rem;
    display: grid;
    justify-items: center;
    align-items: center;
}
</style>
