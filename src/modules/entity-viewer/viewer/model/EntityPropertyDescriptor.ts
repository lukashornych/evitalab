import { sortableStaticEntityProperties } from '@/modules/entity-viewer/viewer/workspace/data-grid'
import { EntityPropertyKey } from '@/modules/entity-viewer/viewer/workspace/EntityPropertyKey'

/**
 * Full description of a single entity property
 */
export class EntityPropertyDescriptor {
    readonly type: EntityPropertyType
    readonly key: EntityPropertyKey
    readonly title: string
    readonly flattenedTitle: string
    readonly parentSchema: any | undefined
    readonly schema: any | undefined
    readonly children: EntityPropertyDescriptor[]

    constructor(type: EntityPropertyType,
                key: EntityPropertyKey,
                title: string,
                flattenedTitle: string,
                parentSchema: any | undefined,
                schema: any | undefined,
                children: EntityPropertyDescriptor[]) {
        this.type = type
        this.key = key
        this.title = title
        this.flattenedTitle = flattenedTitle
        this.parentSchema = parentSchema
        this.schema = schema
        this.children = children
    }

    isSortable(): boolean {
        return sortableStaticEntityProperties.includes(this.key.toString()) || this.schema?.sortable || false
    }

    isLocalized(): boolean {
        return this.schema?.localized || false
    }
}
