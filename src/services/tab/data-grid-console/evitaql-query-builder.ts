import { QueryBuilder } from '@/services/tab/data-grid-console/query-builder'
import { DataGridDataPointer, EntityPropertyType, StaticEntityProperties } from '@/model/tab/data-grid-console'
import { LabService } from '@/services/lab.service'
import { AttributeSchemaUnion, EntitySchema } from '@/model/evitadb/schema'

/**
 * Query builder for EvitaQL language.
 */
export class EvitaQLQueryBuilder implements QueryBuilder {
    readonly labService: LabService

    constructor(labService: LabService) {
        this.labService = labService
    }

    async buildQuery(dataPointer: DataGridDataPointer,
                     filterBy: string,
                     orderBy: string,
                     dataLocale: string | undefined,
                     requiredData: string[],
                     pageNumber: number,
                     pageSize: number): Promise<string> {
        const entitySchema: EntitySchema = await this.labService.getEntitySchema(dataPointer.connection, dataPointer.catalogName, dataPointer.entityType)

        // todo lho
        let query = 'query('

        const constraints: string[] = []

        constraints.push(`collection('${dataPointer.entityType}')`)

        if (filterBy) {
            constraints.push(`filterBy(${filterBy})`)
        }

        if (orderBy) {
            constraints.push(`orderBy(${orderBy})`)
        }

        const requireConstraints: string[] = []
        requireConstraints.push(`page(${pageNumber}, ${pageSize})`)

        const entityFetchRequires: string[] = []

        const requiredAttributes = requiredData
            .filter(it => it.startsWith(EntityPropertyType.Attributes))
            .map(it => it.substring(EntityPropertyType.Attributes.length + 1))
            .map(it => {
                const attributeSchema = entitySchema.allAttributes.find(attributeSchema => attributeSchema.nameVariants.camelCase === it)
                if (attributeSchema === undefined) {
                    throw new Error(`Could not find attribute '${it}' in '${dataPointer.entityType}'.`)
                }
                return `'${attributeSchema.name}'`
            })
        if (requiredAttributes.length > 0) {
            entityFetchRequires.push(`attributeContent(${requiredAttributes.join(',')})`)
        }

        if (entityFetchRequires.length > 0 ||
            requiredData.concat(StaticEntityProperties.Parent, StaticEntityProperties.Locales, StaticEntityProperties.AllLocales, StaticEntityProperties.PriceInnerRecordHandling)) {
            // we need to specify locale only if we want data
            if (dataLocale !== undefined && dataLocale !== 'none') {
                entityFetchRequires.push(`dataInLocales('${dataLocale}')`)
            }

            requireConstraints.push(`entityFetch(${entityFetchRequires.join(',')})`)
        }

        if (requireConstraints.length > 0) {
            constraints.push(`require(${requireConstraints.join(',')})`)
        }

        query += constraints.join(",")
        query += ')'

        return query
    }

    buildAttributeNaturalConstraint(attributeSchema: AttributeSchemaUnion, orderDirection: string): string {
        return `attributeNatural('${attributeSchema.name}', ${orderDirection.toUpperCase()})`
    }

}
