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
            entities: result?.recordPage?.data.map((entity: any) => this.flattenEntity(entity)) || [],
            totalEntitiesCount: result?.recordPage?.totalRecordCount || 0
        }
    }

    /**
     * Converts original rich entity into simplified flat entity that is displayable in table
     */
    private flattenEntity(entity: any): any {
        const flattenedEntity: any = {}

        flattenedEntity[StaticEntityProperties.PrimaryKey] = this.deserializePropertyValue(entity[StaticEntityProperties.PrimaryKey])
        flattenedEntity[StaticEntityProperties.Parent] = this.deserializePropertyValue(entity[StaticEntityProperties.Parent])
        flattenedEntity[StaticEntityProperties.Locales] = this.deserializePropertyValue(entity[StaticEntityProperties.Locales])
        flattenedEntity[StaticEntityProperties.AllLocales] = this.deserializePropertyValue(entity[StaticEntityProperties.AllLocales])
        flattenedEntity[StaticEntityProperties.PriceInnerRecordHandling] = this.deserializePropertyValue(entity[StaticEntityProperties.PriceInnerRecordHandling])

        const globalAttributes = entity[EntityPropertyType.Attributes]?.['global'] || {}
        for (const attributeName in globalAttributes) {
            flattenedEntity[EntityPropertyType.Attributes + '.' + attributeName] = this.deserializePropertyValue(globalAttributes[attributeName])
        }
        const localizedAttributes = entity[EntityPropertyType.Attributes]?.['localized'] || {}
        for (const locale in localizedAttributes) {
            // this expects that we support only one locale
            const attributesInLocale = localizedAttributes[locale]
            for (const attributeName in attributesInLocale) {
                flattenedEntity[EntityPropertyType.Attributes + '.' + attributeName] = this.deserializePropertyValue(attributesInLocale[attributeName])
            }
        }

        const globalAssociatedData = entity[EntityPropertyType.AssociatedData]?.['global'] || {}
        for (const associatedDataName in globalAssociatedData) {
            flattenedEntity[EntityPropertyType.AssociatedData + '.' + associatedDataName] = this.deserializePropertyValue(globalAssociatedData[associatedDataName])
        }
        const localizedAssociatedData = entity[EntityPropertyType.AssociatedData]?.['localized'] || {}
        for (const locale in localizedAssociatedData) {
            // this expects that we support only one locale
            const associatedDataInLocale = localizedAssociatedData[locale]
            for (const associatedDataName in associatedDataInLocale) {
                flattenedEntity[EntityPropertyType.AssociatedData + '.' + associatedDataName] = this.deserializePropertyValue(associatedDataInLocale[associatedDataName])
            }
        }

        const references = entity[EntityPropertyType.References] || {}
        for (const referenceName in references) {
            const referencesOfName = references[referenceName]
            if (referencesOfName instanceof Array) {
                flattenedEntity[EntityPropertyType.References + '.' + referenceName] = this.deserializePropertyValue(referencesOfName.map(it => it['referencedPrimaryKey']))
            } else {
                flattenedEntity[EntityPropertyType.References + '.' + referenceName] = this.deserializePropertyValue(referencesOfName['referencedPrimaryKey'])
            }
        }

        return flattenedEntity
    }

    private deserializePropertyValue(value?: any): string {
        // return value
        if (value === undefined || value === null) {
            return ''
        }
        if (value instanceof Array) {
            return `[${value.join(', ')}]`
        } else if (value instanceof Object) {
            return JSON.stringify(value)
        } else {
            return value.toString()
        }
    }
}
