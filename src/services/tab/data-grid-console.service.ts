import { inject, InjectionKey } from 'vue'
import { DataGridDataPointer, EntityPropertyType, StaticEntityProperties } from '@/model/tab/data-grid-console'
import { QueryLanguage } from '@/model/lab'
import { DataGridQueryResult, QueryExecutor } from '@/services/tab/data-grid-console/query-executor'
import { QueryBuilder } from '@/services/tab/data-grid-console/query-builder'
import { EvitaQLQueryBuilder } from '@/services/tab/data-grid-console/evitaql-query-builder'
import { EvitaQLQueryExecutor } from '@/services/tab/data-grid-console/evitaql-query-executor'
import { LabService } from '@/services/lab.service'
import { AttributeSchemaUnion, EntitySchema } from '@/model/evitadb/schema'

export const key: InjectionKey<DataGridConsoleService> = Symbol()

/**
 * Service for running the data grid console component.
 */
export class DataGridConsoleService {
    readonly labService: LabService
    readonly queryBuilders: Map<QueryLanguage, QueryBuilder>
    readonly queryExecutors: Map<QueryLanguage, QueryExecutor>

    constructor(labService: LabService) {
        this.labService = labService

        this.queryBuilders = new Map<QueryLanguage, QueryBuilder>()
        this.queryBuilders.set(QueryLanguage.EvitaQL, new EvitaQLQueryBuilder(this.labService))

        this.queryExecutors = new Map<QueryLanguage, QueryExecutor>()
        this.queryExecutors.set(QueryLanguage.EvitaQL, new EvitaQLQueryExecutor(this.labService))
    }

    /**
     * Builds query from arguments into desired language, executes it, and returns result.
     *
     * @param dataPointer points to collection where to fetch data from
     * @param language language of query, defines how query will be built and executed
     * @param filterBy filter by part of query, depends on language
     * @param orderBy order by part of query, depends on language
     * @param dataLocale locale of data in query, if undefined, only global data are returned
     * @param requiredData defines which data should be fetched from collection as entity fields
     * @param pageNumber page number of query result
     * @param pageSize page size of query result
     */
    async executeQuery(dataPointer: DataGridDataPointer,
                       language: QueryLanguage,
                       filterBy: string,
                       orderBy: string,
                       dataLocale: string | undefined,
                       requiredData: string[],
                       pageNumber: number,
                       pageSize: number): Promise<DataGridQueryResult> {
        const queryBuilder: QueryBuilder = this.getQueryBuilder(language)
        const queryExecutor: QueryExecutor = this.getQueryExecutor(language)
        const query: string = await queryBuilder.buildQuery(dataPointer, filterBy, orderBy, dataLocale, requiredData, pageNumber, pageSize)
        return queryExecutor.executeQuery(dataPointer, query)
    }

    /**
     * Builds order by clause from selected grid columns.
     *
     * @param dataPointer points to collection where to fetch data from
     * @param language language of query, defines how query will be built and executed
     * @param columns columns that represents by which entity properties we want to sort
     */
    async buildOrderByFromGridColumns(dataPointer: DataGridDataPointer, language: QueryLanguage, columns: any[]): Promise<string> {
        const entitySchema: EntitySchema = await this.labService.getEntitySchema(dataPointer.connection, dataPointer.catalogName, dataPointer.entityType)
        const queryBuilder: QueryBuilder = this.getQueryBuilder(language)

        const orderBy: string[] = []
        for (const column of columns) {
            const [propertyType, propertyName] = this.deconstructEntityProperty(column.key)
            if (propertyType === EntityPropertyType.Attributes) {
                const attributeSchema: AttributeSchemaUnion | undefined = entitySchema.allAttributes
                    .find(attributeSchema => attributeSchema.nameVariants.camelCase === propertyName)
                if (attributeSchema === undefined) {
                    throw new Error(`Entity ${entitySchema.name} does not have attribute ${propertyName}.`)
                }

                orderBy.push(queryBuilder.buildAttributeNaturalConstraint(attributeSchema, column.order))
            } else {
                throw new Error(`Entity property ${column.key} is not supported to be sortable.`)
            }
        }

        return orderBy.join(', ')
    }

    /**
     * Returns a list of locales in which data are stored in given collection.
     */
    async getDataLocales(dataPointer: DataGridDataPointer): Promise<string[]> {
        const entitySchema: EntitySchema = await this.labService.getEntitySchema(dataPointer.connection, dataPointer.catalogName, dataPointer.entityType)
        return entitySchema.locales
    }

