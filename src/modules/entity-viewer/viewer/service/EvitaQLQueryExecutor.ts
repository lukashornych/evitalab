import { QueryExecutor } from '@/modules/entity-viewer/viewer/service/QueryExecutor'
import { EvitaDBDriver } from '@/modules/connection/driver/EvitaDBDriver'
import { ConnectionService } from '@/modules/connection/service/ConnectionService'
import { EntityViewerDataPointer } from '@/modules/entity-viewer/viewer/model/EntityViewerDataPointer'
import { QueryResult } from '@/modules/entity-viewer/viewer/model/QueryResult'
import { Response } from '@/modules/connection/model/data/Response'
import { FlatEntity } from '@/modules/entity-viewer/viewer/model/FlatEntity'
import { WritableEntityProperty } from '@/modules/entity-viewer/viewer/model/WritableEntityProperty'
import { EntityPropertyKey } from '@/modules/entity-viewer/viewer/model/EntityPropertyKey'
import { StaticEntityProperties } from '@/modules/entity-viewer/viewer/model/StaticEntityProperties'
import { NativeValue } from '@/modules/entity-viewer/viewer/model/entity-property-value/NativeValue'
import { EntityReferenceValue } from '@/modules/entity-viewer/viewer/model/entity-property-value/EntityReferenceValue'
import { EntityPrice } from '@/modules/entity-viewer/viewer/model/entity-property-value/EntityPrice'
import { EntityPropertyValue } from '@/modules/entity-viewer/viewer/model/EntityPropertyValue'
import { EvitaDBDriverResolver } from '@/modules/connection/driver/EvitaDBDriverResolver'
import { Entity } from '@/modules/connection/model/data/Entity'
import { Price } from '@/modules/connection/model/data/Price'
import { Reference } from '@/modules/connection/model/data/Reference'
import { Locale } from '@/modules/connection/model/data-type/Locale'
import { EntityPrices } from '../model/entity-property-value/EntityPrices'

/**
 * Query executor for EvitaQL language.
 */
export class EvitaQLQueryExecutor extends QueryExecutor {
    private readonly evitaDBDriverResolver: EvitaDBDriverResolver

    constructor(
        connectionService: ConnectionService,
        evitaDBDriverResolver: EvitaDBDriverResolver
    ) {
        super(connectionService)
        this.evitaDBDriverResolver = evitaDBDriverResolver
    }

    async executeQuery(
        dataPointer: EntityViewerDataPointer,
        query: string
    ): Promise<QueryResult> {
        const evitaDBDriver: EvitaDBDriver =
            await this.evitaDBDriverResolver.resolveDriver(
                dataPointer.connection
            )
        const result: Response = await evitaDBDriver.query(
            dataPointer.connection,
            dataPointer.catalogName,
            query
        )
        return {
            entities:
                result.recordPage
                    .getIfSupported()
                    ?.data.getIfSupported()
                    ?.map((entity: Entity) => this.flattenEntity(entity)) || [],
            totalEntitiesCount:
                result.recordPage
                    .getIfSupported()
                    ?.totalRecordCount?.getIfSupported() || 0,
        }
    }

    /**
     * Converts original rich entity into simplified flat entity that is displayable in table
     */
    private flattenEntity(entity: Entity): FlatEntity {
        const flattenedProperties: (WritableEntityProperty | undefined)[] = []

        flattenedProperties.push([
            EntityPropertyKey.entity(StaticEntityProperties.PrimaryKey),
            this.wrapRawValueIntoNativeValue(
                Object(entity.primaryKey.getOrThrow())
            ),
        ])
        flattenedProperties.push(this.flattenParent(entity))

        const newLocales: Locale[] = []
        const locales = entity.locales.getOrThrow()

        for (const locale of locales) {
            newLocales.push(locale)
        }

        flattenedProperties.push([
            EntityPropertyKey.entity(StaticEntityProperties.Locales),
            this.wrapRawValueIntoNativeValue(newLocales),
        ])
        flattenedProperties.push([
            EntityPropertyKey.entity(
                StaticEntityProperties.PriceInnerRecordHandling
            ),
            this.wrapRawValueIntoNativeValue(
                Object(entity.priceInnerRecordHandling.getOrThrow())
            ),
        ])

        flattenedProperties.push(...this.flattenAttributes(entity))
        flattenedProperties.push(...this.flattenAssociatedData(entity))
        flattenedProperties.push(this.flattenPrices(entity))
        flattenedProperties.push(...this.flattenReferences(entity))

        return this.createFlatEntity(flattenedProperties)
    }

