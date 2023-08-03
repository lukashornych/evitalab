import { DataGridQueryResult, QueryExecutor } from '@/services/tab/data-grid-console/query-executor'
import ky from 'ky'
import { LabService } from '@/services/lab.service'
import { DataGridDataPointer, EntityPropertyType, StaticEntityProperties } from '@/model/tab/data-grid-console'

/**
 * Query executor for EvitaQL language.
 */
export class EvitaQLQueryExecutor implements QueryExecutor {
    readonly labService: LabService

    constructor(labService: LabService) {
        this.labService = labService
    }

    async executeQuery(dataPointer: DataGridDataPointer, query: string): Promise<DataGridQueryResult> {
        const urlCatalogName: string = (await this.labService.getCatalogSchema(dataPointer.connection, dataPointer.catalogName))
            .nameVariants
            .kebabCase

        const result = await ky.post(
            `${dataPointer.connection.restUrl}/${urlCatalogName}/entity/query`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ query })
            },
        )
            .json()

        return {
            entities: result?.recordPage?.data.map(this.flattenEntity) || [],
            totalEntitiesCount: result?.recordPage?.totalRecordCount || 0
        }
    }

    /**
     * Converts original rich entity into simplified flat entity that is displayable in table
     */
    private flattenEntity(entity: any): any {
        // todo lho proper formatting of objects and arrays

        const flattenedEntity: any = {}

        flattenedEntity[StaticEntityProperties.PrimaryKey] = entity[StaticEntityProperties.PrimaryKey]
        flattenedEntity[StaticEntityProperties.Parent] = entity[StaticEntityProperties.Parent]
        flattenedEntity[StaticEntityProperties.Locales] = entity[StaticEntityProperties.Locales]
        flattenedEntity[StaticEntityProperties.AllLocales] = entity[StaticEntityProperties.AllLocales]
        flattenedEntity[StaticEntityProperties.PriceInnerRecordHandling] = entity[StaticEntityProperties.PriceInnerRecordHandling]

        const globalAttributes = entity[EntityPropertyType.Attributes]?.['global'] || {}
        for (const attributeName in globalAttributes) {
            flattenedEntity[EntityPropertyType.Attributes + '.' + attributeName] = globalAttributes[attributeName]
        }
        const localizedAttributes = entity[EntityPropertyType.Attributes]?.['localized'] || {}
        for (const locale in localizedAttributes) {
            // this expects that we support only one locale
            const attributesInLocale = localizedAttributes[locale]
            for (const attributeName in attributesInLocale) {
                flattenedEntity[EntityPropertyType.Attributes + '.' + attributeName] = attributesInLocale[attributeName]
            }
        }

        const globalAssociatedData = entity[EntityPropertyType.AssociatedData]?.['global'] || {}
        for (const associatedDataName in globalAssociatedData) {
            const associatedDataValue = globalAssociatedData[associatedDataName]
            if (associatedDataValue instanceof Object) {
                flattenedEntity[EntityPropertyType.AssociatedData + '.' + associatedDataName] = JSON.stringify(associatedDataValue)
            } else {
                flattenedEntity[EntityPropertyType.AssociatedData + '.' + associatedDataName] = associatedDataValue
            }
        }
        const localizedAssociatedData = entity[EntityPropertyType.AssociatedData]?.['localized'] || {}
        for (const locale in localizedAssociatedData) {
            // this expects that we support only one locale
            const associatedDataInLocale = localizedAssociatedData[locale]
            for (const associatedDataName in associatedDataInLocale) {
                const associatedDataValue = associatedDataInLocale[associatedDataName]
                if (associatedDataValue instanceof Object) {
                    flattenedEntity[EntityPropertyType.AssociatedData + '.' + associatedDataName] = JSON.stringify(associatedDataValue)
                } else {
                    flattenedEntity[EntityPropertyType.AssociatedData + '.' + associatedDataName] = associatedDataValue
                }
            }
        }

        const references = entity[EntityPropertyType.References] || {}
        for (const referenceName in references) {
            const referencesOfName = references[referenceName]
            if (referencesOfName instanceof Array) {
                flattenedEntity[EntityPropertyType.References + '.' + referenceName] = referencesOfName.map(it => it['referencedPrimaryKey'])
            } else {
                flattenedEntity[EntityPropertyType.References + '.' + referenceName] = referencesOfName['referencedPrimaryKey']
            }
        }

        return flattenedEntity
    }
}
