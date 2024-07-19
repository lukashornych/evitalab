import {
    GrpcCatalogSchema,
    GrpcGlobalAttributeSchema,
} from '@/gen/GrpcCatalogSchema_pb'
import { CatalogSchema } from '@/modules/connection/model/schema/CatalogSchema'
import { Value } from '@/modules/connection/model/Value'
import { NamingConvention } from '@/modules/connection/model/NamingConvetion'
import { EntitySchema } from '@/modules/connection/model/schema/EntitySchema'
import { Map, List } from 'immutable'
import { GlobalAttributeSchema } from '@/modules/connection/model/schema/GlobalAttributeSchema'
import { AttributeSchema } from '@/modules/connection/model/schema/AttributeSchema'
import {
    GrpcAttributeUniquenessType,
    GrpcCardinality,
    GrpcEvitaDataType,
    GrpcEvolutionMode,
    GrpcGlobalAttributeUniquenessType,
    GrpcOrderBehaviour,
    GrpcOrderDirection,
} from '@/gen/GrpcEnums_pb'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { GlobalAttributeUniquenessType } from '@/modules/connection/model/schema/GlobalAttributeUniquenessType'
import { EntityAttributeSchema } from '@/modules/connection/model/schema/EntityAttributeSchema'
import { EvolutionMode } from '@/modules/connection/model/schema/EvolutionMode'
import { AttributeUniquenessType } from '@/modules/connection/model/schema/AttributeUniquenessType'
import { OrderBehaviour } from '@/modules/connection/model/schema/OrderBehaviour'
import { Cardinality } from '@/modules/connection/model/schema/Cardinality'
import { OrderDirection } from '@/modules/connection/model/schema/OrderDirection'
import { Scalar } from '@/modules/connection/model/data-type/Scalar'
import { GrpcAssociatedDataSchema, GrpcAttributeElement, GrpcAttributeSchema, GrpcEntitySchema, GrpcReferenceSchema, GrpcSortableAttributeCompoundSchema } from '@/gen/GrpcEntitySchema_pb'
import { GrpcCurrency, GrpcLocale } from '@/gen/GrpcEvitaDataTypes_pb'
import { ReferenceSchema } from '@/modules/connection/model/schema/ReferenceSchema'
import { AttributeElement, SortableAttributeCompoundSchema } from '@/modules/connection/model/schema/SortableAttributeCompoundSchema'
import { AssociatedDataSchema } from '@/modules/connection/model/schema/AssociatedDataSchema'

export class CatalogSchemaConverter {
    convert(
        driverModel: GrpcCatalogSchema,
        entitySchemaAccessor: (
            catalogName: string
        ) => Promise<Value<List<EntitySchema>>>
    ): CatalogSchema {
        return new CatalogSchema(
            Value.of(driverModel.version),
            driverModel.name,
            Value.of(
                Map([
                    [
                        NamingConvention.CamelCase,
                        this.protectUndefinedString(
                            driverModel.nameVariant.find(
                                (x) => x.namingConvention === 0
                            )?.name
                        ),
                    ],
                    [
                        NamingConvention.PascalCase,
                        this.protectUndefinedString(
                            driverModel.nameVariant.find(
                                (x) => x.namingConvention === 1
                            )?.name
                        ),
                    ],
                    [
                        NamingConvention.SnakeCase,
                        this.protectUndefinedString(
                            driverModel.nameVariant.find(
                                (x) => x.namingConvention === 2
                            )?.name
                        ),
                    ],
                    [
                        NamingConvention.UpperSnakeCase,
                        this.protectUndefinedString(
                            driverModel.nameVariant.find(
                                (x) => x.namingConvention === 3
                            )?.name
                        ),
                    ],
                    [
                        NamingConvention.KebabCase,
                        this.protectUndefinedString(
                            driverModel.nameVariant.find(
                                (x) => x.namingConvention === 4
                            )?.name
                        ),
                    ],
                ])
            ),
            Value.of(driverModel.description || null),
            Value.of(
                this.convertGlobalAttributeSchemas(driverModel.attributes)
            ),
            entitySchemaAccessor
        )
    }

