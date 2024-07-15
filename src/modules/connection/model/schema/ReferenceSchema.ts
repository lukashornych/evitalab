import { List as ImmutableList, Map as ImmutableMap } from 'immutable'
import { Schema } from '@/modules/connection/model/schema/Schema'
import { NamingConvention } from '../NamingConvetion'
import { Cardinality } from '@/modules/connection/model/schema/Cardinality'
import { AttributeSchema } from '@/modules/connection/model/schema/AttributeSchema'
import { SortableAttributeCompoundSchema } from '@/modules/connection/model/schema/SortableAttributeCompoundSchema'
import { Value } from '@/modules/connection/model/Value'
import { AbstractSchema } from '@/modules/connection/model/schema/AbstractSchema'

/**
 * evitaLab's representation of a single evitaDB reference schema independent of specific evitaDB version
 */
export class ReferenceSchema extends AbstractSchema {

    /**
     * Contains unique name of the model. Case-sensitive. Distinguishes one model item from another within single entity instance.
     * This is a mandatory value, it cannot be omitted.
     */
    readonly name: string
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
     * Reference to `Entity.type` of the referenced entity. Might be also any `String` that identifies type some external resource not maintained by Evita.
     */
    readonly referencedEntityType: Value<string>
    /**
     * Contains `true` if `entityType` refers to any existing entity that is maintained by Evita.
     */
    readonly referencedEntityTypeManaged: Value<boolean>
    readonly entityTypeNameVariants: Value<ImmutableMap<NamingConvention, string>>

    /**
     * Reference to `Entity.type` of the referenced entity. Might be also `String` that identifies type some external resource not maintained by Evita.
     */
    readonly referencedGroupType: Value<string | null>
    /**
     * Contains `true` if `groupType` refers to any existing entity that is maintained by Evita.
     */
    readonly referencedGroupTypeManaged: Value<boolean | null>
    readonly groupTypeNameVariants: Value<ImmutableMap<NamingConvention, string> | null>

    /**
     * Contains `true` if the index for this reference should be created and maintained allowing to filter by `reference_{reference name}_having` filtering constraints. Index is also required when reference is `faceted`.  Do not mark reference as faceted unless you know that you'll need to filter/sort entities by this reference. Each indexed reference occupies (memory/disk) space in the form of index. When reference is not indexed, the entity cannot be looked up by reference attributes or relation existence itself, but the data can be fetched.
     */
    readonly indexed: Value<boolean>
    /**
     * Contains `true` if the statistics data for this reference should be maintained and this allowing to get `facetStatistics` for this reference or use `facet_{reference name}_inSet` filtering constraint.  Do not mark reference as faceted unless you want it among `facetStatistics`. Each faceted reference occupies (memory/disk) space in the form of index.  Reference that was marked as faceted is called Facet.
     */
    readonly faceted: Value<boolean>
    readonly cardinality: Value<Cardinality>

    /**
     * Attributes related to reference allows defining set of data that are fetched in bulk along with the entity body. Attributes may be indexed for fast filtering (`AttributeSchema.filterable`) or can be used to sort along (`AttributeSchema.filterable`). Attributes are not automatically indexed in order not to waste precious memory space for data that will never be used in search queries.  Filtering in attributes is executed by using constraints like `and`, `not`, `attribute_{name}_equals`, `attribute_{name}_contains` and many others. Sorting can be achieved with `attribute_{name}_natural` or others.  Attributes are not recommended for bigger data as they are all loaded at once.
     */
    readonly attributes: Value<ImmutableMap<string, AttributeSchema>>
    /**
     * Contains definitions of all sortable attribute compounds defined in this schema.
     */
    readonly sortableAttributeCompounds: Value<ImmutableMap<string, SortableAttributeCompoundSchema>>

    private representativeFlags?: ImmutableList<string>

    constructor(name: string,
                nameVariants: Value<Map<NamingConvention, string>>,
                description: Value<string | null>,
                deprecationNotice: Value<string | null>,
                referencedEntityType: Value<string>,
                referencedEntityTypeManaged: Value<boolean>,
                entityTypeNameVariants: Value<Map<NamingConvention, string>>,
                referencedGroupType: Value<string | null>,
                referencedGroupTypeManaged: Value<boolean | null>,
                groupTypeNameVariants: Value<Map<NamingConvention, string> | null>,
                indexed: Value<boolean>,
                faceted: Value<boolean>,
                cardinality: Value<Cardinality>,
                attributes: Value<AttributeSchema[]>,
                sortableAttributeCompounds: Value<SortableAttributeCompoundSchema[]>) {
        super()
        this.name = name
        this.nameVariants = nameVariants.map(it => ImmutableMap(it))
        this.description = description
        this.deprecationNotice = deprecationNotice
        this.referencedEntityType = referencedEntityType
        this.referencedEntityTypeManaged = referencedEntityTypeManaged
        this.entityTypeNameVariants = entityTypeNameVariants.map(it => ImmutableMap(it))
        this.referencedGroupType = referencedGroupType
        this.referencedGroupTypeManaged = referencedGroupTypeManaged
        this.groupTypeNameVariants = groupTypeNameVariants.map(it => {
            if (it == null) {
                return null
            }
            return ImmutableMap(it)
        })
        this.indexed = indexed
        this.faceted = faceted
        this.cardinality = cardinality
        this.attributes = attributes.map(it =>
            ImmutableMap(it.map(attribute => [attribute.name, attribute])))
        this.sortableAttributeCompounds = sortableAttributeCompounds.map(it =>
            ImmutableMap(it.map(sac => [sac.name, sac])))
    }

    getRepresentativeFlags(): ImmutableList<string> {
        if (this.representativeFlags == null) {
            const representativeFlags: string[] = []

            if (!this.referencedEntityTypeManaged.getOrElse(false)) representativeFlags.push(ReferenceSchemaFlag.External)
            if (this.indexed.getOrElse(false)) representativeFlags.push(ReferenceSchemaFlag.Indexed)
            if (this.faceted.getOrElse(false)) representativeFlags.push(ReferenceSchemaFlag.Faceted)

            this.representativeFlags = ImmutableList(representativeFlags)
        }
        return this.representativeFlags
    }
}

/**
 * Supported representative flags for reference schema
 */
export enum ReferenceSchemaFlag {
    External = '_referenceSchema.external',
    Indexed = '_referenceSchema.indexed',
    Faceted = '_referenceSchema.faceted'
}