    /**
     * Builds a list of all possible entity properties for entities of given schema.
     */
    async getEntityProperties(dataPointer: DataGridDataPointer): Promise<string[]> {
        const entitySchema: EntitySchema = await this.labService.getEntitySchema(dataPointer.connection, dataPointer.catalogName, dataPointer.entityType)

        const entityProperties: string[] = []

        entityProperties.push(StaticEntityProperties.PrimaryKey)
        if (entitySchema.withHierarchy) {
            entityProperties.push(this.constructEntityProperty(EntityPropertyType.Entity, StaticEntityProperties.Parent))
        }
        if (entitySchema.locales.length > 0) {
            entityProperties.push(this.constructEntityProperty(EntityPropertyType.Entity, StaticEntityProperties.Locales))
            entityProperties.push(this.constructEntityProperty(EntityPropertyType.Entity, StaticEntityProperties.AllLocales))
        }
        if (entitySchema.withPrice) {
            entityProperties.push(this.constructEntityProperty(EntityPropertyType.Entity, StaticEntityProperties.PriceInnerRecordHandling))
        }
        for (const attributeSchema of entitySchema.allAttributes) {
            entityProperties.push(this.constructEntityProperty(EntityPropertyType.Attributes, attributeSchema.nameVariants.camelCase))
        }
        for (const associatedDataSchema of entitySchema.allAssociatedData) {
            entityProperties.push(this.constructEntityProperty(EntityPropertyType.AssociatedData, associatedDataSchema.nameVariants.camelCase))
        }
        for (const referenceSchema of entitySchema.allReferences) {
            entityProperties.push(this.constructEntityProperty(EntityPropertyType.References, referenceSchema.nameVariants.camelCase))
        }

        return entityProperties
    }

    /**
     * Determines if property is sortable based on its type and potentially entity schema.
     */
    async isEntityPropertySortable(dataPointer: DataGridDataPointer, entityProperty: string): Promise<boolean> {
        const entitySchema: EntitySchema = await this.labService.getEntitySchema(dataPointer.connection, dataPointer.catalogName, dataPointer.entityType)

        const [propertyType, propertyName] = this.deconstructEntityProperty(entityProperty)
        if (propertyType !== EntityPropertyType.Attributes) {
            return false
        }

        const attributeSchema: AttributeSchemaUnion | undefined = entitySchema.allAttributes
            .find(attributeSchema => attributeSchema.nameVariants.camelCase === propertyName)
        if (attributeSchema === undefined) {
            throw new Error(`Attribute ${propertyName} not found in entity schema ${entitySchema.name}.`)
        }
        return attributeSchema.sortable
    }

    private getQueryBuilder(language: QueryLanguage): QueryBuilder {
        const queryBuilder: QueryBuilder | undefined = this.queryBuilders.get(language)
        if (queryBuilder === undefined) {
            throw new Error(`Query builder for language ${language} is not registered.`)
        }
        return queryBuilder
    }

    private getQueryExecutor(language: QueryLanguage): QueryExecutor {
        const queryExecutor: QueryExecutor | undefined = this.queryExecutors.get(language)
        if (queryExecutor === undefined) {
            throw new Error(`Query executor for language ${language} is not registered.`)
        }
        return queryExecutor
    }

    /**
     * Builds a single entity property in correct format.
     * @private
     */
    private constructEntityProperty(propertyType: EntityPropertyType, propertyName: string): string {
        if (propertyType === EntityPropertyType.Entity) {
            return propertyName
        }
        return `${propertyType}.${propertyName}`
    }

    /**
     * Deconstructs entity property into its type and name.
     * @private
     */
    private deconstructEntityProperty(entityProperty: string): [EntityPropertyType, string] {
        if (entityProperty.startsWith(EntityPropertyType.Attributes)) {
            return [EntityPropertyType.Attributes, entityProperty.substring(EntityPropertyType.Attributes.length + 1)]
        } else if (entityProperty.startsWith(EntityPropertyType.AssociatedData)) {
            return [EntityPropertyType.AssociatedData, entityProperty.substring(EntityPropertyType.AssociatedData.length + 1)]
        } else if (entityProperty.startsWith(EntityPropertyType.References)) {
            return [EntityPropertyType.References, entityProperty.substring(EntityPropertyType.References.length + 1)]
        } else {
            return [EntityPropertyType.Entity, entityProperty]
        }
    }
}

export const useDataGridConsoleService = (): DataGridConsoleService => {
    return inject(key) as DataGridConsoleService
}
