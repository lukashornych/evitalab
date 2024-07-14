import { QueryExecutor } from '@/modules/entity-viewer/viewer/service/QueryExecutor'
import { EvitaDBDriver } from '@/modules/connection/driver/EvitaDBDriver'
import { ConnectionService } from '@/modules/connection/service/ConnectionService'
import { EntityViewerDataPointer } from '@/modules/entity-viewer/viewer/model/EntityViewerDataPointer'
import { QueryResult } from '@/modules/entity-viewer/viewer/model/QueryResult'
import { Response } from '@/modules/connection/model/data/Response'
import { PaginatedList } from '@/modules/connection/model/data/PaginatedList'
import { FlatEntity } from '@/modules/entity-viewer/viewer/model/FlatEntity'
import { WritableEntityProperty } from '@/modules/entity-viewer/viewer/model/WritableEntityProperty'
import { EntityPropertyKey } from '@/modules/entity-viewer/viewer/model/EntityPropertyKey'
import { StaticEntityProperties } from '@/modules/entity-viewer/viewer/model/StaticEntityProperties'
import { NativeValue } from '@/modules/entity-viewer/viewer/model/entity-property-value/NativeValue'
import { EntityReferenceValue } from '@/modules/entity-viewer/viewer/model/entity-property-value/EntityReferenceValue'
import { EntityPropertyType } from '@/modules/entity-viewer/viewer/model/EntityPropertyType'
import { EntityPrices } from '@/modules/entity-viewer/viewer/model/entity-property-value/EntityPrices'
import { EntityPrice } from '@/modules/entity-viewer/viewer/model/entity-property-value/EntityPrice'
import { EntityPropertyValue } from '@/modules/entity-viewer/viewer/model/EntityPropertyValue'
import { EvitaDBDriverResolver } from '@/modules/connection/driver/EvitaDBDriverResolver'

/**
 * Query executor for EvitaQL language.
 */
export class EvitaQLQueryExecutor extends QueryExecutor {
    private readonly evitaDBDriverResolver: EvitaDBDriverResolver

    constructor(connectionService: ConnectionService, evitaDBDriverResolver: EvitaDBDriverResolver) {
        super(connectionService)
        this.evitaDBDriverResolver = evitaDBDriverResolver
    }

    async executeQuery(dataPointer: EntityViewerDataPointer, query: string): Promise<QueryResult> {
        const evitaDBDriver: EvitaDBDriver = await this.evitaDBDriverResolver.resolveDriver(dataPointer.connection)
        const result: Response = await evitaDBDriver.query(dataPointer.connection, dataPointer.catalogName, query)
        const paginatedList = result.recordPage.map(it => it as PaginatedList)
        return {
            entities: paginatedList.getIfSupported()
                ?.data
                .getIfSupported()
                ?.map((entity: any) => this.flattenEntity(entity)) || [],
            totalEntitiesCount: paginatedList.getIfSupported()
                ?.totalRecordCount
                ?.getIfSupported() || 0
        }
    }

    /**
     * Converts original rich entity into simplified flat entity that is displayable in table
     */
    private flattenEntity(entity: any): FlatEntity {
        const flattenedProperties: (WritableEntityProperty | undefined)[] = []

        flattenedProperties.push([EntityPropertyKey.entity(StaticEntityProperties.PrimaryKey), this.wrapRawValueIntoNativeValue(entity[StaticEntityProperties.PrimaryKey])])
        flattenedProperties.push(this.flattenParent(entity))
        flattenedProperties.push([EntityPropertyKey.entity(StaticEntityProperties.Locales), this.wrapRawValueIntoNativeValue(entity[StaticEntityProperties.Locales] || [])])
        flattenedProperties.push([EntityPropertyKey.entity(StaticEntityProperties.AllLocales), this.wrapRawValueIntoNativeValue(entity[StaticEntityProperties.AllLocales] || [])])
        flattenedProperties.push([EntityPropertyKey.entity(StaticEntityProperties.PriceInnerRecordHandling), this.wrapRawValueIntoNativeValue(entity[StaticEntityProperties.PriceInnerRecordHandling] || 'UNKNOWN')])

        flattenedProperties.push(...this.flattenAttributes(entity))
        flattenedProperties.push(...this.flattenAssociatedData(entity))
        flattenedProperties.push(this.flattenPrices(entity))
        flattenedProperties.push(...this.flattenReferences(entity))

        return this.createFlatEntity(flattenedProperties)
    }