    private protectUndefinedString(name: string | undefined): string {
        if (name == null) return ''
        return name
    }

    private convertGlobalAttributeSchemas(driverAttributeSchemas: {
        [key: string]: GrpcGlobalAttributeSchema
    }): GlobalAttributeSchema[] {
        const globalAttributeSchemas: GlobalAttributeSchema[] = []

        for (const attributeSchema in driverAttributeSchemas) {
            const schema: GrpcGlobalAttributeSchema =
                driverAttributeSchemas[attributeSchema]
            globalAttributeSchemas.push(
                this.convertAttributeSchema(schema) as GlobalAttributeSchema
            )
        }
        return globalAttributeSchemas
    }

    private convertAttributeSchema(
        driverAttributeSchemaUnion: GrpcGlobalAttributeSchema
    ): AttributeSchema {
        const globalAttribute =
            'globalUniquenessType' in driverAttributeSchemaUnion
        const entityAttribute = 'representative' in driverAttributeSchemaUnion

        const name: string = driverAttributeSchemaUnion.name
        const nameVariants: Value<Map<NamingConvention, string>> = Value.of(
            Map([
                [
                    NamingConvention.CamelCase,
                    this.protectUndefinedString(
                        driverAttributeSchemaUnion.nameVariant.find(
                            (x) => x.namingConvention === 0
                        )?.name
                    ),
                ],
                [
                    NamingConvention.PascalCase,
                    this.protectUndefinedString(
                        driverAttributeSchemaUnion.nameVariant.find(
                            (x) => x.namingConvention === 1
                        )?.name
                    ),
                ],
                [
                    NamingConvention.SnakeCase,
                    this.protectUndefinedString(
                        driverAttributeSchemaUnion.nameVariant.find(
                            (x) => x.namingConvention === 2
                        )?.name
                    ),
                ],
                [
                    NamingConvention.UpperSnakeCase,
                    this.protectUndefinedString(
                        driverAttributeSchemaUnion.nameVariant.find(
                            (x) => x.namingConvention === 3
                        )?.name
                    ),
                ],
                [
                    NamingConvention.KebabCase,
                    this.protectUndefinedString(
                        driverAttributeSchemaUnion.nameVariant.find(
                            (x) => x.namingConvention === 4
                        )?.name
                    ),
                ],
            ])
        )

        const description: Value<string | null> = Value.of(
            driverAttributeSchemaUnion.description === undefined
                ? null
                : driverAttributeSchemaUnion.description
        )
        const deprecationNotice: Value<string | null> = Value.of(
            driverAttributeSchemaUnion.deprecationNotice === undefined
                ? null
                : driverAttributeSchemaUnion.deprecationNotice
        )
        const type: Value<Scalar> = Value.of(
            this.convertScalar(driverAttributeSchemaUnion.type)
        )
        const uniquenessType: Value<AttributeUniquenessType> = Value.of(
            this.convertAttributeUniquenessType(
                driverAttributeSchemaUnion.unique
            )
        )
        const filterable: Value<boolean> = Value.of(
            driverAttributeSchemaUnion.filterable
        )
        const sortable: Value<boolean> = Value.of(
            driverAttributeSchemaUnion.sortable
        )
        const nullable: Value<boolean> = Value.of(
            driverAttributeSchemaUnion.nullable
        )
        const defaultValue: Value<any | any[] | null> = Value.of(
            driverAttributeSchemaUnion.defaultValue || null
        )
        const localized: Value<boolean> = Value.of(
            driverAttributeSchemaUnion.localized
        )
        const indexedDecimalPlaces: Value<number> = Value.of(
            driverAttributeSchemaUnion.indexedDecimalPlaces
        )

        if (globalAttribute || entityAttribute) {
            const representative: Value<any> = Value.of(
                driverAttributeSchemaUnion.representative
            )
            if (globalAttribute) {
                const uniqueGloballyType: Value<GlobalAttributeUniquenessType> =
                    Value.of(
                        this.convertGlobalAttributeUniquenessType(
                            driverAttributeSchemaUnion.uniqueGlobally
                        )
                    )
                return new GlobalAttributeSchema(
                    name,
                    nameVariants,
                    description,
                    deprecationNotice,
                    type,
                    uniquenessType,
                    filterable,
                    sortable,
                    nullable,
                    defaultValue,
                    localized,
                    indexedDecimalPlaces,
                    representative,
                    uniqueGloballyType
                )
            } else {
                return new EntityAttributeSchema(
                    name,
                    nameVariants,
                    description,
                    deprecationNotice,
                    type,
                    uniquenessType,
                    filterable,
                    sortable,
                    nullable,
                    defaultValue,
                    localized,
                    indexedDecimalPlaces,
                    representative
                )
            }
        } else {
            return new AttributeSchema(
                name,
                nameVariants,
                description,
                deprecationNotice,
                type,
                uniquenessType,
                filterable,
                sortable,
                nullable,
                defaultValue,
                localized,
                indexedDecimalPlaces
            )
        }
    }

