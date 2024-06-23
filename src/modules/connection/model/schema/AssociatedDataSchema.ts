import { Map as ImmutableMap, List as ImmutableList } from 'immutable'
import { Schema } from '@/modules/connection/model/Schema'
import { NamingConvention } from './NamingConvetion';
import { Value } from '@/modules/connection/model/Value'

/**
 * evitaLab's representation of a single evitaDB associated data schema independent of specific evitaDB version
 */
export class AssociatedDataSchema extends Schema {

    /**
     * Contains unique name of the model. Case-sensitive. Distinguishes one model item from another within single entity instance.
     */
    readonly name: Value<string>
    /**
     * Contains name variants
     */
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
     * Data type of the associated data. Must be one of Evita-supported values. Internally the type is converted into Java-corresponding data type. The type may be scalar type or may represent complex object type (JSON).
     */
    readonly type: Value<string>
    /**
     * When associated data is nullable, its values may be missing in the entities. Otherwise, the system will enforce non-null checks upon upserting of the entity.
     */
    readonly nullable: Value<boolean>

    /**
     * Localized associated data has to be ALWAYS used in connection with specific `Locale`. In other words - it cannot be stored unless associated locale is also provided.
     */
    readonly localized: Value<boolean>

    private representativeFlags?: ImmutableList<string>

    constructor(name: Value<string>,
                nameVariants: Value<Map<NamingConvention, string>>,
                description: Value<string | null>,
                deprecationNotice: Value<string | null>,
                type: Value<string>,
                nullable: Value<boolean>,
                localized: Value<boolean>) {
        super()
        this.name = name
        this.nameVariants = nameVariants.map(it => ImmutableMap(it))
        this.description = description
        this.deprecationNotice = deprecationNotice
        this.type = type
        this.nullable = nullable
        this.localized = localized
    }

    getRepresentativeFlags(): ImmutableList<string> {
        if (this.representativeFlags == undefined) {
            const representativeFlags: string[] = []

            if (this.type.isSupported()) representativeFlags.push(this.formatDataTypeForFlag(this.type.get()))
            if (this.localized.getOrElse(false)) representativeFlags.push(AssociatedDataSchemaFlag.Localized)
            if (this.nullable.getOrElse(false)) representativeFlags.push(AssociatedDataSchemaFlag.Nullable)

            this.representativeFlags = ImmutableList(representativeFlags)
        }
        return this.representativeFlags
    }
}

/**
 * Supported representative flags for associated data schema
 */
export enum AssociatedDataSchemaFlag {
    Localized = '_associatedDataSchema.localized',
    Nullable = '_associatedDataSchema.nullable'
}
