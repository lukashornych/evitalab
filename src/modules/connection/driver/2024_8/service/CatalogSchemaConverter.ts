import {
    AssociatedDataSchema as DriverAssociatedDataSchema,
    AssociatedDataSchemas as DriverAssociatedDataSchemas,
    AttributeElement as DriverAttributeElement,
    AttributeSchemas as DriverAttributeSchemas,
    AttributeSchemaUnion as DriverAttributeSchemaUnion,
    AttributeUniquenessType as DriverAttributeUniquenessType,
    Cardinality as DriverCardinality,
    CatalogSchema as DriverCatalogSchema,
    EntitySchema as DriverEntitySchema,
    EntitySchemas as DriverEntitySchemas,
    GlobalAttributeSchema as DriverGlobalAttributeSchema,
    GlobalAttributeSchemas as DriverGlobalAttributeSchemas,
    GlobalAttributeUniquenessType as DriverGlobalAttributeUniquenessType,
    OrderBehaviour as DriverOrderBehaviour,
    OrderDirection as DriverOrderDirection,
    ReferenceSchema as DriverReferenceSchema,
    ReferenceSchemas as DriverReferenceSchemas,
    SortableAttributeCompoundSchema as DriverSortableAttributeCompoundSchema,
    SortableAttributeCompoundSchemas as DriverSortableAttributeCompoundSchemas
} from '../model/model'
import { CatalogSchema } from '@/modules/connection/model/schema/CatalogSchema'
import { Value } from '@/modules/connection/model/Value'
import { NamingConvention } from '@/modules/connection/model/NamingConvetion'
import { GlobalAttributeSchema } from '@/modules/connection/model/schema/GlobalAttributeSchema'
import { EntitySchema } from '@/modules/connection/model/schema/EntitySchema'
import { GlobalAttributeUniquenessType } from '@/modules/connection/model/schema/GlobalAttributeUniquenessType'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { AttributeUniquenessType } from '@/modules/connection/model/schema/AttributeUniquenessType'
import { EvolutionMode } from '@/modules/connection/model/schema/EvolutionMode'
import { EntityAttributeSchema } from '@/modules/connection/model/schema/EntityAttributeSchema'
import { AttributeSchema } from '@/modules/connection/model/schema/AttributeSchema'
import {
    AttributeElement,
    SortableAttributeCompoundSchema
} from '@/modules/connection/model/schema/SortableAttributeCompoundSchema'
import { OrderBehaviour } from '@/modules/connection/model/schema/OrderBehaviour'
import { OrderDirection } from '@/modules/connection/model/schema/OrderDirection'
import { AssociatedDataSchema } from '@/modules/connection/model/schema/AssociatedDataSchema'
import { ReferenceSchema } from '@/modules/connection/model/schema/ReferenceSchema'
import { Cardinality } from '@/modules/connection/model/schema/Cardinality'
import { Converter } from '@/modules/connection/driver/2024_8/service/Converter'
import { Scalar } from '@/modules/connection/model/data-type/Scalar'

/**
 * Converts driver's representation of catalog schema into evitaLab's representation of catalog schema
 */
export class CatalogSchemaConverter implements Converter<DriverCatalogSchema, CatalogSchema> {

    /**
     * Converts driver's representation of catalog schema into evitaLab's representation of catalog schema
     */
    convert(driverCatalogSchema: DriverCatalogSchema): CatalogSchema {
        return new CatalogSchema(
            Value.of(driverCatalogSchema.version),
            driverCatalogSchema.name,
            Value.of(new Map([
                [NamingConvention.CamelCase, driverCatalogSchema.nameVariants.camelCase],
                [NamingConvention.PascalCase, driverCatalogSchema.nameVariants.pascalCase],
                [NamingConvention.SnakeCase, driverCatalogSchema.nameVariants.snakeCase],
                [NamingConvention.UpperSnakeCase, driverCatalogSchema.nameVariants.upperSnakeCase],
                [NamingConvention.KebabCase, driverCatalogSchema.nameVariants.kebabCase]
            ])),
            Value.of(driverCatalogSchema.description || null),
            Value.of(this.convertGlobalAttributeSchemas(driverCatalogSchema.attributes)),
            Value.of(this.convertEntitySchemas(driverCatalogSchema.entitySchemas))
        )
    }