    private convertAttributeUniquenessType(
        attributeUniquenessType: GrpcAttributeUniquenessType
    ): AttributeUniquenessType {
        switch (attributeUniquenessType) {
            case GrpcAttributeUniquenessType.NOT_UNIQUE:
                return AttributeUniquenessType.NotUnique
            case GrpcAttributeUniquenessType.UNIQUE_WITHIN_COLLECTION:
                return AttributeUniquenessType.UniqueWithinCollection
            case GrpcAttributeUniquenessType.UNIQUE_WITHIN_COLLECTION_LOCALE:
                return AttributeUniquenessType.UniqueWithinCollectionLocale
            default:
                throw new UnexpectedError(
                    `Unsupported attribute uniqueness type '${attributeUniquenessType}'.`
                )
        }
    }

    private convertGlobalAttributeUniquenessType(
        grpcGlobalAttributeUniquenessType: GrpcGlobalAttributeUniquenessType
    ): GlobalAttributeUniquenessType {
        switch (grpcGlobalAttributeUniquenessType) {
            case GrpcGlobalAttributeUniquenessType.NOT_GLOBALLY_UNIQUE:
                return GlobalAttributeUniquenessType.NotUnique
            case GrpcGlobalAttributeUniquenessType.UNIQUE_WITHIN_CATALOG:
                return GlobalAttributeUniquenessType.UniqueWithinCatalog
            case GrpcGlobalAttributeUniquenessType.UNIQUE_WITHIN_CATALOG_LOCALE:
                return GlobalAttributeUniquenessType.UniqueWithinCatalogLocale
            default:
                throw new UnexpectedError(
                    `Unsupported global attribute uniqueness type '${grpcGlobalAttributeUniquenessType}'.`
                )
        }
    }

