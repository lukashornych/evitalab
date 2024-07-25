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
    GrpcAttributeSchemaType,
    GrpcAttributeUniquenessType,
    GrpcCardinality,
    GrpcEvitaDataType,
    GrpcEvolutionMode,
    GrpcGlobalAttributeUniquenessType,
    GrpcNamingConvention,
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
import {
    GrpcAssociatedDataSchema,
    GrpcAttributeElement,
    GrpcAttributeSchema,
    GrpcEntitySchema,
    GrpcReferenceSchema,
    GrpcSortableAttributeCompoundSchema,
} from '@/gen/GrpcEntitySchema_pb'
import {
    GrpcCurrency,
    GrpcLocale,
    GrpcNameVariant,
} from '@/gen/GrpcEvitaDataTypes_pb'
import { ReferenceSchema } from '@/modules/connection/model/schema/ReferenceSchema'
import {
    AttributeElement,
    SortableAttributeCompoundSchema,
} from '@/modules/connection/model/schema/SortableAttributeCompoundSchema'
import { AssociatedDataSchema } from '@/modules/connection/model/schema/AssociatedDataSchema'
import { Currency } from '@/modules/connection/model/data/Currency'

//TODO: Add documentation
export class CatalogSchemaConverter {
    convert(
        catalogSchema: GrpcCatalogSchema,
        entitySchemaAccessor: (
            catalogName: string
        ) => Promise<Value<List<EntitySchema>>>
    ): CatalogSchema {
        return new CatalogSchema(
            Value.of(catalogSchema.version),
            catalogSchema.name,
            Value.of(
                Map([
                    [
                        NamingConvention.CamelCase,
                        this.convertNamingConvention(
                            catalogSchema.nameVariant,
                            GrpcNamingConvention.CAMEL_CASE
                        ),
                    ],
                    [
                        NamingConvention.PascalCase,
                        this.convertNamingConvention(
                            catalogSchema.nameVariant,
                            GrpcNamingConvention.PASCAL_CASE
                        ),
                    ],
                    [
                        NamingConvention.SnakeCase,
                        this.convertNamingConvention(
                            catalogSchema.nameVariant,
                            GrpcNamingConvention.SNAKE_CASE
                        ),
                    ],
                    [
                        NamingConvention.UpperSnakeCase,
                        this.convertNamingConvention(
                            catalogSchema.nameVariant,
                            GrpcNamingConvention.UPPER_SNAKE_CASE
                        ),
                    ],
                    [
                        NamingConvention.KebabCase,
                        this.convertNamingConvention(
                            catalogSchema.nameVariant,
                            GrpcNamingConvention.KEBAB_CASE
                        ),
                    ],
                ])
            ),
            Value.of(catalogSchema.description || null),
            Value.of(
                this.convertGlobalAttributeSchemas(catalogSchema.attributes)
            ),
            entitySchemaAccessor
        )
    }

    private convertNamingConvention(
        namingConvention: GrpcNameVariant[],
        targetConvention: GrpcNamingConvention
    ): string {
        return (
            namingConvention.find(
                (x) => x.namingConvention === targetConvention
            )?.name ?? ''
        )
    }

    private convertGlobalAttributeSchemas(attributeSchemas: {
        [key: string]: GrpcGlobalAttributeSchema
    }): GlobalAttributeSchema[] {
        const globalAttributeSchemas: GlobalAttributeSchema[] = []

        for (const attributeSchema in attributeSchemas) {
            const schema: GrpcGlobalAttributeSchema =
                attributeSchemas[attributeSchema]
            globalAttributeSchemas.push(
                this.convertGlobalAttributeSchema(
                    schema
                ) as GlobalAttributeSchema
            )
        }
        return globalAttributeSchemas
    }