    private flattenParent(entity: Entity): WritableEntityProperty | undefined {
        const parentPrimaryKey: number = entity.primaryKey.getOrThrow()

        const representativeAttributes: (NativeValue | NativeValue[])[] = []
        const globalAttributes = entity.globalAttributes.getIfSupported()
        if (globalAttributes) {
            for (const [attributeName, attribute] of globalAttributes) {
                representativeAttributes.push(
                    this.wrapRawValueIntoNativeValue(attribute)
                )
            }
        }
        const localizedRepresentativeAttributes =
            entity.localizedAttributes.getIfSupported()
        if (localizedRepresentativeAttributes) {
            for (const [
                attributeName,
                attribute,
            ] of localizedRepresentativeAttributes) {
                representativeAttributes.push(
                    this.wrapRawValueIntoNativeValue(attribute)
                )
            }
        }

        const parentReference: EntityReferenceValue = new EntityReferenceValue(
            parentPrimaryKey,
            representativeAttributes.flat()
        )
        return [
            EntityPropertyKey.entity(StaticEntityProperties.ParentPrimaryKey),
            parentReference,
        ]
    }

    private flattenAttributes(entity: Entity): WritableEntityProperty[] {
        const flattenedAttributes: WritableEntityProperty[] = []

        const globalAttributes = entity.globalAttributes.getIfSupported()
        if (globalAttributes) {
            for (const [key, attributeName] of globalAttributes) {
                flattenedAttributes.push([
                    EntityPropertyKey.attributes(key),
                    this.wrapRawValueIntoNativeValue(attributeName),
                ])
            }
        }
        const localizedAttributes = entity.localizedAttributes.getIfSupported()
        if (localizedAttributes) {
            for (const [key, locale] of localizedAttributes) {
                // this expects that we support only one locale
                const attributesInLocale = locale.attributes.getIfSupported()
                if (attributesInLocale) {
                    for (const [
                        attributeName,
                        attribute,
                    ] of attributesInLocale) {
                        flattenedAttributes.push([
                            EntityPropertyKey.attributes(key),
                            this.wrapRawValueIntoNativeValue(attribute),
                        ])
                    }
                }
            }
        }
        return flattenedAttributes
    }

    private flattenAssociatedData(entity: Entity): WritableEntityProperty[] {
        const flattenedAssociatedData: WritableEntityProperty[] = []

        const globalAssociatedData =
            entity.globalAssociatedData.getIfSupported()
        if (globalAssociatedData) {
            for (const [
                associatedDataName,
                associatedData,
            ] of globalAssociatedData) {
                flattenedAssociatedData.push([
                    EntityPropertyKey.associatedData(associatedDataName),
                    this.wrapRawValueIntoNativeValue(associatedData),
                ])
            }
        }
        const localizedAssociatedData =
            entity.localizedAssociatedData.getIfSupported()
        if (localizedAssociatedData) {
            for (const [localeName, locale] of localizedAssociatedData) {
                // this expects that we support only one locale
                const associatedDataInLocale = locale.associatedData
                if (associatedDataInLocale) {
                    for (const [
                        associatedDataName,
                        associatedData,
                    ] of associatedDataInLocale) {
                        flattenedAssociatedData.push([
                            EntityPropertyKey.associatedData(
                                associatedDataName
                            ),
                            this.wrapRawValueIntoNativeValue(associatedData),
                        ])
                    }
                }
            }
        }
        return flattenedAssociatedData
    }

    private flattenPrices(entity: Entity): WritableEntityProperty | undefined {
        const priceForSale: Price | undefined =
            entity.priceForSale.getIfSupported()
        const prices = entity.prices.getIfSupported()
        if (priceForSale == undefined && prices == undefined) {
            return undefined
        }

        const entityPrices: EntityPrice[] = []
        if (prices) {
            for (const price of prices) {
                entityPrices.push(
                    new EntityPrice(
                        price.priceId.getIfSupported(),
                        price.priceList.getOrThrow(),
                        price.currency.getOrThrow(),
                        price.innerRecordId.getIfSupported(),
                        price.sellable.getIfSupported(),
                        price.validity.getIfSupported(),
                        price.priceWithoutTax.getIfSupported(),
                        price.priceWithTax.getOrThrow(),
                        price.taxRate.getIfSupported()
                    )
                )
            }
        }
        if (priceForSale) {
            const newPriceForSale: EntityPrice = new EntityPrice(
                priceForSale?.priceId.getIfSupported(),
                priceForSale?.priceList.getOrThrow(),
                priceForSale?.currency.getOrThrow(),
                priceForSale?.innerRecordId.getIfSupported(),
                priceForSale?.sellable.getIfSupported(),
                priceForSale?.validity.getIfSupported(),
                priceForSale?.priceWithoutTax.getIfSupported(),
                priceForSale?.priceWithTax.getOrThrow(),
                priceForSale?.taxRate.getIfSupported()
            )
            return [
                EntityPropertyKey.prices(),
                new EntityPrices(newPriceForSale, entityPrices),
            ]
        } else {
            [
                EntityPropertyKey.prices(),
                new EntityPrices(undefined, entityPrices),
            ]
        }
    }

