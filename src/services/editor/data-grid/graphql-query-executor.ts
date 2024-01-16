import { QueryExecutor } from '@/services/editor/data-grid/query-executor'
import { LabService } from '@/services/lab.service'
import {
    DataGridDataPointer, EntityPrice, EntityPrices, EntityProperty, EntityPropertyKey,
    EntityPropertyType, EntityReferenceValue, FlatEntity,
    QueryResult,
    StaticEntityProperties
} from '@/model/editor/data-grid'
import { GraphQLClient } from '@/services/graphql-client'
import { QueryError } from '@/services/evitadb-client'
import { UnexpectedError } from '@/model/lab'

/**
 * Query executor for GraphQL language.
 */
export class GraphQLQueryExecutor extends QueryExecutor {
    private readonly graphQLClient: GraphQLClient

    constructor(labService: LabService, graphQLClient: GraphQLClient) {
        super(labService)
        this.graphQLClient = graphQLClient
    }

    async executeQuery(dataPointer: DataGridDataPointer, query: string): Promise<QueryResult> {
        const result = await this.graphQLClient.fetch(dataPointer.connection, dataPointer.catalogName, query)
        if (result.errors) {
            throw new QueryError(dataPointer.connection, result.errors)
        }

        return {
            entities: result?.data?.q?.recordPage?.data.map((entity: any) => this.flattenEntity(dataPointer, entity)) || [],
            totalEntitiesCount: result?.data?.q?.recordPage?.totalRecordCount || 0
        }
    }

    /**
     * Converts original rich entity into simplified flat entity that is displayable in table
     */
    private flattenEntity(dataPointer: DataGridDataPointer, entity: any): FlatEntity {
        const flattenedEntity: (EntityProperty | undefined)[] = []

        flattenedEntity.push([EntityPropertyKey.entity(StaticEntityProperties.PrimaryKey), this.wrapRawValueIntoNativeValue(entity[StaticEntityProperties.PrimaryKey])])
        flattenedEntity.push(this.flattenParent(dataPointer, entity))
        flattenedEntity.push([EntityPropertyKey.entity(StaticEntityProperties.Locales), this.wrapRawValueIntoNativeValue(entity[StaticEntityProperties.Locales])])
        flattenedEntity.push([EntityPropertyKey.entity(StaticEntityProperties.AllLocales), this.wrapRawValueIntoNativeValue(entity[StaticEntityProperties.AllLocales])])
        flattenedEntity.push([EntityPropertyKey.entity(StaticEntityProperties.PriceInnerRecordHandling), this.wrapRawValueIntoNativeValue(entity[StaticEntityProperties.PriceInnerRecordHandling])])

        flattenedEntity.push(...this.flattenAttributes(entity))
        flattenedEntity.push(...this.flattenAssociatedData(entity))
        flattenedEntity.push(this.flattenPrices(entity))
        flattenedEntity.push(...this.flattenReferences(entity))

        return flattenedEntity.filter(it => it != undefined) as FlatEntity
    }

    private flattenParent(dataPointer: DataGridDataPointer, entity: any): EntityProperty | undefined {
        const parentEntities: any[] | undefined = entity['parents']
        if (!parentEntities || parentEntities.length == 0) {
            return undefined
        }
        if (parentEntities.length > 1) {
            throw new UnexpectedError(dataPointer.connection, `There are more than one parent entity.`)
        }
        const parentEntity: any = parentEntities[0]

        const parentPrimaryKey: number = parentEntity[StaticEntityProperties.PrimaryKey]

        const representativeAttributes: any[] = []
        const attributes = parentEntity[EntityPropertyType.Attributes] || {}
        for (const attributeName in attributes) {
            representativeAttributes.push(attributes[attributeName])
        }

        const parentReference: EntityReferenceValue = new EntityReferenceValue(parentPrimaryKey, representativeAttributes)
        return [EntityPropertyKey.entity(StaticEntityProperties.ParentPrimaryKey), parentReference]
    }

    private flattenAttributes(entity: any): EntityProperty[] {
        const flattenedAttributes: EntityProperty[] = []

        const attributes = entity[EntityPropertyType.Attributes] || {}
        for (const attributeName in attributes) {
            flattenedAttributes.push([EntityPropertyKey.attributes(attributeName), this.wrapRawValueIntoNativeValue(attributes[attributeName])])
        }

        return flattenedAttributes
    }

    private flattenAssociatedData(entity: any): EntityProperty[] {
        const flattenedAssociatedData: EntityProperty[] = []

        const associatedData = entity[EntityPropertyType.AssociatedData] || {}
        for (const associatedDataName in associatedData) {
            flattenedAssociatedData.push([EntityPropertyKey.associatedData(associatedDataName), this.wrapRawValueIntoNativeValue(associatedData[associatedDataName])])
        }

        return flattenedAssociatedData
    }

    private flattenPrices(entity: any): EntityProperty | undefined {
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

    private flattenReferences(entity: any): EntityProperty[] {
        const flattenedReferences: EntityProperty[] = []

        const references = Object.keys(entity).filter((it: string) => it.startsWith('reference_'))
        for (const referenceAlias of references) {
            const referenceName = referenceAlias.split('_')[1]
            const referencesOfName = entity[referenceAlias]
            if (!referencesOfName) {
                continue
            }
            if (referencesOfName instanceof Array) {
                const representativeValues: EntityReferenceValue[] = referencesOfName
                    .map(referenceOfName => this.resolveReferenceRepresentativeValue(referenceOfName))

                flattenedReferences.push([EntityPropertyKey.references(referenceName), representativeValues])
            } else {
                const representativeValue: EntityReferenceValue = this.resolveReferenceRepresentativeValue(referencesOfName)
                flattenedReferences.push([EntityPropertyKey.references(referenceName), representativeValue])
            }
        }

        return flattenedReferences
    }

    private resolveReferenceRepresentativeValue(reference: any): EntityReferenceValue {
        const referencedPrimaryKey: number = reference['referencedPrimaryKey']
        const representativeAttributes: any[] = []

        const attributes = reference['referencedEntity']?.[EntityPropertyType.Attributes] || {}
        for (const attributeName in attributes) {
            representativeAttributes.push(attributes[attributeName])
        }

        return new EntityReferenceValue(referencedPrimaryKey, representativeAttributes)
    }
}
