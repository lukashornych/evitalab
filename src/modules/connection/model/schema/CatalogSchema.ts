import { Schema } from '@/modules/connection/model/schema/Schema'
import { List as ImmutableList, Map as ImmutableMap } from 'immutable'
import { NamingConvention } from '../NamingConvetion'
import { GlobalAttributeSchema } from '@/modules/connection/model/schema/GlobalAttributeSchema'
import { EntitySchema } from '@/modules/connection/model/schema/EntitySchema'
import { Value } from '@/modules/connection/model/Value'
import { AbstractSchema } from '@/modules/connection/model/schema/AbstractSchema'

/**
 * evitaLab's representation of a single evitaDB catalog schema independent of specific evitaDB version
 */
export class CatalogSchema extends AbstractSchema {

    readonly version: Value<number>
    /**
     * This is a mandatory value, it cannot be omitted.
     */
    readonly name: string
    readonly nameVariants: Value<ImmutableMap<NamingConvention, string>>
    readonly description: Value<string | null>

    readonly attributes: Value<ImmutableMap<string, GlobalAttributeSchema>>
    readonly entitySchemas: Value<ImmutableMap<string, EntitySchema>>

    private readonly representativeFlags: ImmutableList<string> = ImmutableList()

    constructor(version: Value<number>,
                name: string,
                nameVariants: Value<Map<NamingConvention, string>>,
                description: Value<string | null>,
                attributes: Value<GlobalAttributeSchema[]>,
                entitySchemas: Value<EntitySchema[]>) {
        super()
        this.version = version
        this.name = name
        this.nameVariants = nameVariants.map(it => ImmutableMap(it))
        this.description = description
        this.attributes = attributes.map(it =>
            ImmutableMap(it.map(attribute => [attribute.name, attribute])))
        this.entitySchemas = entitySchemas.map(it =>
            ImmutableMap(it.map(entitySchema => [entitySchema.name, entitySchema])))
    }

    getRepresentativeFlags(): ImmutableList<string> {
        return this.representativeFlags
    }
}
