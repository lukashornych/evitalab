<script setup lang="ts">
import { computed, ref } from 'vue'
import {
    DataGridDataPointer,
    EntityPropertyDescriptor,
    EntityPropertyKey,
    EntityPropertyType,
    EntityPropertySectionSelection
} from '@/model/editor/data-grid'
import VClosableCardTitle from '@/components/base/VClosableCardTitle.vue'
import LabEditorDataGridPropertySelectorSection from './LabEditorDataGridPropertySelectorSection.vue'
import LabEditorDataGridPropertySelectorSectionAttributeItem from './LabEditorDataGridPropertySelectorSectionAttributeItem.vue'
import LabEditorDataGridPropertySelectorSectionAssociatedDataItem from './LabEditorDataGridPropertySelectorSectionAssociatedDataItem.vue'
import LabEditorDataGridPropertySelectorSectionEntityItem from './LabEditorDataGridPropertySelectorSectionEntityItem.vue'
import LabEditorDataGridPropertySelectorSectionReferenceItem from './LabEditorDataGridPropertySelectorSectionReferenceItem.vue'
import { Toaster, useToaster } from '@/services/editor/toaster'
import { UnexpectedError } from '@/model/lab'

const toaster: Toaster = useToaster()

const props = defineProps<{
    modelValue: boolean,
    selected: EntityPropertyKey[],
    dataPointer: DataGridDataPointer,
    properties: EntityPropertyDescriptor[],
}>()
const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'update:selected', value: EntityPropertyKey[]): void
    (e: 'schemaOpen'): void
}>()

const filter = ref<string>('')

/**
 * Index of all properties by property type
 */
const sectionedProperties = computed<Map<EntityPropertyType, EntityPropertyDescriptor[]>>(() => {
    const properties: Map<EntityPropertyType, EntityPropertyDescriptor[]> = new Map<EntityPropertyType, EntityPropertyDescriptor[]>()

    props.properties.forEach(property => {
        if (!properties.has(property.type)) {
            properties.set(property.type, [])
        }

        properties.get(property.type)?.push(property)
    })

    return properties
})
/**
 * Index of properties by property type matching the filter
 */
const filteredSectionedProperties = computed<Map<EntityPropertyType, EntityPropertyDescriptor[]>>(() => {
    const properties: Map<EntityPropertyType, EntityPropertyDescriptor[]> = new Map<EntityPropertyType, EntityPropertyDescriptor[]>()

    for (const [sectionType, sectionProperties] of sectionedProperties.value) {
        const filteredSectionProperties: EntityPropertyDescriptor[] = sectionProperties.filter(property => {
            return property.title.toLowerCase().includes(filter.value)
        })
        properties.set(sectionType, filteredSectionProperties)
    }

    return properties
})

/**
 * Index of selected properties by property type
 */
const sectionedSelected = computed<Map<EntityPropertyType, EntityPropertyKey[]>>(() => {
    const keys: Map<EntityPropertyType, EntityPropertyKey[]> = new Map<EntityPropertyType, EntityPropertyKey[]>()

    props.selected.forEach(key => {
        if (!keys.has(key.type)) {
            keys.set(key.type, [])
        }
        keys.get(key.type)?.push(key)
    })
    return keys
})
/**
 * Index of property section selection by property type
 */
const propertySectionSelections = computed<Map<EntityPropertyType, EntityPropertySectionSelection>>(() => {
    const selections: Map<EntityPropertyType, EntityPropertySectionSelection> = new Map<EntityPropertyType, EntityPropertySectionSelection>()

    for (const [sectionType, selectedKeys] of sectionedSelected.value) {
        let selection: EntityPropertySectionSelection
        if (selectedKeys.length === 0) {
            selection = EntityPropertySectionSelection.None
        } else if (selectedKeys.length === sectionedProperties.value.get(sectionType)?.length) {
            selection = EntityPropertySectionSelection.All
        } else {
            selection = EntityPropertySectionSelection.Some
        }
        selections.set(sectionType, selection)
    }

    return selections
})
const openedPropertySections = ref<EntityPropertyType[]>([])

function handleFilterUpdate(term: string): void {
    filter.value = term.toLowerCase()
    if (term.length === 0) {
        openedPropertySections.value = []
    } else {
        // automatically open sections that have any properties matching the filter
        const sectionsWithAnyProperties: EntityPropertyType[] = []
        if (filteredSectionedProperties.value.get(EntityPropertyType.Entity)?.length > 0) {
            sectionsWithAnyProperties.push(EntityPropertyType.Entity)
        }
        if (filteredSectionedProperties.value.get(EntityPropertyType.Attributes)?.length > 0) {
            sectionsWithAnyProperties.push(EntityPropertyType.Attributes)
        }
        if (filteredSectionedProperties.value.get(EntityPropertyType.AssociatedData)?.length > 0) {
            sectionsWithAnyProperties.push(EntityPropertyType.AssociatedData)
        }
        if (filteredSectionedProperties.value.get(EntityPropertyType.References)?.length > 0) {
            sectionsWithAnyProperties.push(EntityPropertyType.References)
        }
        openedPropertySections.value = sectionsWithAnyProperties
    }
}

/**
 * Either selects all properties in a single section or removes all properties in a single section from the selection.
 */
