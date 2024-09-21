<template>
    <VDialog v-model="visible" class="w-25">
        <VCard>
            <VCardTitleWithActions>

            </VCardTitleWithActions>
            <VCardText>

            </VCardText>
        </VCard>
    </VDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const visible = ref<boolean>(true)

</script>

<style scoped>

</style>