    private convertAttributeSchema(
        attribute: GrpcAttributeSchema
    ): AttributeSchema {
        if (attribute.schemaType === GrpcAttributeSchemaType.ENTITY) {
            return new AttributeSchema(
                attribute.name,
                Value.of(
                    Map([
                        [
                            NamingConvention.CamelCase,
                            this.convertNamingConvention(
                                attribute.nameVariant,
                                GrpcNamingConvention.CAMEL_CASE
                            ),
                        ],
                        [
                            NamingConvention.PascalCase,
                            this.convertNamingConvention(
                                attribute.nameVariant,
                                GrpcNamingConvention.PASCAL_CASE
                            ),
                        ],
                        [
                            NamingConvention.SnakeCase,
                            this.convertNamingConvention(
                                attribute.nameVariant,
                                GrpcNamingConvention.SNAKE_CASE
                            ),
                        ],
                        [
                            NamingConvention.UpperSnakeCase,
                            this.convertNamingConvention(
                                attribute.nameVariant,
                                GrpcNamingConvention.UPPER_SNAKE_CASE
                            ),
                        ],
                        [
                            NamingConvention.KebabCase,
                            this.convertNamingConvention(
                                attribute.nameVariant,
                                GrpcNamingConvention.KEBAB_CASE
                            ),
                        ],
                    ])
                ),
                Value.of(attribute.description ?? null),
                Value.of(attribute.deprecationNotice ?? null),
                Value.of(this.convertScalar(attribute.type)),
                Value.of(this.convertAttributeUniquenessType(attribute.unique)),
                Value.of(attribute.filterable),
                Value.of(attribute.sortable),
                Value.of(attribute.nullable),
                Value.of(attribute.defaultValue),
                Value.of(attribute.localized),
                Value.of(attribute.indexedDecimalPlaces)
            )
        } else if (attribute.schemaType === GrpcAttributeSchemaType.REFERENCE) {
            return new EntityAttributeSchema(
                attribute.name,
                Value.of(
                    Map([
                        [
                            NamingConvention.CamelCase,
                            this.convertNamingConvention(
                                attribute.nameVariant,
                                GrpcNamingConvention.CAMEL_CASE
                            ),
                        ],
                        [
                            NamingConvention.PascalCase,
                            this.convertNamingConvention(
                                attribute.nameVariant,
                                GrpcNamingConvention.PASCAL_CASE
                            ),
                        ],
                        [
                            NamingConvention.SnakeCase,
                            this.convertNamingConvention(
                                attribute.nameVariant,
                                GrpcNamingConvention.SNAKE_CASE
                            ),
                        ],
                        [
                            NamingConvention.UpperSnakeCase,
                            this.convertNamingConvention(
                                attribute.nameVariant,
                                GrpcNamingConvention.UPPER_SNAKE_CASE
                            ),
                        ],
                        [
                            NamingConvention.KebabCase,
                            this.convertNamingConvention(
                                attribute.nameVariant,
                                GrpcNamingConvention.KEBAB_CASE
                            ),
                        ],
                    ])
                ),
                Value.of(attribute.description ?? null),
                Value.of(attribute.deprecationNotice ?? null),
                Value.of(this.convertScalar(attribute.type)),
                Value.of(this.convertAttributeUniquenessType(attribute.unique)),
                Value.of(attribute.filterable),
                Value.of(attribute.sortable),
                Value.of(attribute.nullable),
                Value.of(attribute.defaultValue),
                Value.of(attribute.localized),
                Value.of(attribute.indexedDecimalPlaces),
                Value.of(attribute.representative)
            )
        } else {
            throw new UnexpectedError('Unaccepted type')
        }
    }