    private flattenParent(entity: any): WritableEntityProperty | undefined {
        const parentEntity: any | undefined = entity['parentEntity']
        if (parentEntity == undefined) {
            return undefined
        }

        const parentPrimaryKey: number = parentEntity[StaticEntityProperties.PrimaryKey]

        const representativeAttributes: (NativeValue | NativeValue[])[] = []
        const globalRepresentativeAttributes = parentEntity?.['attributes']?.['global'] || {}
        for (const attributeName in globalRepresentativeAttributes) {
            representativeAttributes.push(this.wrapRawValueIntoNativeValue(globalRepresentativeAttributes[attributeName]))
        }
        const localizedRepresentativeAttributes = parentEntity?.['attributes']?.['localized'] || {}
        for (const attributeName in localizedRepresentativeAttributes) {
            representativeAttributes.push(this.wrapRawValueIntoNativeValue(localizedRepresentativeAttributes[attributeName]))
        }

        const parentReference: EntityReferenceValue = new EntityReferenceValue(parentPrimaryKey, representativeAttributes.flat())
        return [EntityPropertyKey.entity(StaticEntityProperties.ParentPrimaryKey), parentReference]
    }

    private flattenAttributes(entity: any): WritableEntityProperty[] {
        const flattenedAttributes: WritableEntityProperty[] = []

        const globalAttributes = entity[EntityPropertyType.Attributes]?.['global'] || {}
        for (const attributeName in globalAttributes) {
            flattenedAttributes.push([EntityPropertyKey.attributes(attributeName), this.wrapRawValueIntoNativeValue(globalAttributes[attributeName])])
        }
        const localizedAttributes = entity[EntityPropertyType.Attributes]?.['localized'] || {}
        for (const locale in localizedAttributes) {
            // this expects that we support only one locale
            const attributesInLocale = localizedAttributes[locale]
            for (const attributeName in attributesInLocale) {
                flattenedAttributes.push([EntityPropertyKey.attributes(attributeName), this.wrapRawValueIntoNativeValue(attributesInLocale[attributeName])])
            }
        }

        return flattenedAttributes
    }

    private flattenAssociatedData(entity: any): WritableEntityProperty[] {
        const flattenedAssociatedData: WritableEntityProperty[] = []

        const globalAssociatedData = entity[EntityPropertyType.AssociatedData]?.['global'] || {}
        for (const associatedDataName in globalAssociatedData) {
            flattenedAssociatedData.push([EntityPropertyKey.associatedData(associatedDataName), this.wrapRawValueIntoNativeValue(globalAssociatedData[associatedDataName])])
        }
        const localizedAssociatedData = entity[EntityPropertyType.AssociatedData]?.['localized'] || {}
        for (const locale in localizedAssociatedData) {
            // this expects that we support only one locale
            const associatedDataInLocale = localizedAssociatedData[locale]
            for (const associatedDataName in associatedDataInLocale) {
                flattenedAssociatedData.push([EntityPropertyKey.associatedData(associatedDataName), this.wrapRawValueIntoNativeValue(associatedDataInLocale[associatedDataName])])
            }
        }

        return flattenedAssociatedData
    }

    private flattenPrices(entity: any): WritableEntityProperty | undefined {
        const priceForSale: any | undefined = entity['priceForSale']
        const prices: any[] | undefined = entity[EntityPropertyType.Prices]
        if (priceForSale == undefined && prices == undefined) {
            return undefined
        }

        const entityPrices: EntityPrices = new EntityPrices(
            priceForSale != undefined ? EntityPrice.fromJson(priceForSale) : undefined,
            prices?.map(it => EntityPrice.fromJson(it)) || []
        )
        return [EntityPropertyKey.prices(), entityPrices]
    }

