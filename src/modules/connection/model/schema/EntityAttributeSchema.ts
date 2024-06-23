import { AttributeSchema, AttributeSchemaFlag } from '@/modules/connection/model/schema/AttributeSchema'
import Immutable, { List as ImmutableList } from 'immutable'
import { AttributeUniquenessType } from '@/modules/connection/model/schema/AttributeUniquenessType'
import { NamingConvention } from './NamingConvetion'
import { Value } from '@/modules/connection/model/Value'

/**
 * evitaLab's representation of a single evitaDB entity attribute schema independent of specific evitaDB version
 */
export class EntityAttributeSchema extends AttributeSchema {

    /**
     * Whether this attribute can be used to represent an entire entity.
     */
    readonly representative: Value<boolean>

    constructor(name: Value<string>,
                nameVariants: Value<Map<NamingConvention, string>>,
                description: Value<string | null>,
                deprecationNotice: Value<string | null>,
                type: Value<string>,
                uniquenessType: Value<AttributeUniquenessType>,
                filterable: Value<boolean>,
                sortable: Value<boolean>,
                nullable: Value<boolean>,
                defaultValue: Value<any | any[] | null>,
                localized: Value<boolean>,
                indexedDecimalPlaces: Value<number>,
                representative: Value<boolean>) {
        super(name, nameVariants, description, deprecationNotice, type, uniquenessType, filterable, sortable, nullable, defaultValue, localized, indexedDecimalPlaces)
        this.representative = representative
    }

    getRepresentativeFlags(): Immutable.List<string> {
        if (this.representativeFlags == undefined) {
            const representativeFlags: string[] = []

            if (this.type.isSupported()) representativeFlags.push(this.formatDataTypeForFlag(this.type.get()))

            if (this.representative.getOrElse(false)) representativeFlags.push(EntityAttributeSchemaFlag.Representative)
            if (this.uniquenessType.isSupported()) {
                if (this.uniquenessType.get() === AttributeUniquenessType.UniqueWithinCollection) {
                    representativeFlags.push(AttributeSchemaFlag.Unique)
                } else if (this.uniquenessType.get() === AttributeUniquenessType.UniqueWithinCollectionLocale) {
                    representativeFlags.push(AttributeSchemaFlag.UniquePerLocale)
                }
            }

            if (this.uniquenessType.getOrElse(AttributeUniquenessType.NotUnique) != AttributeUniquenessType.NotUnique ||
                this.filterable.getOrElse(false))
                representativeFlags.push(AttributeSchemaFlag.Filterable)

            if (this.sortable.getOrElse(false)) representativeFlags.push(AttributeSchemaFlag.Sortable)
            if (this.localized.getOrElse(false)) representativeFlags.push(AttributeSchemaFlag.Localized)
            if (this.nullable.getOrElse(false)) representativeFlags.push(AttributeSchemaFlag.Nullable)

            this.representativeFlags = ImmutableList(representativeFlags)
        }
        return this.representativeFlags
    }
}

/**
 * Specific supported representative flags for entity attribute schema
 */
export enum EntityAttributeSchemaFlag {
    Representative = '_attributeSchema.representative'
}