    convertEntitySchema(driverEntitySchema: GrpcEntitySchema): EntitySchema {
        return new EntitySchema(
            Value.of(driverEntitySchema.version),
            driverEntitySchema.name,
            Value.of(
                Map([
                    [
                        NamingConvention.CamelCase,
                        this.protectUndefinedString(
                            driverEntitySchema.nameVariant.find(
                                (x) => x.namingConvention === 0
                            )?.name
                        ),
                    ],
                    [
                        NamingConvention.PascalCase,
                        this.protectUndefinedString(
                            driverEntitySchema.nameVariant.find(
                                (x) => x.namingConvention === 1
                            )?.name
                        ),
                    ],
                    [
                        NamingConvention.SnakeCase,
                        this.protectUndefinedString(
                            driverEntitySchema.nameVariant.find(
                                (x) => x.namingConvention === 2
                            )?.name
                        ),
                    ],
                    [
                        NamingConvention.UpperSnakeCase,
                        this.protectUndefinedString(
                            driverEntitySchema.nameVariant.find(
                                (x) => x.namingConvention === 3
                            )?.name
                        ),
                    ],
                    [
                        NamingConvention.KebabCase,
                        this.protectUndefinedString(
                            driverEntitySchema.nameVariant.find(
                                (x) => x.namingConvention === 4
                            )?.name
                        ),
                    ],
                ])
            ),
            Value.of(driverEntitySchema.description || null),
            Value.of(driverEntitySchema.deprecationNotice || null),
            Value.of(driverEntitySchema.withGeneratedPrimaryKey),
            Value.of(driverEntitySchema.withHierarchy),
            Value.of(driverEntitySchema.withPrice),
            Value.of(driverEntitySchema.indexedPricePlaces),
            Value.of(this.convertLocales(driverEntitySchema.locales)),
            Value.of(this.convertCurrency(driverEntitySchema.currencies)),
            Value.of(
                this.convertEvolutionMode(driverEntitySchema.evolutionMode)
            ),
            Value.of(
                this.convertEntityAttributeSchemas(
                    driverEntitySchema.attributes
                )
            ),
            Value.of(
                this.convertSortableAttributeCompoundSchemas(
                    driverEntitySchema.sortableAttributeCompounds
                )
            ),
            Value.of(
                this.convertAssociatedDataSchemas(
                    driverEntitySchema.associatedData
                )
            ),
            Value.of(
                this.convertReferenceSchemas(driverEntitySchema.references)
            )
        )
    }

    private convertSortableAttributeCompoundSchema(driverSortableAttributeCompoundSchema: GrpcSortableAttributeCompoundSchema): SortableAttributeCompoundSchema {
        return new SortableAttributeCompoundSchema(
            driverSortableAttributeCompoundSchema.name,
            Value.of(Map([
                [NamingConvention.CamelCase, this.protectUndefinedString(driverSortableAttributeCompoundSchema.nameVariant.find(x => x.namingConvention === 0)?.name)],
                [NamingConvention.PascalCase, this.protectUndefinedString(driverSortableAttributeCompoundSchema.nameVariant.find(x => x.namingConvention === 1)?.name)],
                [NamingConvention.SnakeCase, this.protectUndefinedString(driverSortableAttributeCompoundSchema.nameVariant.find(x => x.namingConvention === 2)?.name)],
                [NamingConvention.UpperSnakeCase, this.protectUndefinedString(driverSortableAttributeCompoundSchema.nameVariant.find(x => x.namingConvention === 3)?.name)],
                [NamingConvention.KebabCase, this.protectUndefinedString(driverSortableAttributeCompoundSchema.nameVariant.find(x => x.namingConvention === 4)?.name)]
            ])),
            Value.of(driverSortableAttributeCompoundSchema.description || null),
            Value.of(driverSortableAttributeCompoundSchema.deprecationNotice || null),
            Value.of(this.convertAttributeElements(driverSortableAttributeCompoundSchema.attributeElements))
        )
    }

    private convertAttributeElements(driverAttributeElements: GrpcAttributeElement[]): AttributeElement[] {
        return driverAttributeElements.map(it => this.convertAttributeElement(it))
    }


    private convertAttributeElement(driverAttributeElement: GrpcAttributeElement): AttributeElement {
        return new AttributeElement(
            Value.of(driverAttributeElement.attributeName),
            Value.of(this.convertOrderBehaviour(driverAttributeElement.behaviour)),
            Value.of(this.convertOrderDirection(driverAttributeElement.direction))
        )
    }

