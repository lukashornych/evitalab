import { QueryPriceMode } from '@/model/evitadb'
import { InjectionKey, Ref } from 'vue'
import { TabComponentProps } from '@/model/editor/tab/TabComponentProps'
import { EntityViewerTabParams } from '@/modules/entity-viewer/viewer/workspace/EntityViewerTabParams'
import { EntityViewerTabData } from '@/modules/entity-viewer/viewer/workspace/EntityViewerTabData'
import { EntityPropertyType } from '@/modules/entity-viewer/viewer/workspace/entity-property-type'
import { StaticEntityProperties } from '@/modules/entity-viewer/viewer/workspace/static-entity-properties'
import { EntityPropertyDescriptor } from '@/modules/entity-viewer/viewer/workspace/EntityPropertyDescriptor'
import { FlatEntity } from '@/modules/entity-viewer/viewer/workspace/FlatEntity'
import { QueryLanguage } from '@/model/QueryLanguage'

/**
 * Dependency injection key for data grid props
 */
export const gridPropsKey = Symbol('gridProps') as InjectionKey<TabComponentProps<EntityViewerTabParams, EntityViewerTabData>>
/**
 * Dependency injection key for index of available entity property descriptors
 */
export const entityPropertyDescriptorIndexKey = Symbol('entityPropertyDescriptorIndex') as InjectionKey<Ref<Map<string, EntityPropertyDescriptor>>>
/**
 * Dependency injection key for selected query language
 */
export const queryLanguageKey = Symbol('queryLanguage') as InjectionKey<Ref<QueryLanguage | undefined>>
/**
 * Dependency injection key for selected data locale
 */
export const dataLocaleKey = Symbol('dataLocale') as InjectionKey<Ref<string | undefined>>
/**
 * Dependency injection key for selected price type
 */
export const priceTypeKey = Symbol('priceType') as InjectionKey<Ref<QueryPriceMode | undefined>>
/**
 * Dependency injection key for used filter
 */
export const queryFilterKey = Symbol('queryFilter') as InjectionKey<Ref<string | undefined>>
/**
 * Dependency injection key for selected entity from the grid
 */
export const selectedEntityKey = Symbol('selectedEntity') as InjectionKey<FlatEntity>
/**
 * Dependency injection key for single entity property descriptor
 */
// todo we could have useEntityPropertyDescriptor() and provideEntityPropertyDescriptor() to avoid the need of this key
//  like it is done for services
//  also the mandatory/optional could be resolved here in single place and not in different components
//  also each key could have single file
export const entityPropertyDescriptorKey = Symbol('entityPropertyDescriptor') as InjectionKey<EntityPropertyDescriptor | undefined>

/**
 * Defines a parent property type for a given entity property type that cannot be used by itself without its parent.
 * Note: this is a workaround for the fact that we cannot define metadata for individual enum values.
 */
export const parentEntityPropertyType: Map<EntityPropertyType, EntityPropertyType> = new Map([
    [EntityPropertyType.ReferenceAttributes, EntityPropertyType.References]
])

/**
 * List of {@link StaticEntityProperties} that are sortable.
 */
export const sortableStaticEntityProperties: string[] = [StaticEntityProperties.PrimaryKey]