    private convertGlobalAttributeSchemas(driverAttributeSchemas: DriverGlobalAttributeSchemas): GlobalAttributeSchema[] {
        const globalAttributeSchemas: GlobalAttributeSchema[] = []
        for (const attributeName in driverAttributeSchemas) {
            const driverGlobalAttributeSchema: DriverGlobalAttributeSchema = driverAttributeSchemas[attributeName]
            globalAttributeSchemas.push(this.convertAttributeSchema(driverGlobalAttributeSchema) as GlobalAttributeSchema)
        }
        return globalAttributeSchemas
    }

    private convertEntitySchemas(driverEntitySchemas: DriverEntitySchemas): EntitySchema[] {
        const entitySchemas: EntitySchema[] = []
        for (const entityType in driverEntitySchemas) {
            const driverEntitySchema: DriverEntitySchema = driverEntitySchemas[entityType]
            entitySchemas.push(this.convertEntitySchema(driverEntitySchema))
        }
        return entitySchemas
    }

    private convertEntitySchema(driverEntitySchema: DriverEntitySchema): EntitySchema {
        return new EntitySchema(
            Value.of(driverEntitySchema.version),
            driverEntitySchema.name,
            Value.of(new Map([
                [NamingConvention.CamelCase, driverEntitySchema.nameVariants.camelCase],
                [NamingConvention.PascalCase, driverEntitySchema.nameVariants.pascalCase],
                [NamingConvention.SnakeCase, driverEntitySchema.nameVariants.snakeCase],
                [NamingConvention.UpperSnakeCase, driverEntitySchema.nameVariants.upperSnakeCase],
                [NamingConvention.KebabCase, driverEntitySchema.nameVariants.kebabCase]
            ])),
            Value.of(driverEntitySchema.description || null),
            Value.of(driverEntitySchema.deprecationNotice || null),
            Value.of(driverEntitySchema.withGeneratedPrimaryKey),
            Value.of(driverEntitySchema.withHierarchy),
            Value.of(driverEntitySchema.withPrice),
            Value.of(driverEntitySchema.indexedPricePlaces),
            Value.of(driverEntitySchema.locales),
            Value.of(driverEntitySchema.currencies),
            Value.of(this.convertEvolutionModes(driverEntitySchema.evolutionMode)),
            Value.of(this.convertEntityAttributeSchemas(driverEntitySchema.attributes)),
            Value.of(this.convertSortableAttributeCompoundSchemas(driverEntitySchema.sortableAttributeCompounds)),
            Value.of(this.convertAssociatedDataSchemas(driverEntitySchema.associatedData)),
            Value.of(this.convertReferenceSchemas(driverEntitySchema.references))
        )
    }

    private convertEntityAttributeSchemas(driverEntityAttributeSchemas: DriverAttributeSchemas): EntityAttributeSchema[] {
        const entityAttributesSchemas: EntityAttributeSchema[] = []
        for (const attributeName in driverEntityAttributeSchemas) {
            const driverEntityAttributeSchema: DriverAttributeSchemaUnion = driverEntityAttributeSchemas[attributeName]
            entityAttributesSchemas.push(this.convertAttributeSchema(driverEntityAttributeSchema) as EntityAttributeSchema)
        }
        return entityAttributesSchemas
    }