    private convertReferenceSchemas(driverReferenceSchemas: {[key: string]: GrpcReferenceSchema}): ReferenceSchema[] {
        const referenceSchemas: ReferenceSchema[] = []
        for (const referenceName in driverReferenceSchemas) {
            const driverReferenceSchema: GrpcReferenceSchema = driverReferenceSchemas[referenceName]
            referenceSchemas.push(this.convertReferenceSchema(driverReferenceSchema))
        }
        return referenceSchemas
    }

    private convertEntityAttributeSchemas(driverEntityAttributeSchemas: {[key: string]: GrpcAttributeSchema}): EntityAttributeSchema[] {
        const entityAttributesSchemas: EntityAttributeSchema[] = []
        for (const attributeName in driverEntityAttributeSchemas) {
            const driverEntityAttributeSchema: GrpcAttributeSchema = driverEntityAttributeSchemas[attributeName]
            entityAttributesSchemas.push(this.convertAttributeSchema(driverEntityAttributeSchema) as EntityAttributeSchema)
        }
        return entityAttributesSchemas
    }
    private convertReferenceSchema(driverReferenceSchema: GrpcReferenceSchema): ReferenceSchema {
        return new ReferenceSchema(
            driverReferenceSchema.name,
            Value.of(Map([
                [NamingConvention.CamelCase, this.protectUndefinedString(driverReferenceSchema.nameVariant.find(x => x.namingConvention === 0)?.name)],
                [NamingConvention.PascalCase, this.protectUndefinedString(driverReferenceSchema.nameVariant.find(x => x.namingConvention === 1)?.name)],
                [NamingConvention.SnakeCase, this.protectUndefinedString(driverReferenceSchema.nameVariant.find(x => x.namingConvention === 2)?.name)],
                [NamingConvention.UpperSnakeCase, this.protectUndefinedString(driverReferenceSchema.nameVariant.find(x => x.namingConvention === 3)?.name)],
                [NamingConvention.KebabCase, this.protectUndefinedString(driverReferenceSchema.nameVariant.find(x => x.namingConvention === 4)?.name)]
            ])),
            Value.of(driverReferenceSchema.description || null),
            Value.of(driverReferenceSchema.deprecationNotice || null),
            Value.of(driverReferenceSchema.entityType),
            Value.of(driverReferenceSchema.entityTypeRelatesToEntity),
            Value.of(Map([
                [NamingConvention.CamelCase, this.protectUndefinedString(driverReferenceSchema.nameVariant.find(x => x.namingConvention === 0)?.name)],
                [NamingConvention.PascalCase, this.protectUndefinedString(driverReferenceSchema.nameVariant.find(x => x.namingConvention === 1)?.name)],
                [NamingConvention.SnakeCase, this.protectUndefinedString(driverReferenceSchema.nameVariant.find(x => x.namingConvention === 2)?.name)],
                [NamingConvention.UpperSnakeCase, this.protectUndefinedString(driverReferenceSchema.nameVariant.find(x => x.namingConvention === 3)?.name)],
                [NamingConvention.KebabCase, this.protectUndefinedString(driverReferenceSchema.nameVariant.find(x => x.namingConvention === 4)?.name)]
            ])),
            Value.of(null), //TODO: fix add value
            Value.of(null), //TODO: fix add value
            Value.of(null), //TODO: fix add value
            Value.of(driverReferenceSchema.indexed),
            Value.of(driverReferenceSchema.faceted),
            Value.of(this.convertCardinality(driverReferenceSchema.cardinality)),
            Value.of(this.convertAttributeSchemas(driverReferenceSchema.attributes)),
            Value.of(this.convertSortableAttributeCompoundSchemas(driverReferenceSchema.sortableAttributeCompounds))
        )
    }

