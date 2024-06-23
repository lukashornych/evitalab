import { Schema } from '@/modules/connection/model/Schema'
import { Map as ImmutableMap, List as ImmutableList } from 'immutable'
import { NamingConvention } from './NamingConvetion'
import { GlobalAttributeSchema } from '@/modules/connection/model/GlobalAttributeSchema'
import { EntitySchema } from '@/modules/connection/model/EntitySchema'
import { Value } from '@/modules/connection/model/Value'

/**
 * evitaLab's representation of a single evitaDB catalog schema independent of specific evitaDB version
 */
export class CatalogSchema extends Schema {

    readonly version: Value<number>
    readonly name: Value<string>
    readonly nameVariants: Value<ImmutableMap<NamingConvention, string>>
    readonly description: Value<string | null>

    readonly attributes: Value<ImmutableMap<string, GlobalAttributeSchema>>
    readonly entitySchemas: Value<ImmutableMap<string, EntitySchema>>

    private readonly representativeFlags: ImmutableList<string> = ImmutableList()

    constructor(version: Value<number>,
                name: Value<string>,
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
            ImmutableMap(it.map(attribute => [attribute.name.get(), attribute])))
        this.entitySchemas = entitySchemas.map(it =>
            ImmutableMap(it.map(entitySchema => [entitySchema.name.get(), entitySchema])))
    }

    getRepresentativeFlags(): ImmutableList<string> {
        return this.representativeFlags
    }
}