    private convertGlobalAttributeSchema(
        globalAttributeSchema: GrpcGlobalAttributeSchema
    ): AttributeSchema {
        const globalAttribute = 'globalUniquenessType' in globalAttributeSchema
        const entityAttribute = 'representative' in globalAttributeSchema

        const name: string = globalAttributeSchema.name
        const nameVariants: Value<Map<NamingConvention, string>> = Value.of(
            Map([
                [
                    NamingConvention.CamelCase,
                    this.convertNamingConvention(
                        globalAttributeSchema.nameVariant,
                        GrpcNamingConvention.CAMEL_CASE
                    ),
                ],
                [
                    NamingConvention.PascalCase,
                    this.convertNamingConvention(
                        globalAttributeSchema.nameVariant,
                        GrpcNamingConvention.PASCAL_CASE
                    ),
                ],
                [
                    NamingConvention.SnakeCase,
                    this.convertNamingConvention(
                        globalAttributeSchema.nameVariant,
                        GrpcNamingConvention.SNAKE_CASE
                    ),
                ],
                [
                    NamingConvention.UpperSnakeCase,
                    this.convertNamingConvention(
                        globalAttributeSchema.nameVariant,
                        GrpcNamingConvention.UPPER_SNAKE_CASE
                    ),
                ],
                [
                    NamingConvention.KebabCase,
                    this.convertNamingConvention(
                        globalAttributeSchema.nameVariant,
                        GrpcNamingConvention.KEBAB_CASE
                    ),
                ],
            ])
        )

        const description: Value<string | null> = Value.of(
            globalAttributeSchema.description ?? null
        )
        const deprecationNotice: Value<string | null> = Value.of(
            globalAttributeSchema.deprecationNotice === undefined
                ? null
                : globalAttributeSchema.deprecationNotice
        )
        const type: Value<Scalar> = Value.of(
            this.convertScalar(globalAttributeSchema.type)
        )
        const uniquenessType: Value<AttributeUniquenessType> = Value.of(
            this.convertAttributeUniquenessType(globalAttributeSchema.unique)
        )
        const filterable: Value<boolean> = Value.of(
            globalAttributeSchema.filterable
        )
        const sortable: Value<boolean> = Value.of(
            globalAttributeSchema.sortable
        )
        const nullable: Value<boolean> = Value.of(
            globalAttributeSchema.nullable
        )
        const defaultValue: Value<any | any[] | null> = Value.of(
            globalAttributeSchema.defaultValue || null
        )
        const localized: Value<boolean> = Value.of(
            globalAttributeSchema.localized
        )
        const indexedDecimalPlaces: Value<number> = Value.of(
            globalAttributeSchema.indexedDecimalPlaces
        )

        if (globalAttribute || entityAttribute) {
            const representative: Value<any> = Value.of(
                globalAttributeSchema.representative
            )
            if (globalAttribute) {
                const uniqueGloballyType: Value<GlobalAttributeUniquenessType> =
                    Value.of(
                        this.convertGlobalAttributeUniquenessType(
                            globalAttributeSchema.uniqueGlobally
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
        globalAttributeUniquenessType: GrpcGlobalAttributeUniquenessType
    ): GlobalAttributeUniquenessType {
        switch (globalAttributeUniquenessType) {
            case GrpcGlobalAttributeUniquenessType.NOT_GLOBALLY_UNIQUE:
                return GlobalAttributeUniquenessType.NotUnique
            case GrpcGlobalAttributeUniquenessType.UNIQUE_WITHIN_CATALOG:
                return GlobalAttributeUniquenessType.UniqueWithinCatalog
            case GrpcGlobalAttributeUniquenessType.UNIQUE_WITHIN_CATALOG_LOCALE:
                return GlobalAttributeUniquenessType.UniqueWithinCatalogLocale
            default:
                throw new UnexpectedError(
                    `Unsupported global attribute uniqueness type '${globalAttributeUniquenessType}'.`
                )
        }
    }

    convertEntitySchema(entitySchema: GrpcEntitySchema): EntitySchema {
        return new EntitySchema(
            Value.of(entitySchema.version),
            entitySchema.name,
            Value.of(
                Map([
                    [
                        NamingConvention.CamelCase,
                        this.convertNamingConvention(
                            entitySchema.nameVariant,
                            GrpcNamingConvention.CAMEL_CASE
                        ),
                    ],
                    [
                        NamingConvention.PascalCase,
                        this.convertNamingConvention(
                            entitySchema.nameVariant,
                            GrpcNamingConvention.PASCAL_CASE
                        ),
                    ],
                    [
                        NamingConvention.SnakeCase,
                        this.convertNamingConvention(
                            entitySchema.nameVariant,
                            GrpcNamingConvention.SNAKE_CASE
                        ),
                    ],
                    [
                        NamingConvention.UpperSnakeCase,
                        this.convertNamingConvention(
                            entitySchema.nameVariant,
                            GrpcNamingConvention.UPPER_SNAKE_CASE
                        ),
                    ],
                    [
                        NamingConvention.KebabCase,
                        this.convertNamingConvention(
                            entitySchema.nameVariant,
                            GrpcNamingConvention.KEBAB_CASE
                        ),
                    ],
                ])
            ),
            Value.of(entitySchema.description || null),
            Value.of(entitySchema.deprecationNotice || null),
            Value.of(entitySchema.withGeneratedPrimaryKey),
            Value.of(entitySchema.withHierarchy),
            Value.of(entitySchema.withPrice),
            Value.of(entitySchema.indexedPricePlaces),
            Value.of(this.convertLocales(entitySchema.locales)),
            Value.of(this.convertCurrency(entitySchema.currencies)),
            Value.of(this.convertEvolutionMode(entitySchema.evolutionMode)),
            Value.of(
                this.convertEntityAttributeSchemas(entitySchema.attributes)
            ),
            Value.of(
                this.convertSortableAttributeCompoundSchemas(
                    entitySchema.sortableAttributeCompounds
                )
            ),
            Value.of(
                this.convertAssociatedDataSchemas(entitySchema.associatedData)
            ),
            Value.of(this.convertReferenceSchemas(entitySchema.references))
        )
    }

    private convertSortableAttributeCompoundSchema(
        sortableAttributeCompoundSchema: GrpcSortableAttributeCompoundSchema
    ): SortableAttributeCompoundSchema {
        return new SortableAttributeCompoundSchema(
            sortableAttributeCompoundSchema.name,
            Value.of(
                Map([
                    [
                        NamingConvention.CamelCase,
                        this.convertNamingConvention(
                            sortableAttributeCompoundSchema.nameVariant,
                            GrpcNamingConvention.CAMEL_CASE
                        ),
                    ],
                    [
                        NamingConvention.PascalCase,
                        this.convertNamingConvention(
                            sortableAttributeCompoundSchema.nameVariant,
                            GrpcNamingConvention.PASCAL_CASE
                        ),
                    ],
                    [
                        NamingConvention.SnakeCase,
                        this.convertNamingConvention(
                            sortableAttributeCompoundSchema.nameVariant,
                            GrpcNamingConvention.SNAKE_CASE
                        ),
                    ],
                    [
                        NamingConvention.UpperSnakeCase,
                        this.convertNamingConvention(
                            sortableAttributeCompoundSchema.nameVariant,
                            GrpcNamingConvention.UPPER_SNAKE_CASE
                        ),
                    ],
                    [
                        NamingConvention.KebabCase,
                        this.convertNamingConvention(
                            sortableAttributeCompoundSchema.nameVariant,
                            GrpcNamingConvention.KEBAB_CASE
                        ),
                    ],
                ])
            ),
            Value.of(sortableAttributeCompoundSchema.description || null),
            Value.of(sortableAttributeCompoundSchema.deprecationNotice || null),
            Value.of(
                this.convertAttributeElements(
                    sortableAttributeCompoundSchema.attributeElements
                )
            )
        )
    }

    private convertAttributeElements(
        attributeElements: GrpcAttributeElement[]
    ): AttributeElement[] {
        return attributeElements.map((it) => this.convertAttributeElement(it))
    }

    private convertAttributeElement(
        attributeElement: GrpcAttributeElement
    ): AttributeElement {
        return new AttributeElement(
            Value.of(attributeElement.attributeName),
            Value.of(this.convertOrderBehaviour(attributeElement.behaviour)),
            Value.of(this.convertOrderDirection(attributeElement.direction))
        )
    }

    private convertReferenceSchemas(referenceSchemas: {
        [key: string]: GrpcReferenceSchema
    }): ReferenceSchema[] {
        const newReferenceSchemas: ReferenceSchema[] = []
        for (const referenceName in referenceSchemas) {
            const driverReferenceSchema: GrpcReferenceSchema =
                referenceSchemas[referenceName]
            newReferenceSchemas.push(
                this.convertReferenceSchema(driverReferenceSchema)
            )
        }
        return newReferenceSchemas
    }

    private convertEntityAttributeSchemas(entityAttributeSchemas: {
        [key: string]: GrpcAttributeSchema
    }): EntityAttributeSchema[] {
        const entityAttributesSchemas: EntityAttributeSchema[] = []
        for (const attributeName in entityAttributeSchemas) {
            const driverEntityAttributeSchema: GrpcAttributeSchema =
                entityAttributeSchemas[attributeName]
            entityAttributesSchemas.push(
                this.convertGlobalAttributeSchema(
                    driverEntityAttributeSchema
                ) as EntityAttributeSchema
            )
        }
        return entityAttributesSchemas
    }
    private convertReferenceSchema(
        referenceSchema: GrpcReferenceSchema
    ): ReferenceSchema {
        return new ReferenceSchema(
            referenceSchema.name,
            Value.of(
                Map([
                    [
                        NamingConvention.CamelCase,
                        this.convertNamingConvention(
                            referenceSchema.nameVariant,
                            GrpcNamingConvention.CAMEL_CASE
                        ),
                    ],
                    [
                        NamingConvention.PascalCase,
                        this.convertNamingConvention(
                            referenceSchema.nameVariant,
                            GrpcNamingConvention.PASCAL_CASE
                        ),
                    ],
                    [
                        NamingConvention.SnakeCase,
                        this.convertNamingConvention(
                            referenceSchema.nameVariant,
                            GrpcNamingConvention.SNAKE_CASE
                        ),
                    ],
                    [
                        NamingConvention.UpperSnakeCase,
                        this.convertNamingConvention(
                            referenceSchema.nameVariant,
                            GrpcNamingConvention.UPPER_SNAKE_CASE
                        ),
                    ],
                    [
                        NamingConvention.KebabCase,
                        this.convertNamingConvention(
                            referenceSchema.nameVariant,
                            GrpcNamingConvention.KEBAB_CASE
                        ),
                    ],
                ])
            ),
            Value.of(referenceSchema.description || null),
            Value.of(referenceSchema.deprecationNotice || null),
            Value.of(referenceSchema.entityType),
            Value.of(referenceSchema.entityTypeRelatesToEntity),
            Value.of(
                Map([
                    [
                        NamingConvention.CamelCase,
                        this.convertNamingConvention(
                            referenceSchema.nameVariant,
                            GrpcNamingConvention.CAMEL_CASE
                        ),
                    ],
                    [
                        NamingConvention.PascalCase,
                        this.convertNamingConvention(
                            referenceSchema.nameVariant,
                            GrpcNamingConvention.PASCAL_CASE
                        ),
                    ],
                    [
                        NamingConvention.SnakeCase,
                        this.convertNamingConvention(
                            referenceSchema.nameVariant,
                            GrpcNamingConvention.SNAKE_CASE
                        ),
                    ],
                    [
                        NamingConvention.UpperSnakeCase,
                        this.convertNamingConvention(
                            referenceSchema.nameVariant,
                            GrpcNamingConvention.UPPER_SNAKE_CASE
                        ),
                    ],
                    [
                        NamingConvention.KebabCase,
                        this.convertNamingConvention(
                            referenceSchema.nameVariant,
                            GrpcNamingConvention.KEBAB_CASE
                        ),
                    ],
                ])
            ),
            Value.of(null), //TODO: fix add value
            Value.of(null), //TODO: fix add value
            Value.of(null), //TODO: fix add value
            Value.of(referenceSchema.indexed),
            Value.of(referenceSchema.faceted),
            Value.of(this.convertCardinality(referenceSchema.cardinality)),
            Value.of(this.convertAttributeSchemas(referenceSchema.attributes)),
            Value.of(
                this.convertSortableAttributeCompoundSchemas(
                    referenceSchema.sortableAttributeCompounds
                )
            )
        )
    }

    private convertAttributeSchemas(attributeSchemas: {
        [key: string]: GrpcAttributeSchema
    }): AttributeSchema[] {
        const attributesSchemas: AttributeSchema[] = []
        for (const attributeName in attributeSchemas) {
            const driverAttributeSchema: GrpcAttributeSchema =
                attributeSchemas[attributeName]
            attributesSchemas.push(
                this.convertAttributeSchema(driverAttributeSchema)
            )
        }
        return attributesSchemas
    }

    private convertAssociatedDataSchemas(associatedDataSchemas: {
        [key: string]: GrpcAssociatedDataSchema
    }): AssociatedDataSchema[] {
        const newAssociatedDataSchemas: AssociatedDataSchema[] = []
        for (const associatedDataName in associatedDataSchemas) {
            const driverAssociatedDataSchema: GrpcAssociatedDataSchema =
                associatedDataSchemas[associatedDataName]
            newAssociatedDataSchemas.push(
                this.convertAssociatedDataSchema(driverAssociatedDataSchema)
            )
        }
        return newAssociatedDataSchemas
    }

    private convertAssociatedDataSchema(
        associatedDataSchema: GrpcAssociatedDataSchema
    ): AssociatedDataSchema {
        return new AssociatedDataSchema(
            associatedDataSchema.name,
            Value.of(
                Map([
                    [
                        NamingConvention.CamelCase,
                        this.convertNamingConvention(
                            associatedDataSchema.nameVariant,
                            GrpcNamingConvention.CAMEL_CASE
                        ),
                    ],
                    [
                        NamingConvention.PascalCase,
                        this.convertNamingConvention(
                            associatedDataSchema.nameVariant,
                            GrpcNamingConvention.PASCAL_CASE
                        ),
                    ],
                    [
                        NamingConvention.SnakeCase,
                        this.convertNamingConvention(
                            associatedDataSchema.nameVariant,
                            GrpcNamingConvention.SNAKE_CASE
                        ),
                    ],
                    [
                        NamingConvention.UpperSnakeCase,
                        this.convertNamingConvention(
                            associatedDataSchema.nameVariant,
                            GrpcNamingConvention.UPPER_SNAKE_CASE
                        ),
                    ],
                    [
                        NamingConvention.KebabCase,
                        this.convertNamingConvention(
                            associatedDataSchema.nameVariant,
                            GrpcNamingConvention.KEBAB_CASE
                        ),
                    ],
                ])
            ),
            Value.of(associatedDataSchema.description || null),
            Value.of(associatedDataSchema.deprecationNotice || null),
            Value.of(
                this.convertScalar(
                    associatedDataSchema.type as unknown as GrpcEvitaDataType
                )
            ),
            Value.of(associatedDataSchema.nullable),
            Value.of(associatedDataSchema.localized)
        )
    }

    private convertLocales(locales: GrpcLocale[]): string[] {
        const convertedLocales: string[] = []
        for (const locale of locales) {
            convertedLocales.push(locale.languageTag)
        }
        return convertedLocales
    }

    private convertSortableAttributeCompoundSchemas(sortableAttributeCompoundSchemas: {
        [key: string]: GrpcSortableAttributeCompoundSchema
    }): SortableAttributeCompoundSchema[] {
        const sortableAttributeSchemas: SortableAttributeCompoundSchema[] = []
        for (const compoundName in sortableAttributeCompoundSchemas) {
            const driverSortableAttributeCompoundSchema: GrpcSortableAttributeCompoundSchema =
                sortableAttributeCompoundSchemas[compoundName]
            sortableAttributeSchemas.push(
                this.convertSortableAttributeCompoundSchema(
                    driverSortableAttributeCompoundSchema
                )
            )
        }
        return sortableAttributeSchemas
    }

    private convertCurrency(currencies: GrpcCurrency[]): Currency[] {
        const convertedCurrencies: Currency[] = []
        for (const currency of currencies) {
            convertedCurrencies.push(new Currency(currency.code))
        }
        return convertedCurrencies
    }

    private convertEvolutionMode(
        evolutionModes: GrpcEvolutionMode[]
    ): EvolutionMode[] {
        const newEvolutionModes: EvolutionMode[] = []
        for (const grpcEvolutionMode of evolutionModes) {
            switch (grpcEvolutionMode) {
                case GrpcEvolutionMode.ADAPT_PRIMARY_KEY_GENERATION:
                    newEvolutionModes.push(
                        EvolutionMode.AdaptPrimaryKeyGeneration
                    )
                    break
                case GrpcEvolutionMode.ADDING_ATTRIBUTES:
                    newEvolutionModes.push(EvolutionMode.AddingAttributes)
                    break
                case GrpcEvolutionMode.ADDING_ASSOCIATED_DATA:
                    newEvolutionModes.push(EvolutionMode.AddingAssociatedData)
                    break
                case GrpcEvolutionMode.ADDING_REFERENCES:
                    newEvolutionModes.push(EvolutionMode.AddingReferences)
                    break
                case GrpcEvolutionMode.ADDING_PRICES:
                    newEvolutionModes.push(EvolutionMode.AddingPrices)
                    break
                case GrpcEvolutionMode.ADDING_LOCALES:
                    newEvolutionModes.push(EvolutionMode.AddingLocales)
                    break
                case GrpcEvolutionMode.ADDING_CURRENCIES:
                    newEvolutionModes.push(EvolutionMode.AddingCurrencies)
                    break
                case GrpcEvolutionMode.ADDING_HIERARCHY:
                    newEvolutionModes.push(EvolutionMode.AddingHierarchy)
                    break
                default:
                    throw new UnexpectedError(
                        `Could not convert evolution mode '${grpcEvolutionMode}'.`
                    )
            }
        }
        return newEvolutionModes
    }

    private convertOrderBehaviour(
        orderBehaviour: GrpcOrderBehaviour
    ): OrderBehaviour {
        switch (orderBehaviour) {
            case GrpcOrderBehaviour.NULLS_FIRST:
                return OrderBehaviour.NullsFirst
            case GrpcOrderBehaviour.NULLS_LAST:
                return OrderBehaviour.NullsLast
            default:
                throw new UnexpectedError(
                    `Unsupported order behaviour '${orderBehaviour}'.`
                )
        }
    }

    private convertCardinality(cardinality: GrpcCardinality): Cardinality {
        switch (cardinality) {
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
                    `Unsupported cardinality '${cardinality}'.`
                )
        }
    }

    private convertOrderDirection(
        orderDirection: GrpcOrderDirection
    ): OrderDirection {
        switch (orderDirection) {
            case GrpcOrderDirection.ASC:
                return OrderDirection.Desc
            case GrpcOrderDirection.DESC:
                return OrderDirection.Desc
            default:
                throw new UnexpectedError(
                    `Unsupported order direction '${orderDirection}'.`
                )
        }
    }

    private convertScalar(scalar: GrpcEvitaDataType): Scalar {
        switch (scalar) {
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