    private convertAttributeSchemas(driverAttributeSchemas: {[key: string]: GrpcAttributeSchema}): AttributeSchema[] {
        const attributesSchemas: AttributeSchema[] = []
        for (const attributeName in driverAttributeSchemas) {
            const driverAttributeSchema: GrpcAttributeSchema = driverAttributeSchemas[attributeName]
            attributesSchemas.push(this.convertAttributeSchema(driverAttributeSchema) as AttributeSchema)
        }
        return attributesSchemas
    }

    private convertAssociatedDataSchemas(driverAssociatedDataSchemas: {[key: string]: GrpcAssociatedDataSchema}): AssociatedDataSchema[] {
        const associatedDataSchemas: AssociatedDataSchema[] = []
        for (const associatedDataName in driverAssociatedDataSchemas) {
            const driverAssociatedDataSchema: GrpcAssociatedDataSchema = driverAssociatedDataSchemas[associatedDataName]
            associatedDataSchemas.push(this.convertAssociatedDataSchema(driverAssociatedDataSchema))
        }
        return associatedDataSchemas
    }

    private convertAssociatedDataSchema(driverAssociatedDataSchema: GrpcAssociatedDataSchema): AssociatedDataSchema {
        return new AssociatedDataSchema(
            driverAssociatedDataSchema.name,
            Value.of(Map([
                [NamingConvention.CamelCase, this.protectUndefinedString(driverAssociatedDataSchema.nameVariant.find(x => x.namingConvention === 0)?.name)],
                [NamingConvention.PascalCase, this.protectUndefinedString(driverAssociatedDataSchema.nameVariant.find(x => x.namingConvention === 0)?.name)],
                [NamingConvention.SnakeCase, this.protectUndefinedString(driverAssociatedDataSchema.nameVariant.find(x => x.namingConvention === 0)?.name)],
                [NamingConvention.UpperSnakeCase, this.protectUndefinedString(driverAssociatedDataSchema.nameVariant.find(x => x.namingConvention === 0)?.name)],
                [NamingConvention.KebabCase, this.protectUndefinedString(driverAssociatedDataSchema.nameVariant.find(x => x.namingConvention === 0)?.name)]
            ])),
            Value.of(driverAssociatedDataSchema.description || null),
            Value.of(driverAssociatedDataSchema.deprecationNotice || null),
            Value.of(this.convertScalar(driverAssociatedDataSchema.type as unknown as GrpcEvitaDataType)),
            Value.of(driverAssociatedDataSchema.nullable),
            Value.of(driverAssociatedDataSchema.localized)
        )
    }

    private convertLocales(locales: GrpcLocale[]): string[] {
        const convertedLocales: string[] = []
        for (const locale of locales) {
            convertedLocales.push(locale.languageTag)
        }
        return convertedLocales
    }

    private convertSortableAttributeCompoundSchemas(driverSortableAttributeCompoundSchemas: { [key: string]: GrpcSortableAttributeCompoundSchema }): SortableAttributeCompoundSchema[] {
        const sortableAttributeSchemas: SortableAttributeCompoundSchema[] = []
        for (const compoundName in driverSortableAttributeCompoundSchemas) {
            const driverSortableAttributeCompoundSchema: GrpcSortableAttributeCompoundSchema = driverSortableAttributeCompoundSchemas[compoundName]
            sortableAttributeSchemas.push(this.convertSortableAttributeCompoundSchema(driverSortableAttributeCompoundSchema))
        }
        return sortableAttributeSchemas
    }

    private convertCurrency(currencies: GrpcCurrency[]): string[] {
        const convertedCurrencies: string[] = []
        for (const currency of currencies) {
            convertedCurrencies.push(currency.code)
        }
        return convertedCurrencies
    }

