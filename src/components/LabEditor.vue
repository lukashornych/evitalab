<script setup lang="ts">
// import LabWindowDataGrid from '@/components/LabWindowDataGrid.vue'

import { ref } from 'vue'

const currentTab = ref<number>(0)
</script>

<template>
    <VTabs
        v-model="currentTab"
    >
        <VTab
            density="compact"
            append-icon="mdi-close"
        >
            Product
        </VTab>
    </VTabs>

<!--    <LabWindowDataGrid-->
<!--        :connection="connections[0]"-->
<!--    />-->
</template>

<style scoped>

</style>
