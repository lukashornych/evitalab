import { Map as ImmutableMap, List as ImmutableList } from 'immutable'
import { NamingConvention } from './NamingConvetion';
import { OrderBehaviour } from '@/modules/connection/model/schema/OrderBehaviour'
import { OrderDirection } from '@/modules/connection/model/schema/OrderDirection'
import { Schema } from '@/modules/connection/model/schema/Schema'
import { Value } from '@/modules/connection/model/Value'

/**
 * evitaLab's representation of a single evitaDB sortable attribute compound schema schema independent of specific evitaDB version
 */
export class SortableAttributeCompoundSchema extends Schema {

    /**
     * Contains unique name of the model. Case-sensitive. Distinguishes one model item from another within single entity instance.
     */
    readonly name: Value<string>
    readonly nameVariants: Value<ImmutableMap<NamingConvention, string>>
    /**
     * Contains description of the model is optional but helps authors of the schema / client API to better explain the original purpose of the model to the consumers.
     */
    readonly description: Value<string | null>
    /**
     * Deprecation notice contains information about planned removal of this entity from the model / client API. This allows to plan and evolve the schema allowing clients to adapt early to planned breaking changes.  If notice is `null`, this schema is considered not deprecated.
     */
    readonly deprecationNotice: Value<string | null>
    /**
     * Collection of attribute elements that define the sortable compound. The order of the elements is important, as it defines the order of the sorting.
     */
    readonly attributeElements: Value<ImmutableList<AttributeElement>>

    private readonly representativeAttributes: ImmutableList<string> = ImmutableList()

    constructor(name: Value<string>,
                nameVariants: Value<Map<NamingConvention, string>>,
                description: Value<string | null>,
                deprecationNotice: Value<string | null>,
                attributeElements: Value<AttributeElement[]>) {
        super()
        this.name = name
        this.nameVariants = nameVariants.map(it => ImmutableMap(it))
        this.description = description
        this.deprecationNotice = deprecationNotice
        this.attributeElements = attributeElements.map(it => ImmutableList(it))
    }

    getRepresentativeFlags(): ImmutableList<string> {
        return this.representativeAttributes
    }
}

/**
 * Attribute element is a part of the sortable compound. It defines the attribute name, the direction of the
 * sorting and the behaviour of the null values. The attribute name refers to the existing attribute.
 */
export class AttributeElement {

    /**
     * Name of the existing attribute in the same schema.
     */
    readonly attributeName: Value<string>
    readonly behaviour: Value<OrderBehaviour>
    readonly direction: Value<OrderDirection>

    constructor(attributeName: Value<string>,
                behaviour: Value<OrderBehaviour>,
                direction: Value<OrderDirection>) {
        this.attributeName = attributeName
        this.behaviour = behaviour
        this.direction = direction
    }
}
