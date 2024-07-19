<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { SchemaViewerDataPointer } from '@/modules/schema-viewer/viewer/model/SchemaViewerDataPointer'
import {
    SchemaViewerService,
    useSchemaViewerService,
} from '../../service/SchemaViewerService'
import { CatalogSchema } from '@/modules/connection/model/schema/CatalogSchema'
import { Property } from '@/modules/base/model/properties-table/Property'
import { PropertyValue } from '@/modules/base/model/properties-table/PropertyValue'
import SchemaContainer from '@/modules/schema-viewer/viewer/component/SchemaContainer.vue'
import NameVariants from '@/modules/schema-viewer/viewer/component/NameVariants.vue'
import AttributeSchemaList from '@/modules/schema-viewer/viewer/component/attribute/AttributeSchemaList.vue'
import EntitySchemaList from '@/modules/schema-viewer/viewer/component/entity/EntitySchemaList.vue'
import { List } from 'immutable'
import { Toaster, useToaster } from '@/modules/notification/service/Toaster'
import { EntitySchema } from '@/modules/connection/model/schema/EntitySchema'
import { Value } from '@/modules/connection/model/Value'
import { Immutable } from '@babel/types'

const { t } = useI18n()

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer
    schema: CatalogSchema
}>()

const catalogId = ref<string>()
const loaded = ref<boolean>(false)
const loadedSchemas = ref<boolean>(false)
const entitySchemas = ref<Value<Immutable.Map<string, EntitySchema>>>()

const toaster: Toaster = useToaster()
const schemaViewerService: SchemaViewerService = useSchemaViewerService()

schemaViewerService
    .getCatalog(props.dataPointer, props.schema.name)
    .then((x) => {
        catalogId.value = x.catalogId.getIfSupported()
        loaded.value = true
    })
    .catch((e) => toaster.error(e))

props.schema
    .entitySchemas()
    .then((x) => {
        entitySchemas.value = x
        loadedSchemas.value = true
    })
    .catch()

const baseProperties = ref<Property[]>([
    {
        name: t('schemaViewer.catalog.label.catalogId'),
        value: new PropertyValue(catalogId),
    },
    {
        name: t('schemaViewer.catalog.label.version'),
        value: new PropertyValue(props.schema.version.getIfSupported()),
    },
    {
        name: t('schemaViewer.catalog.label.description'),
        value: new PropertyValue(props.schema.description.getIfSupported()!),
    },
])
</script>

<template>
    <div v-if="loaded">
        <SchemaContainer :properties="baseProperties">
            <template #nested-details>
                <NameVariants
                    :name-variants="schema.nameVariants.getIfSupported()!"
                />

                <AttributeSchemaList
                    v-if="schema.attributes.isSupported() && schema.attributes.getIfSupported()!.size > 0"
                    :data-pointer="dataPointer"
                    :attributes="List(schema.attributes.getIfSupported()!.values())"
                />

                <div v-if="loadedSchemas">
                    <EntitySchemaList
                        v-if="entitySchemas?.getIfSupported() && entitySchemas.getIfSupported()!.size > 0"
                        :data-pointer="dataPointer"
                        :entities="List(entitySchemas.getIfSupported()!.values())"
                    />
                </div>
            </template>
        </SchemaContainer>
    </div>
</template>

<style lang="scss" scoped></style>