    private flattenReferences(entity: Entity): WritableEntityProperty[] {
        const flattenedReferences: WritableEntityProperty[] = []

        const references = entity.references.getOrThrow()
        for (const referenceName of references) {
            const referencesOfName = referenceName
            const refName = referenceName.referenceName.getIfSupported()
            if (referencesOfName == undefined) {
                continue
            }
            if (referencesOfName instanceof Array) {
                const representativeValues: EntityReferenceValue[] =
                    referencesOfName.map((referenceOfName) =>
                        this.resolveReferenceRepresentativeValue(
                            referenceOfName
                        )
                    )
                const refNameVlaue =
                    referenceName.referenceName.getIfSupported()
                if (refNameVlaue)
                    flattenedReferences.push([
                        EntityPropertyKey.references(refNameVlaue),
                        representativeValues,
                    ])

                const mergedReferenceAttributesByName: Map<
                    string,
                    EntityReferenceValue[]
                > = referencesOfName
                    .map((referenceOfName) =>
                        this.flattenAttributesForSingleReference(
                            referenceOfName
                        )
                    )
                    .reduce((accumulator, referenceAttributes) => {
                        referenceAttributes.forEach(
                            ([attributeName, attributeValue]) => {
                                let attributes = accumulator.get(attributeName)
                                if (attributes == undefined) {
                                    attributes = []
                                    accumulator.set(attributeName, attributes)
                                }
                                attributes.push(attributeValue)
                            }
                        )
                        return accumulator
                    }, new Map<string, EntityReferenceValue[]>())
                mergedReferenceAttributesByName.forEach(
                    (attributeValues, attributeName) => {
                        if (refName)
                            flattenedReferences.push([
                                EntityPropertyKey.referenceAttributes(
                                    refName,
                                    attributeName
                                ),
                                attributeValues,
                            ])
                    }
                )
            } else {
                const representativeValue: EntityReferenceValue =
                    this.resolveReferenceRepresentativeValue(referencesOfName)
                flattenedReferences.push([
                    EntityPropertyKey.references(
                        referenceName.referenceName.getOrThrow()
                    ),
                    representativeValue,
                ])

                this.flattenAttributesForSingleReference(
                    referencesOfName
                ).forEach(([attributeName, attributeValue]) => {
                    if (refName)
                        flattenedReferences.push([
                            EntityPropertyKey.referenceAttributes(
                                refName,
                                attributeName
                            ),
                            attributeValue,
                        ])
                })
            }
        }

        return flattenedReferences
    }

    private resolveReferenceRepresentativeValue(
        reference: Reference
    ): EntityReferenceValue {
        const referencedPrimaryKey: number | undefined =
            reference.getReferencedPrimaryKey()
        const representativeAttributes: (
            | EntityPropertyValue
            | EntityPropertyValue[]
        )[] = []

        const globalRepresentativeAttributes = reference.referencedEntity
            ?.getIfSupported()
            ?.globalAttributes.getIfSupported()
        for (const attributeName in globalRepresentativeAttributes) {
            representativeAttributes.push(
                this.wrapRawValueIntoNativeValue(
                    globalRepresentativeAttributes.get(attributeName)
                )
            )
        }

        const localizedRepresentativeAttributes = reference.referencedEntity
            ?.getIfSupported()
            ?.localizedAttributes.getIfSupported()
        for (const attributeName in localizedRepresentativeAttributes) {
            representativeAttributes.push(
                this.wrapRawValueIntoNativeValue(
                    localizedRepresentativeAttributes.get(attributeName)
                )
            )
        }

        return new EntityReferenceValue(
            referencedPrimaryKey ?? 0,
            representativeAttributes.flat()
        )
    }

    private flattenAttributesForSingleReference(
        reference: Reference
    ): [string, EntityReferenceValue][] {
        const referencedPrimaryKey: number | undefined =
            reference.getReferencedPrimaryKey()
        const flattenedAttributes: [string, EntityReferenceValue][] = []

        const globalAttributes = reference.globalAttributes.getIfSupported()
        for (const attributeName in globalAttributes) {
            const wrappedValue: NativeValue | NativeValue[] =
                this.wrapRawValueIntoNativeValue(
                    globalAttributes.get(attributeName)
                )
            flattenedAttributes.push([
                attributeName,
                new EntityReferenceValue(
                    referencedPrimaryKey ?? 0,
                    wrappedValue instanceof Array
                        ? wrappedValue
                        : [wrappedValue]
                ),
            ])
        }
        const localizedAttributes =
            reference.localizedAttributes.getIfSupported()
        if (localizedAttributes) {
            for (const [key, locale] of localizedAttributes) {
                // this expects that we support only one locale
                const attributesInLocale = locale.attributes.getIfSupported()
                if (attributesInLocale) {
                    for (const [
                        attributeName,
                        attribute,
                    ] of attributesInLocale) {
                        const wrappedValue: NativeValue | NativeValue[] =
                            this.wrapRawValueIntoNativeValue(attribute)
                        flattenedAttributes.push([
                            attributeName,
                            new EntityReferenceValue(
                                referencedPrimaryKey,
                                wrappedValue instanceof Array
                                    ? wrappedValue
                                    : [wrappedValue]
                            ),
                        ])
                    }
                }
            }
        }
        return flattenedAttributes
    }
}
