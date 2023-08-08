<script setup lang="ts">
import { SchemaViewerProps } from '@/model/editor/schema-viewer'
import { ref } from 'vue'
import { SchemaViewerService, useSchemaViewerService } from '@/services/editor/schema-viewer.service'

const schemaViewerService: SchemaViewerService = useSchemaViewerService()

const props = defineProps<SchemaViewerProps>()

const schema = ref<any>()
schemaViewerService.getSchema(props.dataPointer).then(s => schema.value = s)
</script>

<template>
    <VToolbar density="compact">
        <VAppBarNavIcon
            icon="mdi-file-code"
            :disabled="true"
            style="opacity: 1"
        />

        <VToolbarTitle>
            <VBreadcrumbs
                :items="dataPointer.schemaPointer.path()"
                class="pl-0 pr-0"
            />
        </VToolbarTitle>
    </VToolbar>

    <VSheet class="pa-4">
        <component
            v-if="schema"
            :is="dataPointer.schemaPointer.component()"
            :data-pointer="dataPointer"
            :schema="schema"
        />
        <span v-else>
            Loading...
        </span>
    </VSheet>
</template>

<style lang="scss" scoped>

</style>