    private convertEvolutionMode(
        grpcEvolutionModes: GrpcEvolutionMode[]
    ): EvolutionMode[] {
        const evolutionModes: EvolutionMode[] = []
        for (const grpcEvolutionMode of grpcEvolutionModes) {
            switch (grpcEvolutionMode) {
                case GrpcEvolutionMode.ADAPT_PRIMARY_KEY_GENERATION:
                    evolutionModes.push(EvolutionMode.AdaptPrimaryKeyGeneration)
                    break;
                case GrpcEvolutionMode.ADDING_ATTRIBUTES:
                    evolutionModes.push(EvolutionMode.AddingAttributes);
                    break;
                case GrpcEvolutionMode.ADDING_ASSOCIATED_DATA:
                    evolutionModes.push(EvolutionMode.AddingAssociatedData);
                    break;
                case GrpcEvolutionMode.ADDING_REFERENCES:
                    evolutionModes.push(EvolutionMode.AddingReferences);
                    break;
                case GrpcEvolutionMode.ADDING_PRICES:
                    evolutionModes.push(EvolutionMode.AddingPrices);
                    break;
                case GrpcEvolutionMode.ADDING_LOCALES:
                    evolutionModes.push(EvolutionMode.AddingLocales);
                    break;
                case GrpcEvolutionMode.ADDING_CURRENCIES:
                    evolutionModes.push(EvolutionMode.AddingCurrencies);
                    break;
                case GrpcEvolutionMode.ADDING_HIERARCHY:
                    evolutionModes.push(EvolutionMode.AddingHierarchy);
                    break;
                default:
                    throw new UnexpectedError(
                        `Could not convert evolution mode '${grpcEvolutionMode}'.`
                    )
            }
        }
        return evolutionModes
    }

    private convertOrderBehaviour(
        grpcOrderBehaviour: GrpcOrderBehaviour
    ): OrderBehaviour {
        switch (grpcOrderBehaviour) {
            case GrpcOrderBehaviour.NULLS_FIRST:
                return OrderBehaviour.NullsFirst
            case GrpcOrderBehaviour.NULLS_LAST:
                return OrderBehaviour.NullsLast
            default:
                throw new UnexpectedError(
                    `Unsupported order behaviour '${grpcOrderBehaviour}'.`
                )
        }
    }

    private convertCardinality(
        driverCardinality: GrpcCardinality
    ): Cardinality {
        switch (driverCardinality) {
            case GrpcCardinality.EXACTLY_ONE:
                return Cardinality.ExactlyOne
            case GrpcCardinality.ONE_OR_MORE:
                return Cardinality.OneOrMore
            case GrpcCardinality.ZERO_OR_MORE:
                return Cardinality.ZeroOrMore
            case GrpcCardinality.ZERO_OR_ONE:
                return Cardinality.ZeroOrOne
            default:
                throw new UnexpectedError(
                    `Unsupported cardinality '${driverCardinality}'.`
                )
        }
    }

    private convertOrderDirection(
        driverOrderDirection: GrpcOrderDirection
    ): OrderDirection {
        switch (driverOrderDirection) {
            case GrpcOrderDirection.ASC:
                return OrderDirection.Desc
            case GrpcOrderDirection.DESC:
                return OrderDirection.Desc
            default:
                throw new UnexpectedError(
                    `Unsupported order direction '${driverOrderDirection}'.`
                )
        }
    }

