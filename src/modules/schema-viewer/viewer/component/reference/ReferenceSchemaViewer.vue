<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useWorkspaceService, WorkspaceService } from '@/modules/workspace/service/WorkspaceService'
import { SchemaViewerDataPointer } from '@/modules/schema-viewer/viewer/model/SchemaViewerDataPointer'
import { ReferenceSchema } from '@/modules/connection/model/schema/ReferenceSchema'
import { Property } from '@/modules/base/model/properties-table/Property'
import { PropertyValue } from '@/modules/base/model/properties-table/PropertyValue'
import { KeywordValue } from '@/modules/base/model/properties-table/KeywordValue'
import {
    SchemaViewerTabFactory,
    useSchemaViewerTabFactory
} from '@/modules/schema-viewer/viewer/workspace/service/SchemaViewerTabFactory'
import { EntitySchemaPointer } from '@/modules/schema-viewer/viewer/model/EntitySchemaPointer'
import SchemaContainer from '@/modules/schema-viewer/viewer/component/SchemaContainer.vue'
import NameVariants from '@/modules/schema-viewer/viewer/component/NameVariants.vue'
import AttributeSchemaList from '@/modules/schema-viewer/viewer/component/attribute/AttributeSchemaList.vue'
import { List } from 'immutable'

const workspaceService: WorkspaceService = useWorkspaceService()
const schemaViewerTabFactory: SchemaViewerTabFactory = useSchemaViewerTabFactory()
const { t } = useI18n()

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    schema: ReferenceSchema
}>()

const properties: Property[] = []
properties.push({ name: t('schemaViewer.reference.label.description'), value: new PropertyValue(props.schema.description.getIfSupported()!) })
properties.push({ name: t('schemaViewer.reference.label.deprecationNotice'), value: new PropertyValue(props.schema.deprecationNotice.getIfSupported()!) })
properties.push({ name: t('schemaViewer.reference.label.cardinality'), value: new PropertyValue(new KeywordValue(props.schema.cardinality.getIfSupported()!)) })
if (props.schema.referencedEntityTypeManaged.getOrElse(false)) {
    properties.push({
        name: t('schemaViewer.reference.label.referencedEntity'),
        value: new PropertyValue(
            new KeywordValue(props.schema.referencedEntityType.getIfSupported()!),
            undefined,
            item => {
                workspaceService.createTab(schemaViewerTabFactory.createNew(
                    props.dataPointer.connection,
                    new EntitySchemaPointer(
                        props.dataPointer.schemaPointer.catalogName,
                        props.schema.referencedEntityType.getIfSupported()!
                    )
                ))
            }
        ),
    })
} else {
    properties.push({
        name: t('schemaViewer.reference.label.referencedEntity'),
        value: new PropertyValue(new KeywordValue(props.schema.referencedEntityType.getIfSupported()!))
    })
}
properties.push({ name: t('schemaViewer.reference.label.referencedEntityManaged'), value: new PropertyValue(props.schema.referencedEntityTypeManaged.getOrElse(false)) })
if (props.schema.referencedGroupType.getIfSupported() == undefined) {
    properties.push({ name: t('schemaViewer.reference.label.referencedGroup'), value: new PropertyValue(undefined) })
} else if (props.schema.referencedGroupTypeManaged.getOrElse(false)) {
    properties.push({
        name: t('schemaViewer.reference.label.referencedGroup'),
        value: new PropertyValue(
            props.schema.referencedGroupType ? new KeywordValue(props.schema.referencedGroupType.getIfSupported()!) : undefined,
            undefined,
            item => {
                workspaceService.createTab(schemaViewerTabFactory.createNew(
                    props.dataPointer.connection,
                    new EntitySchemaPointer(
                        props.dataPointer.schemaPointer.catalogName,
                        props.schema.referencedGroupType.getIfSupported()! as string
                    )
                ))
            }
        )
    })
} else {
    properties.push({
        name: t('schemaViewer.reference.label.referencedGroup'),
        value: new PropertyValue(props.schema.referencedGroupType ? new KeywordValue(props.schema.referencedGroupType.getIfSupported()!) : undefined)
    })
}
properties.push({ name: t('schemaViewer.reference.label.referencedGroupManaged'), value: new PropertyValue(props.schema.referencedGroupTypeManaged.getOrElse(false) || false) })
properties.push({ name: t('schemaViewer.reference.label.indexed'), value: new PropertyValue(props.schema.indexed.getIfSupported()) })
properties.push({ name: t('schemaViewer.reference.label.faceted'), value: new PropertyValue(props.schema.faceted.getIfSupported()) })

</script>

<template>
    <SchemaContainer :properties="properties">
        <template #nested-details>
            <NameVariants :name-variants="schema.nameVariants.getIfSupported()!" />

            <NameVariants
                :prefix="t('schemaViewer.reference.label.referencedEntityNameVariants')"
                :name-variants="schema.entityTypeNameVariants.getIfSupported()!"
            />

            <NameVariants
                v-if="schema.referencedGroupType.isSupported() && schema.referencedGroupType.getIfSupported() != undefined && schema.groupTypeNameVariants.isSupported() && schema.groupTypeNameVariants.getIfSupported()"
                :prefix="t('schemaViewer.reference.label.referencedGroupNameVariants')"
                :name-variants="schema.groupTypeNameVariants.getIfSupported()!"
            />

            <AttributeSchemaList
                v-if="schema.attributes.isSupported() && schema.attributes.getIfSupported()!.size > 0"
                :data-pointer="dataPointer"
                :attributes="List(schema.attributes.getIfSupported()!.values())"
            />
        </template>
    </SchemaContainer>
</template>

<style lang="scss" scoped>

</style>