    private convertAttributeSchema(driverAttributeSchemaUnion: DriverAttributeSchemaUnion): AttributeSchema {
        const globalAttribute = 'globalUniquenessType' in driverAttributeSchemaUnion
        const entityAttribute = 'representative' in driverAttributeSchemaUnion

        const name: string = driverAttributeSchemaUnion.name
        const nameVariants: Value<Map<NamingConvention, string>> = Value.of(new Map([
            [NamingConvention.CamelCase, driverAttributeSchemaUnion.nameVariants.camelCase],
            [NamingConvention.PascalCase, driverAttributeSchemaUnion.nameVariants.pascalCase],
            [NamingConvention.SnakeCase, driverAttributeSchemaUnion.nameVariants.snakeCase],
            [NamingConvention.UpperSnakeCase, driverAttributeSchemaUnion.nameVariants.upperSnakeCase],
            [NamingConvention.KebabCase, driverAttributeSchemaUnion.nameVariants.kebabCase]
        ]))
        const description: Value<string | null> = Value.of(driverAttributeSchemaUnion.description || null)
        const deprecationNotice: Value<string | null> = Value.of(driverAttributeSchemaUnion.deprecationNotice || null)
        const type: Value<Scalar> = Value.of(driverAttributeSchemaUnion.type as Scalar)
        const uniquenessType: Value<AttributeUniquenessType> = Value.of(this.convertAttributeUniquenessType(driverAttributeSchemaUnion.uniquenessType))
        const filterable: Value<boolean> = Value.of(driverAttributeSchemaUnion.filterable)
        const sortable: Value<boolean> = Value.of(driverAttributeSchemaUnion.sortable)
        const nullable: Value<boolean> = Value.of(driverAttributeSchemaUnion.nullable)
        const defaultValue: Value<any | any[] | null> = Value.of(driverAttributeSchemaUnion.defaultValue || null)
        const localized: Value<boolean> = Value.of(driverAttributeSchemaUnion.localized)
        const indexedDecimalPlaces: Value<number> = Value.of(driverAttributeSchemaUnion.indexedDecimalPlaces)

        if (globalAttribute || entityAttribute) {
            const representative: Value<any> = Value.of(driverAttributeSchemaUnion.representative)
            if (globalAttribute) {
                const globalUniquenessType: Value<GlobalAttributeUniquenessType> = Value.of(this.convertGlobalAttributeUniquenessType(driverAttributeSchemaUnion.globalUniquenessType))
                return new GlobalAttributeSchema(name, nameVariants, description, deprecationNotice, type, uniquenessType, filterable, sortable, nullable, defaultValue, localized, indexedDecimalPlaces, representative, globalUniquenessType)
            } else {
                return new EntityAttributeSchema(name, nameVariants, description, deprecationNotice, type, uniquenessType, filterable, sortable, nullable, defaultValue, localized, indexedDecimalPlaces, representative)
            }
        } else {
            return new AttributeSchema(name, nameVariants, description, deprecationNotice, type, uniquenessType, filterable, sortable, nullable, defaultValue, localized, indexedDecimalPlaces)
        }
    }

    private convertSortableAttributeCompoundSchemas(driverSortableAttributeCompoundSchemas: DriverSortableAttributeCompoundSchemas): SortableAttributeCompoundSchema[] {
        const sortableAttributeSchemas: SortableAttributeCompoundSchema[] = []
        for (const compoundName in driverSortableAttributeCompoundSchemas) {
            const driverSortableAttributeCompoundSchema: DriverSortableAttributeCompoundSchema = driverSortableAttributeCompoundSchemas[compoundName]
            sortableAttributeSchemas.push(this.convertSortableAttributeCompoundSchema(driverSortableAttributeCompoundSchema))
        }
        return sortableAttributeSchemas
    }

    private convertSortableAttributeCompoundSchema(driverSortableAttributeCompoundSchema: DriverSortableAttributeCompoundSchema): SortableAttributeCompoundSchema {
        return new SortableAttributeCompoundSchema(
            driverSortableAttributeCompoundSchema.name,
            Value.of(new Map([
                [NamingConvention.CamelCase, driverSortableAttributeCompoundSchema.nameVariants.camelCase],
                [NamingConvention.PascalCase, driverSortableAttributeCompoundSchema.nameVariants.pascalCase],
                [NamingConvention.SnakeCase, driverSortableAttributeCompoundSchema.nameVariants.snakeCase],
                [NamingConvention.UpperSnakeCase, driverSortableAttributeCompoundSchema.nameVariants.upperSnakeCase],
                [NamingConvention.KebabCase, driverSortableAttributeCompoundSchema.nameVariants.kebabCase]
            ])),
            Value.of(driverSortableAttributeCompoundSchema.description || null),
            Value.of(driverSortableAttributeCompoundSchema.deprecationNotice || null),
            Value.of(this.convertAttributeElements(driverSortableAttributeCompoundSchema.attributeElements))
        )
    }

    private convertAttributeElements(driverAttributeElements: DriverAttributeElement[]): AttributeElement[] {
        return driverAttributeElements.map(it => this.convertAttributeElement(it))
    }

    private convertAttributeElement(driverAttributeElement: DriverAttributeElement): AttributeElement {
        return new AttributeElement(
            Value.of(driverAttributeElement.attributeName),
            Value.of(this.convertOrderBehaviour(driverAttributeElement.behaviour)),
            Value.of(this.convertOrderDirection(driverAttributeElement.direction))
        )
    }

    private convertAssociatedDataSchemas(driverAssociatedDataSchemas: DriverAssociatedDataSchemas): AssociatedDataSchema[] {
        const associatedDataSchemas: AssociatedDataSchema[] = []
        for (const associatedDataName in driverAssociatedDataSchemas) {
            const driverAssociatedDataSchema: DriverAssociatedDataSchema = driverAssociatedDataSchemas[associatedDataName]
            associatedDataSchemas.push(this.convertAssociatedDataSchema(driverAssociatedDataSchema))
        }
        return associatedDataSchemas
    }

