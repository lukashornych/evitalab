import { QueryBuilder } from '@/services/editor/data-grid/query-builder'
import {
    DataGridDataPointer,
    EntityPropertyKey,
    EntityPropertyType,
    StaticEntityProperties
} from '@/model/editor/data-grid'
import { LabService } from '@/services/lab.service'
import {
    AssociatedDataSchema,
    AttributeSchemaUnion,
    EntitySchema,
    QueryPriceMode,
    ReferenceSchema
} from '@/model/evitadb'
import { UnexpectedError } from '@/model/lab'

const priceInPriceListsConstraintPattern = /priceInPriceLists\s*:\s*\[?\s*"[A-Za-z0-9_.\-~]+"/
const priceInCurrencyConstraintPattern = /priceInCurrency\s*:\s*[A-Z_]+/
const priceObjectFieldsTemplate =
    `
    {
        priceId
        priceList
        currency
        innerRecordId
        sellable
        validity
        priceWithoutTax
        priceWithTax
        taxRate
    }
    `

/**
 * Query builder for GraphQL language.
 */
export class GraphQLQueryBuilder implements QueryBuilder {
    private readonly labService: LabService

    constructor(labService: LabService) {
        this.labService = labService
    }

    async buildQuery(dataPointer: DataGridDataPointer,
                     filterBy: string,
                     orderBy: string,
                     dataLocale: string | undefined,
                     priceType: QueryPriceMode | undefined,
                     requiredData: EntityPropertyKey[],
                     pageNumber: number,
                     pageSize: number): Promise<string> {
        const entitySchema: EntitySchema = await this.labService.getEntitySchema(dataPointer.connection, dataPointer.catalogName, dataPointer.entityType)

        const headerArguments: string[] = []

        const filterByContainer: string[] = []
        if (filterBy.length > 0) {
            filterByContainer.push(filterBy)
        }
        if (dataLocale != undefined) {
            filterByContainer.push(`entityLocaleEquals: ${dataLocale}`)
        }
        if (filterByContainer.length > 0) {
            headerArguments.push(`filterBy: { ${filterByContainer.join(',')} }`)
        }

        if (orderBy.length > 0) {
            headerArguments.push(`orderBy: { ${orderBy} }`)
        }

        if (priceType != undefined) {
            headerArguments.push(`require: { priceType: ${priceType} }`)
        }

        const groupedPropertyKeys: Map<EntityPropertyType, string[]> = new Map<EntityPropertyType, string[]>()
        for (const propertyKey of requiredData) {
            let group: string[] | undefined = groupedPropertyKeys.get(propertyKey.type)
            if (group == undefined) {
                group = []
                groupedPropertyKeys.set(propertyKey.type, group)
            }
            group.push(propertyKey.supportsName() ? propertyKey.name : '')
        }

        const entityOutputFields: string[] = []
        for (const [propertyType, requiredDataInGroup] of groupedPropertyKeys) {
            switch (propertyType) {
                case EntityPropertyType.Entity:
                    this.buildEntityBodyProperties(requiredDataInGroup, entitySchema, dataLocale, entityOutputFields)
                    break
                case EntityPropertyType.Attributes:
                    this.buildAttributesProperty(requiredDataInGroup, entitySchema, dataLocale, entityOutputFields)
                    break
                case EntityPropertyType.AssociatedData:
                    this.buildAssociatedDataProperty(requiredDataInGroup, entitySchema, dataLocale, entityOutputFields)
                    break
                case EntityPropertyType.Prices:
                    this.buildPricesProperty(requiredDataInGroup, filterBy, entityOutputFields)
                    break
                case EntityPropertyType.References:
                    await this.buildReferenceProperties(requiredDataInGroup, entitySchema, dataPointer, dataLocale, entityOutputFields)
                    break
            }
        }

        const queryHeader = headerArguments.length > 0 ? `(\n${headerArguments.join(", ")}\n)` : ''
        return `
        {
            q: query${entitySchema.nameVariants.pascalCase}${queryHeader} {
                recordPage(number: ${pageNumber}, size: ${pageSize}) {
                    data {
                        ${entityOutputFields.join("\n")}
                    }
                    totalRecordCount
                }
            }
        }
        `
    }

    private buildEntityBodyProperties(requiredDataInGroup: string[],
                                      entitySchema: EntitySchema,
                                      dataLocale: string | undefined,
                                      entityOutputFields: string[]): void {
        for (const requireDatum of requiredDataInGroup) {
            if (requireDatum === StaticEntityProperties.ParentPrimaryKey) {
                const representativeAttributes: AttributeSchemaUnion[] = Object.values(entitySchema.attributes)
                    .filter(attributeSchema => 'representative' in attributeSchema && attributeSchema.representative)
                    .filter(attributeSchema => {
                        if (!dataLocale) {
                            return !attributeSchema.localized
                        }
                        return true
                    })

                if (representativeAttributes.length === 0) {
                    entityOutputFields.push(`parents(stopAt: { distance: 1 }) {`)
                    entityOutputFields.push('  primaryKey')
                    entityOutputFields.push('}')
                } else {
                    entityOutputFields.push(`parents(stopAt: { distance: 1 }) {`)
                    entityOutputFields.push('   primaryKey')
                    entityOutputFields.push('   attributes {')
                    entityOutputFields.push(`       ${representativeAttributes.map(attributeSchema => `${attributeSchema.nameVariants.camelCase}`).join(',')}`)
                    entityOutputFields.push('   }')
                    entityOutputFields.push('}')
                }
            } else {
                entityOutputFields.push(requireDatum)
            }
        }
    }

    private buildAttributesProperty(requiredDataInGroup: string[],
                                    entitySchema: EntitySchema,
                                    dataLocale: string | undefined,
                                    entityOutputFields: string[]) {
        const requiredAttributes: string[] = requiredDataInGroup
            .map(requiredDatum => {
                const attributeSchema: AttributeSchemaUnion | undefined = Object.values(entitySchema.attributes)
                    .find(attribute => attribute.nameVariants.camelCase === requiredDatum)
                if (attributeSchema == undefined) {
                    throw new UnexpectedError(undefined, `Attribute ${requiredDatum} not found in entity ${entitySchema.name}`)
                }
                if (!dataLocale && attributeSchema.localized) {
                    // we don't want try to fetch localized attributes when no locale is specified, that would throw an error in evitaDB
                    return undefined
                }
                return requiredDatum
            })
            .filter(it => it != undefined)
            .map(it => it as string)
        if (requiredAttributes.length === 0) {
            return
        }

        if (dataLocale !== undefined) {
            entityOutputFields.push(`attributes(locale: ${dataLocale.replace('-', '_')}) {`)
        } else {
            entityOutputFields.push(`attributes {`)
        }
        requiredAttributes.forEach(requiredAttribute => entityOutputFields.push(requiredAttribute))
        entityOutputFields.push('}')
    }

    private buildAssociatedDataProperty(requiredDataInGroup: string[],
                                        entitySchema: EntitySchema,
                                        dataLocale: string | undefined,
                                        entityOutputFields: string[]) {
        const requiredAssociatedData: string[] = requiredDataInGroup
            .map(requiredDatum => {
                const associatedDataSchema: AssociatedDataSchema | undefined = Object.values(entitySchema.associatedData)
                    .find(associatedData => associatedData.nameVariants.camelCase === requiredDatum)
                if (associatedDataSchema == undefined) {
                    throw new UnexpectedError(undefined, `Associated data ${requiredDatum} not found in entity ${entitySchema.name}`)
                }
                if (!dataLocale && associatedDataSchema.localized) {
                    // we don't want try to fetch localized associated data when no locale is specified, that would throw an error in evitaDB
                    return undefined
                }
                return requiredDatum
            })
            .filter(it => it != undefined)
            .map(it => it as string)
        if (requiredAssociatedData.length === 0) {
            return
        }

        if (dataLocale !== undefined) {
            entityOutputFields.push(`associatedData(locale: ${dataLocale.replace('-', '_')}) {`)
        } else {
            entityOutputFields.push(`associatedData {`)
        }
        requiredAssociatedData.forEach(requiredAssociatedDatum => entityOutputFields.push(requiredAssociatedDatum))
        entityOutputFields.push('}')
    }

    private buildPricesProperty(requiredDataInGroup: string[],
                                filterBy: string,
                                entityOutputFields: string[]): void {
        if (requiredDataInGroup.length > 0) {
            entityOutputFields.push(`prices ${priceObjectFieldsTemplate}`)

            const priceListDefined: boolean = priceInPriceListsConstraintPattern.exec(filterBy) != undefined
            const currencyDefined: boolean = priceInCurrencyConstraintPattern.exec(filterBy) != undefined
            if (priceListDefined && currencyDefined) {
                entityOutputFields.push(`priceForSale ${priceObjectFieldsTemplate}`)
            }
        }
    }

    private async buildReferenceProperties(requiredDataInGroup: string[],
                                           entitySchema: EntitySchema,
                                           dataPointer: DataGridDataPointer,
                                           dataLocale: string | undefined,
                                           entityOutputFields: string[]) {
        for (const requiredDatum of requiredDataInGroup) {
            const referenceSchema: ReferenceSchema | undefined = Object.values(entitySchema.references)
                .find(referenceSchema => referenceSchema.nameVariants.camelCase === requiredDatum)
            if (referenceSchema == undefined) {
                throw new UnexpectedError(undefined, `Could not find reference '${requiredDatum}' in '${dataPointer.entityType}'.`)
            }

            entityOutputFields.push(`reference_${requiredDatum}: ${requiredDatum} {`)
            entityOutputFields.push('   referencedPrimaryKey')
            if (referenceSchema.referencedEntityTypeManaged) {
                const referencedEntitySchema: EntitySchema = await this.labService.getEntitySchema(dataPointer.connection, dataPointer.catalogName, referenceSchema.referencedEntityType)
                const representativeAttributes: AttributeSchemaUnion[] = Object.values(referencedEntitySchema.attributes)
                    .filter(attributeSchema => 'representative' in attributeSchema && attributeSchema.representative)
                    .filter(attributeSchema => {
                        if (!dataLocale) {
                            return !attributeSchema.localized
                        }
                        return true
                    })

                if (representativeAttributes.length > 0) {
                    entityOutputFields.push('   referencedEntity {')
                    entityOutputFields.push('       attributes {')
                    entityOutputFields.push(`           ${representativeAttributes.map(attributeSchema => `${attributeSchema.nameVariants.camelCase}`).join(',')}`)
                    entityOutputFields.push('       }')
                    entityOutputFields.push('   }')
                }

                // todo referenced attributes support
            }
            entityOutputFields.push('}')
        }
    }

    buildPrimaryKeyOrderBy(orderDirection: string): string {
        return `entityPrimaryKeyNatural: ${orderDirection.toUpperCase()}`
    }

    buildAttributeOrderBy(attributeSchema: AttributeSchemaUnion, orderDirection: string): string {
        return `attribute${attributeSchema.nameVariants.pascalCase}Natural: ${orderDirection.toUpperCase()}`
    }

    buildParentEntityFilterBy(parentPrimaryKey: number): string {
        return `entityPrimaryKeyInSet: ${parentPrimaryKey}`
    }

    buildPredecessorEntityFilterBy(predecessorPrimaryKey: number): string {
        return `entityPrimaryKeyInSet: ${predecessorPrimaryKey}`
    }

    buildReferencedEntityFilterBy(referencedPrimaryKeys: number | number[]): string {
        return `entityPrimaryKeyInSet: [${typeof referencedPrimaryKeys === 'number' ? referencedPrimaryKeys : referencedPrimaryKeys.join(', ')}]`
    }

}