function togglePropertySectionSelection(sectionType: EntityPropertyType, newSelection: EntityPropertySectionSelection): void {
    if (newSelection === EntityPropertySectionSelection.None) {
        // remove all properties in passed section
        const newSelected: EntityPropertyKey[] = props.selected.filter(key => key.type !== sectionType)
        emit('update:selected', newSelected)
    } else if (newSelection === EntityPropertySectionSelection.All) {
        // remove all properties in passed section
        const sectionPropertyKeys: EntityPropertyKey[] = sectionedProperties.value.get(sectionType)?.map(property => property.key) || []
        // select all properties in passed section
        const newSelected: EntityPropertyKey[] = props.selected.filter(key => key.type !== sectionType)
        newSelected.push(...sectionPropertyKeys)

        emit('update:selected', newSelected)
    } else {
        toaster.error(new UnexpectedError(props.dataPointer.connection, 'Cannot select `Some` properties in a section.'))
    }
}

</script>

<template>
    <VDialog
        :model-value="modelValue"
        @update:model-value="emit('update:modelValue', $event)"
        max-width="60rem"
        scrollable
    >
        <VCard>
            <VClosableCardTitle @close="emit('update:modelValue', false)">
                Displayed properties
            </VClosableCardTitle>
            <VDivider />
            <VCardText class="selector-body">
                <VTextField
                    :model-value="filter"
                    label="Filter properties"
                    variant="solo-filled"
                    density="compact"
                    :append-inner-icon="filter ? 'mdi-backspace' : null as any"
                    @update:model-value="handleFilterUpdate($event)"
                    @click:append-inner="handleFilterUpdate('')"
                    class="filter-input"
                />
                <VList
                    :selected="selected"
                    @update:selected="emit('update:selected', $event)"
                    v-model:opened="openedPropertySections"
                    lines="two"
                    open-strategy="multiple"
                    select-strategy="classic"
                    class="property-list"
                >
                    <LabEditorDataGridPropertySelectorSection
                        title="Entity"
                        :property-type="EntityPropertyType.Entity"
                        :data-pointer="dataPointer"
                        :selected="sectionedSelected.get(EntityPropertyType.Entity) || []"
                        :filtered-properties="filteredSectionedProperties.get(EntityPropertyType.Entity) || []"
                        :properties="sectionedProperties.get(EntityPropertyType.Entity) || []"
                        :selection="propertySectionSelections.get(EntityPropertyType.Entity) || EntityPropertySectionSelection.None"
                        @toggle="togglePropertySectionSelection(EntityPropertyType.Entity, $event)"
                    >
                        <template #default="{ property }">
                            <LabEditorDataGridPropertySelectorSectionEntityItem
                                :data-pointer="dataPointer"
                                :property="property"
                                @schema-open="emit('schemaOpen')"
                            />
                        </template>
                    </LabEditorDataGridPropertySelectorSection>
                    <LabEditorDataGridPropertySelectorSection
                        title="Attributes"
                        :property-type="EntityPropertyType.Attributes"
                        :data-pointer="dataPointer"
                        :selected="sectionedSelected.get(EntityPropertyType.Attributes) || []"
                        :filtered-properties="filteredSectionedProperties.get(EntityPropertyType.Attributes) || []"
                        :properties="sectionedProperties.get(EntityPropertyType.Attributes) || []"
                        :selection="propertySectionSelections.get(EntityPropertyType.Attributes) || EntityPropertySectionSelection.None"
                        @toggle="togglePropertySectionSelection(EntityPropertyType.Attributes, $event)"
                    >
                        <template #default="{ property }">
                            <LabEditorDataGridPropertySelectorSectionAttributeItem
                                :data-pointer="dataPointer"
                                :property="property"
                                @schema-open="emit('schemaOpen')"
                            />
                        </template>
                    </LabEditorDataGridPropertySelectorSection>
                    <LabEditorDataGridPropertySelectorSection
                        title="Associated data"
                        :property-type="EntityPropertyType.AssociatedData"
                        :data-pointer="dataPointer"
                        :selected="sectionedSelected.get(EntityPropertyType.AssociatedData) || []"
                        :filtered-properties="filteredSectionedProperties.get(EntityPropertyType.AssociatedData) || []"
                        :properties="sectionedProperties.get(EntityPropertyType.AssociatedData) || []"
                        :selection="propertySectionSelections.get(EntityPropertyType.AssociatedData) || EntityPropertySectionSelection.None"
                        @toggle="togglePropertySectionSelection(EntityPropertyType.AssociatedData, $event)"
                    >
                        <template #default="{ property }">
                            <LabEditorDataGridPropertySelectorSectionAssociatedDataItem
                                :data-pointer="dataPointer"
                                :property="property"
                                @schema-open="emit('schemaOpen')"
                            />
                        </template>
                    </LabEditorDataGridPropertySelectorSection>
                    <LabEditorDataGridPropertySelectorSection
                        title="References"
                        :property-type="EntityPropertyType.References"
                        :data-pointer="dataPointer"
                        :selected="sectionedSelected.get(EntityPropertyType.References) || []"
                        :filtered-properties="filteredSectionedProperties.get(EntityPropertyType.References) || []"
                        :properties="sectionedProperties.get(EntityPropertyType.References) || []"
                        :selection="propertySectionSelections.get(EntityPropertyType.References) || EntityPropertySectionSelection.None"
                        @toggle="togglePropertySectionSelection(EntityPropertyType.References, $event)"
                    >
                        <template #default="{ property }">
                            <LabEditorDataGridPropertySelectorSectionReferenceItem
                                :data-pointer="dataPointer"
                                :property="property"
                                @schema-open="emit('schemaOpen')"
                            />
                        </template>
                    </LabEditorDataGridPropertySelectorSection>
                </VList>
            </VCardText>
        </VCard>
    </VDialog>
</template>

<style lang="scss" scoped>
.selector-body {
    position: relative;
}

.filter-input {
    position: fixed;
    z-index: 100;
    left: 1.5rem;
    right: 1.5rem;
}

.property-list {
    margin-top: 3.5rem;
}
</style>