    private flattenReferences(entity: any): WritableEntityProperty[] {
        const flattenedReferences: WritableEntityProperty[] = []

        const references = entity[EntityPropertyType.References] || {}
        for (const referenceName in references) {
            const referencesOfName = references[referenceName]
            if (referencesOfName == undefined) {
                continue
            }
            if (referencesOfName instanceof Array) {
                const representativeValues: EntityReferenceValue[] = referencesOfName
                    .map(referenceOfName => this.resolveReferenceRepresentativeValue(referenceOfName))

                flattenedReferences.push([EntityPropertyKey.references(referenceName), representativeValues])

                const mergedReferenceAttributesByName: Map<string, EntityReferenceValue[]> = referencesOfName
                    .map(referenceOfName => this.flattenAttributesForSingleReference(referenceOfName))
                    .reduce(
                        (accumulator, referenceAttributes) => {
                            referenceAttributes.forEach(([attributeName, attributeValue]) => {
                                let attributes = accumulator.get(attributeName)
                                if (attributes == undefined) {
                                    attributes = []
                                    accumulator.set(attributeName, attributes)
                                }
                                attributes.push(attributeValue)
                            })
                            return accumulator
                        },
                        new Map<string, EntityReferenceValue[]>()
                    )
                mergedReferenceAttributesByName.forEach((attributeValues, attributeName) => {
                    flattenedReferences.push([EntityPropertyKey.referenceAttributes(referenceName, attributeName), attributeValues])
                })
            } else {
                const representativeValue: EntityReferenceValue = this.resolveReferenceRepresentativeValue(referencesOfName)
                flattenedReferences.push([EntityPropertyKey.references(referenceName), representativeValue])

                this.flattenAttributesForSingleReference(referencesOfName).forEach(([attributeName, attributeValue]) => {
                    flattenedReferences.push([EntityPropertyKey.referenceAttributes(referenceName, attributeName), attributeValue])
                })
            }
        }

        return flattenedReferences
    }

    private resolveReferenceRepresentativeValue(reference: any): EntityReferenceValue {
        const referencedPrimaryKey: number = reference['referencedPrimaryKey']
        const representativeAttributes: (EntityPropertyValue | EntityPropertyValue[])[] = []

        const globalRepresentativeAttributes = reference['referencedEntity']?.[EntityPropertyType.Attributes]?.['global'] || {}
        for (const attributeName in globalRepresentativeAttributes) {
            representativeAttributes.push(this.wrapRawValueIntoNativeValue(globalRepresentativeAttributes[attributeName]))
        }

        const localizedRepresentativeAttributes = reference['referencedEntity']?.[EntityPropertyType.Attributes]?.['localized'] || {}
        for (const attributeName in localizedRepresentativeAttributes) {
            representativeAttributes.push(this.wrapRawValueIntoNativeValue(localizedRepresentativeAttributes[attributeName]))
        }

        return new EntityReferenceValue(referencedPrimaryKey, representativeAttributes.flat())
    }

    private flattenAttributesForSingleReference(reference: any): [string, EntityReferenceValue][] {
        const referencedPrimaryKey: number = reference['referencedPrimaryKey']
        const flattenedAttributes: [string, EntityReferenceValue][] = []

        const globalAttributes = reference[EntityPropertyType.Attributes]?.['global'] || {}
        for (const attributeName in globalAttributes) {
            const wrappedValue: NativeValue | NativeValue[] = this.wrapRawValueIntoNativeValue(globalAttributes[attributeName])
            flattenedAttributes.push([attributeName, new EntityReferenceValue(referencedPrimaryKey, wrappedValue instanceof Array ? wrappedValue : [wrappedValue])])
        }
        const localizedAttributes = reference[EntityPropertyType.Attributes]?.['localized'] || {}
        for (const locale in localizedAttributes) {
            // this expects that we support only one locale
            const attributesInLocale = localizedAttributes[locale]
            for (const attributeName in attributesInLocale) {
                const wrappedValue: NativeValue | NativeValue[] = this.wrapRawValueIntoNativeValue(attributesInLocale[attributeName])
                flattenedAttributes.push([attributeName, new EntityReferenceValue(referencedPrimaryKey, wrappedValue instanceof Array ? wrappedValue : [wrappedValue])])
            }
        }

        return flattenedAttributes
    }
}