    private convertAssociatedDataSchema(driverAssociatedDataSchema: DriverAssociatedDataSchema): AssociatedDataSchema {
        return new AssociatedDataSchema(
            driverAssociatedDataSchema.name,
            Value.of(new Map([
                [NamingConvention.CamelCase, driverAssociatedDataSchema.nameVariants.camelCase],
                [NamingConvention.PascalCase, driverAssociatedDataSchema.nameVariants.pascalCase],
                [NamingConvention.SnakeCase, driverAssociatedDataSchema.nameVariants.snakeCase],
                [NamingConvention.UpperSnakeCase, driverAssociatedDataSchema.nameVariants.upperSnakeCase],
                [NamingConvention.KebabCase, driverAssociatedDataSchema.nameVariants.kebabCase]
            ])),
            Value.of(driverAssociatedDataSchema.description || null),
            Value.of(driverAssociatedDataSchema.deprecationNotice || null),
            Value.of(driverAssociatedDataSchema.type as Scalar),
            Value.of(driverAssociatedDataSchema.nullable),
            Value.of(driverAssociatedDataSchema.localized)
        )
    }

    private convertReferenceSchemas(driverReferenceSchemas: DriverReferenceSchemas): ReferenceSchema[] {
        const referenceSchemas: ReferenceSchema[] = []
        for (const referenceName in driverReferenceSchemas) {
            const driverReferenceSchema: DriverReferenceSchema = driverReferenceSchemas[referenceName]
            referenceSchemas.push(this.convertReferenceSchema(driverReferenceSchema))
        }
        return referenceSchemas
    }

    private convertReferenceSchema(driverReferenceSchema: DriverReferenceSchema): ReferenceSchema {
        return new ReferenceSchema(
            driverReferenceSchema.name,
            Value.of(new Map([
                [NamingConvention.CamelCase, driverReferenceSchema.nameVariants.camelCase],
                [NamingConvention.PascalCase, driverReferenceSchema.nameVariants.pascalCase],
                [NamingConvention.SnakeCase, driverReferenceSchema.nameVariants.snakeCase],
                [NamingConvention.UpperSnakeCase, driverReferenceSchema.nameVariants.upperSnakeCase],
                [NamingConvention.KebabCase, driverReferenceSchema.nameVariants.kebabCase]
            ])),
            Value.of(driverReferenceSchema.description || null),
            Value.of(driverReferenceSchema.deprecationNotice || null),
            Value.of(driverReferenceSchema.referencedEntityType),
            Value.of(driverReferenceSchema.referencedEntityTypeManaged),
            Value.of(new Map([
                [NamingConvention.CamelCase, driverReferenceSchema.entityTypeNameVariants.camelCase],
                [NamingConvention.PascalCase, driverReferenceSchema.entityTypeNameVariants.pascalCase],
                [NamingConvention.SnakeCase, driverReferenceSchema.entityTypeNameVariants.snakeCase],
                [NamingConvention.UpperSnakeCase, driverReferenceSchema.entityTypeNameVariants.upperSnakeCase],
                [NamingConvention.KebabCase, driverReferenceSchema.entityTypeNameVariants.kebabCase]
            ])),
            Value.of(driverReferenceSchema.referencedGroupType || null),
            Value.of(driverReferenceSchema.referencedGroupTypeManaged || null),
            driverReferenceSchema.groupTypeNameVariants != undefined
                ? Value.of(new Map([
                    [NamingConvention.CamelCase, driverReferenceSchema.groupTypeNameVariants.camelCase],
                    [NamingConvention.PascalCase, driverReferenceSchema.groupTypeNameVariants.pascalCase],
                    [NamingConvention.SnakeCase, driverReferenceSchema.groupTypeNameVariants.snakeCase],
                    [NamingConvention.UpperSnakeCase, driverReferenceSchema.groupTypeNameVariants.upperSnakeCase],
                    [NamingConvention.KebabCase, driverReferenceSchema.groupTypeNameVariants.kebabCase]
                ]))
                : Value.of(null),
            Value.of(driverReferenceSchema.indexed),
            Value.of(driverReferenceSchema.faceted),
            Value.of(this.convertCardinality(driverReferenceSchema.cardinality)),
            Value.of(this.convertAttributeSchemas(driverReferenceSchema.attributes)),
            Value.of(this.convertSortableAttributeCompoundSchemas(driverReferenceSchema.sortableAttributeCompounds))
        )
    }

