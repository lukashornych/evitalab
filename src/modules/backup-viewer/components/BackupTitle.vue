<script setup lang="ts">

import { ServerFile } from '@/modules/connection/model/server-file/ServerFile'
import { computed } from 'vue'
import { formatByteSize } from '@/utils/string'

const props = defineProps<{
    backupFile: ServerFile
}>()

const fileSize = computed<string>(() => {
    return formatByteSize(Number(props.backupFile.totalSizeInBytes))
})
</script>

<template>
    <span class="backup-title">
        <span>{{ backupFile.name }}</span>

        <!-- not using chip group because of https://github.com/vuetifyjs/vuetify/issues/19678 -->
        <span class="backup-title__chips">
            <VChip>
                {{ fileSize }}
            </VChip>
        </span>
    </span>
</template>

<style lang="scss" scoped>
.backup-title {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-flow: row wrap;
    max-height: 1.5rem;

    &__chips {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
}
</style>