    private convertScalar(grpcScalar: GrpcEvitaDataType): Scalar {
        switch (grpcScalar) {
            case GrpcEvitaDataType.BIG_DECIMAL:
                return Scalar.BigDecimal
            case GrpcEvitaDataType.BIG_DECIMAL_NUMBER_RANGE:
                return Scalar.BigDecimalNumberRange
            case GrpcEvitaDataType.BOOLEAN:
                return Scalar.Boolean
            case GrpcEvitaDataType.BYTE:
                return Scalar.Byte
            case GrpcEvitaDataType.BIG_DECIMAL_ARRAY:
                return Scalar.BigDecimalArray
            case GrpcEvitaDataType.BOOLEAN_ARRAY:
                return Scalar.BooleanArray
            case GrpcEvitaDataType.BIG_DECIMAL_NUMBER_RANGE_ARRAY:
                return Scalar.BigDecimalNumberRangeArray
            case GrpcEvitaDataType.BYTE_ARRAY:
                return Scalar.ByteArray
            case GrpcEvitaDataType.BYTE_NUMBER_RANGE:
                return Scalar.BigDecimalNumberRange
            case GrpcEvitaDataType.BYTE_NUMBER_RANGE_ARRAY:
                return Scalar.ByteNumberRangeArray
            case GrpcEvitaDataType.CHARACTER:
                return Scalar.Character
            case GrpcEvitaDataType.CHARACTER_ARRAY:
                return Scalar.CharacterArray
            case GrpcEvitaDataType.CURRENCY:
                return Scalar.Currency
            case GrpcEvitaDataType.CURRENCY_ARRAY:
                return Scalar.Currency
            case GrpcEvitaDataType.DATE_TIME_RANGE:
                return Scalar.DateTimeRange
            case GrpcEvitaDataType.DATE_TIME_RANGE_ARRAY:
                return Scalar.DateTimeRangeArray
            case GrpcEvitaDataType.INTEGER:
                return Scalar.Integer
            case GrpcEvitaDataType.INTEGER_ARRAY:
                return Scalar.IntegerArray
            case GrpcEvitaDataType.INTEGER_NUMBER_RANGE:
                return Scalar.IntegerNumberRange
            case GrpcEvitaDataType.INTEGER_NUMBER_RANGE_ARRAY:
                return Scalar.IntegerNumberRangeArray
            case GrpcEvitaDataType.LOCALE:
                return Scalar.Locale
            case GrpcEvitaDataType.LOCALE_ARRAY:
                return Scalar.LocaleArray
            case GrpcEvitaDataType.LOCAL_DATE:
                return Scalar.LocalDate
            case GrpcEvitaDataType.LOCAL_DATE_ARRAY:
                return Scalar.LocalDateArray
            case GrpcEvitaDataType.LOCAL_DATE_TIME:
                return Scalar.LocalDateTime
            case GrpcEvitaDataType.LOCAL_DATE_TIME_ARRAY:
                return Scalar.LocalDateTimeArray
            case GrpcEvitaDataType.LOCAL_TIME:
                return Scalar.LocalTime
            case GrpcEvitaDataType.LOCAL_TIME_ARRAY:
                return Scalar.LocalTimeArray
            case GrpcEvitaDataType.LONG:
                return Scalar.Long
            case GrpcEvitaDataType.LONG_ARRAY:
                return Scalar.LongArray
            case GrpcEvitaDataType.LONG_NUMBER_RANGE:
                return Scalar.LongNumberRange
            case GrpcEvitaDataType.LONG_NUMBER_RANGE_ARRAY:
                return Scalar.LongNumberRangeArray
            case GrpcEvitaDataType.OFFSET_DATE_TIME:
                return Scalar.OffsetDateTime
            case GrpcEvitaDataType.OFFSET_DATE_TIME_ARRAY:
                return Scalar.OffsetDateTimeArray
            case GrpcEvitaDataType.PREDECESSOR:
                return Scalar.Predecessor
            case GrpcEvitaDataType.SHORT:
                return Scalar.Short
            case GrpcEvitaDataType.SHORT_ARRAY:
                return Scalar.ShortArray
            case GrpcEvitaDataType.SHORT_NUMBER_RANGE:
                return Scalar.ShortNumberRange
            case GrpcEvitaDataType.SHORT_NUMBER_RANGE_ARRAY:
                return Scalar.ShortNumberRangeArray
            case GrpcEvitaDataType.STRING:
                return Scalar.String
            case GrpcEvitaDataType.STRING_ARRAY:
                return Scalar.StringArray
            case GrpcEvitaDataType.UUID:
                return Scalar.UUID
            case GrpcEvitaDataType.UUID_ARRAY:
                return Scalar.UUIDArray
        }
    }
}
