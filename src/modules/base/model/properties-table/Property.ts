import { PropertyValue } from '@/modules/base/model/properties-table/PropertyValue'
import { List } from 'immutable'

/**
 * Single property of a table (row)
 */
export type Property = {
    /**
     * Name of the property
     */
    name: string
    /**
     * Value of the property
     */
    value: PropertyValue | List<PropertyValue>
}
