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
import { ConnectionService, useConnectionService } from '@/modules/connection/service/ConnectionService'
import { ref } from 'vue'
import { Immutable } from '@babel/types'
import { NamingConvention } from '@/modules/connection/model/NamingConvetion'

const workspaceService: WorkspaceService = useWorkspaceService()
const connectionService: ConnectionService = useConnectionService()
const schemaViewerTabFactory: SchemaViewerTabFactory = useSchemaViewerTabFactory()
const { t } = useI18n()

const props = defineProps<{
    dataPointer: SchemaViewerDataPointer,
    schema: ReferenceSchema
}>()

const properties: Property[] = []

const loadedEntityNameVarinats = ref<boolean>()
const entityNameVariants = ref<Immutable.Map<NamingConvention, string>>()

const loadedReferncedGroupyType = ref<boolean>()
const groupTypeNameVariants = ref<Immutable.Map<NamingConvention, string> | undefined>()

properties.push({
    name: t('schemaViewer.reference.label.description'),
    value: new PropertyValue(props.schema.description.getIfSupported()!)
})
properties.push({
    name: t('schemaViewer.reference.label.deprecationNotice'),
    value: new PropertyValue(props.schema.deprecationNotice.getIfSupported()!)
})
properties.push({
    name: t('schemaViewer.reference.label.cardinality'),
    value: new PropertyValue(new KeywordValue(props.schema.cardinality.getIfSupported()!))
})
if (props.schema.referencedEntityTypeManaged.getOrElse(false)) {
    properties.push({
        name: t('schemaViewer.reference.label.referencedEntity'),
        value: new PropertyValue(
            new KeywordValue(props.schema.entityType.getIfSupported()!),
            undefined,
            item => {
                workspaceService.createTab(schemaViewerTabFactory.createNew(
                    props.dataPointer.connection,
                    new EntitySchemaPointer(
                        props.dataPointer.schemaPointer.catalogName,
                        props.schema.entityType.getIfSupported()!
                    )
                ))
            }
        )
    })
} else {
    properties.push({
        name: t('schemaViewer.reference.label.referencedEntity'),
        value: new PropertyValue(new KeywordValue(props.schema.entityType.getIfSupported()!))
    })
}
properties.push({
    name: t('schemaViewer.reference.label.referencedEntityManaged'),
    value: new PropertyValue(props.schema.referencedEntityTypeManaged.getOrElse(false))
})
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
properties.push({
    name: t('schemaViewer.reference.label.referencedGroupManaged'),
    value: new PropertyValue(props.schema.referencedGroupTypeManaged.getOrElse(false) || false)
})
properties.push({
    name: t('schemaViewer.reference.label.indexed'),
    value: new PropertyValue(props.schema.indexed.getIfSupported())
})
properties.push({
    name: t('schemaViewer.reference.label.faceted'),
    value: new PropertyValue(props.schema.faceted.getIfSupported())
})

!props.schema.referencedEntityTypeManaged.getOrThrow() ?
    localEntityTypeNameVariants() :
    getEntityTypeNameVariants().then(() => loadedEntityNameVarinats.value = true)

!props.schema.referencedGroupTypeManaged.getOrThrow() ?
    localReferenceGroupType() :
    getGroupTypeNameVariants().then(() => loadedReferncedGroupyType.value = true)

function localReferenceGroupType() {
    groupTypeNameVariants.value = props.schema.groupTypeNameVariants.getOrThrow()
    loadedReferncedGroupyType.value = true
}

function localEntityTypeNameVariants() {
    entityNameVariants.value = props.schema.entityTypeNameVariants.getOrThrow()
    loadedEntityNameVarinats.value = true
}

async function getEntityTypeNameVariants() {
    const entitySchema = await connectionService.getEntitySchema(props.dataPointer.connection, props.dataPointer.schemaPointer.catalogName, props.schema.entityType.getOrThrow())
    entityNameVariants.value = entitySchema.nameVariants.getOrThrow()
}

async function getGroupTypeNameVariants() {
    const groupType = await connectionService.getEntitySchema(props.dataPointer.connection, props.dataPointer.schemaPointer.catalogName, props.schema.referencedGroupType.getOrThrow()!)
    groupTypeNameVariants.value = groupType.nameVariants.getOrThrow()
}

function isGroupType(): boolean {
    return (props.schema.referencedGroupType.isSupported() && props.schema.referencedGroupType.getIfSupported() != undefined)
}
</script>

<template>
    <SchemaContainer :properties="properties">
        <template #nested-details>
            <NameVariants :name-variants="schema.nameVariants.getIfSupported()!" />

            <NameVariants
                :prefix="t('schemaViewer.reference.label.referencedEntityNameVariants')"
                v-if="loadedEntityNameVarinats && entityNameVariants"
                :name-variants="entityNameVariants"
            />

            <NameVariants
                v-if="isGroupType() && loadedReferncedGroupyType && groupTypeNameVariants"
                :prefix="t('schemaViewer.reference.label.referencedGroupNameVariants')"
                :name-variants="groupTypeNameVariants"
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