    private convertAttributeSchemas(driverAttributeSchemas: DriverAttributeSchemas): AttributeSchema[] {
        const attributesSchemas: AttributeSchema[] = []
        for (const attributeName in driverAttributeSchemas) {
            const driverAttributeSchema: DriverAttributeSchemaUnion = driverAttributeSchemas[attributeName]
            attributesSchemas.push(this.convertAttributeSchema(driverAttributeSchema) as AttributeSchema)
        }
        return attributesSchemas
    }

    private convertAttributeUniquenessType(driverAttributeUniquenessType: DriverAttributeUniquenessType): AttributeUniquenessType {
        switch (driverAttributeUniquenessType) {
            case DriverAttributeUniquenessType.NotUnique: return AttributeUniquenessType.NotUnique
            case DriverAttributeUniquenessType.UniqueWithinCollection: return AttributeUniquenessType.UniqueWithinCollection
            case DriverAttributeUniquenessType.UniqueWithinCollectionLocale: return AttributeUniquenessType.UniqueWithinCollectionLocale
            default: throw new UnexpectedError(`Unsupported attribute uniqueness type '${driverAttributeUniquenessType}'.`)
        }
    }

    private convertGlobalAttributeUniquenessType(driverGlobalAttributeUniquenessType: DriverGlobalAttributeUniquenessType): GlobalAttributeUniquenessType {
        switch (driverGlobalAttributeUniquenessType) {
            case DriverGlobalAttributeUniquenessType.NotUnique: return GlobalAttributeUniquenessType.NotUnique
            case DriverGlobalAttributeUniquenessType.UniqueWithinCatalog: return GlobalAttributeUniquenessType.UniqueWithinCatalog
            case DriverGlobalAttributeUniquenessType.UniqueWithinCatalogLocale: return GlobalAttributeUniquenessType.UniqueWithinCatalogLocale
            default: throw new UnexpectedError(`Unsupported global attribute uniqueness type '${driverGlobalAttributeUniquenessType}'.`)
        }
    }

    private convertEvolutionModes(driverEvolutionModes: string[]): EvolutionMode[] {
        return driverEvolutionModes.map(it => this.convertEvolutionMode(it))
    }

    private convertEvolutionMode(driverEvolutionMode: string): EvolutionMode {
        switch (driverEvolutionMode) {
            case 'ADAPT_PRIMARY_KEY_GENERATION': return EvolutionMode.AdaptPrimaryKeyGeneration
            case 'ADDING_ATTRIBUTES': return EvolutionMode.AddingAttributes
            case 'ADDING_ASSOCIATED_DATA': return EvolutionMode.AddingAssociatedData
            case 'ADDING_REFERENCES': return EvolutionMode.AddingReferences
            case 'ADDING_PRICES': return EvolutionMode.AddingPrices
            case 'ADDING_LOCALES': return EvolutionMode.AddingLocales
            case 'ADDING_CURRENCIES': return EvolutionMode.AddingCurrencies
            case 'ADDING_HIERARCHY': return EvolutionMode.AddingHierarchy
            default: throw new UnexpectedError(`Could not convert evolution mode '${driverEvolutionMode}'.`)
        }
    }

    private convertOrderBehaviour(driverOrderBehaviour: DriverOrderBehaviour): OrderBehaviour {
        switch (driverOrderBehaviour) {
            case DriverOrderBehaviour.NullsFirst: return OrderBehaviour.NullsFirst
            case DriverOrderBehaviour.NullsLast: return OrderBehaviour.NullsLast
            default: throw new UnexpectedError(`Unsupported order behaviour '${driverOrderBehaviour}'.`)
        }
    }

    private convertOrderDirection(driverOrderDirection: DriverOrderDirection): OrderDirection {
        switch (driverOrderDirection) {
            case DriverOrderDirection.Asc: return OrderDirection.Desc
            case DriverOrderDirection.Desc: return OrderDirection.Desc
            default: throw new UnexpectedError(`Unsupported order direction '${driverOrderDirection}'.`)
        }
    }

    private convertCardinality(driverCardinality: DriverCardinality): Cardinality {
        switch (driverCardinality) {
            case DriverCardinality.ExactlyOne: return Cardinality.ExactlyOne
            case DriverCardinality.OneOrMore: return Cardinality.OneOrMore
            case DriverCardinality.ZeroOrMore: return Cardinality.ZeroOrMore
            case DriverCardinality.ZeroOrOne: return Cardinality.ZeroOrOne
            default: throw new UnexpectedError(`Unsupported cardinality '${driverCardinality}'.`)
        }
    }
}
