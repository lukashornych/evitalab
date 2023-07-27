import { EvitaDBConnection } from '@/model/lab'
import { inject, InjectionKey } from 'vue'
import { Store } from 'vuex'
import { State } from '@/store'
import { Catalog } from '@/model/evitadb/system'
import { fetchGraphQL } from '@/services/graphql-client'
import { CatalogSchema, EntitySchema } from '@/model/evitadb/schema'

export const key: InjectionKey<LabService> = Symbol()

/**
 * Service that manages lifecycle of a whole evitaLab instance. It contains generic methods for accessing evitaDB servers
 * and so on.
 */
export class LabService {
    readonly store: Store<State>

    constructor(store: Store<State>) {
        this.store = store
    }

    getConnections = (): EvitaDBConnection[] => {
        return this.store.state.lab.connections
    }

    addConnection = (connection: EvitaDBConnection): void => {
        this.store.commit('lab/addConnection', connection)
    }

    removeConnection = (connectionName: string): void => {
        this.store.commit('lab/removeConnection', connectionName)
    }

    getCatalog = async (connection: EvitaDBConnection, catalogName: string): Promise<Catalog> => {
        let catalog: Catalog | undefined = this.store.getters['lab/getCatalog'](connection.id, catalogName)
        if (catalog === undefined) {
            await this.fetchCatalogs(connection)

            catalog = this.store.getters['lab/getCatalog'](connection.id, catalogName)
            if (catalog === undefined) {
                throw new Error(`Catalog ${catalogName} not found.`)
            }
        }
        return catalog
    }

    getCatalogs = async (connection: EvitaDBConnection): Promise<Catalog[]> => {
        let catalogs: Catalog[] | undefined = this.store.getters['lab/getCatalogs'](connection.id)
        if (catalogs === undefined) {
            catalogs = await this.fetchCatalogs(connection)
        }
        return catalogs
    }

    getCatalogSchema = async (connection: EvitaDBConnection, catalogName: string): Promise<CatalogSchema> => {
        let catalogSchema: CatalogSchema | undefined = this.store.getters['lab/getCatalogSchema'](connection.id, catalogName)
        if (catalogSchema === undefined) {
            catalogSchema = await this.fetchCatalogSchema(connection, catalogName)
        }
        return catalogSchema
    }

    getEntitySchema = async (connection: EvitaDBConnection, catalogName: string, entityType: string): Promise<any> => {
        let entitySchema: EntitySchema | undefined = this.store.getters['lab/getEntitySchema'](connection.id, catalogName, entityType)
        if (entitySchema === undefined) {
            await this.getCatalogSchema(connection, catalogName)
            entitySchema = this.store.getters['lab/getEntitySchema'](connection.id, catalogName, entityType)
        }
        return entitySchema
    }

    private async fetchCatalogs(connection: EvitaDBConnection): Promise<Catalog[]> {
        const fetchedCatalogs: Catalog[] = (await fetchGraphQL(
            `${connection.gqlUrl}/system`,
            `
            {
                catalogs {
                    ... on Catalog {
                        name
                        nameVariants {
                            kebabCase
                        }
                        corrupted
                    }
                    ... on CorruptedCatalog {
                        name
                        corrupted
                    }
                }
            }
            `
        )).data['catalogs'] as Catalog[]

        this.store.commit(
            'lab/putCatalogs',
            {
                connectionId: connection.id,
                catalogs: fetchedCatalogs
            }
        )

        return fetchedCatalogs
    }

    private async fetchCatalogSchema(connection: EvitaDBConnection, catalogName: string): Promise<CatalogSchema> {
        const catalog: Catalog = await this.getCatalog(connection, catalogName)

        const fetchedCatalogSchema: CatalogSchema = (await fetchGraphQL(
            `${connection.gqlUrl}/${catalog.nameVariants.kebabCase}/schema`,
            `
            {
              catalogSchema: getCatalogSchema {
                version
                name
                nameVariants {
                  camelCase
                  pascalCase
                  snakeCase
                  upperSnakeCase
                  kebabCase
                }
                description
                allAttributes {
                  name
                  nameVariants {
                    camelCase
                    pascalCase
                    snakeCase
                    upperSnakeCase
                    kebabCase
                  }
                  description
                  deprecationNotice
                  unique
                  uniqueGlobally
                  filterable
                  sortable
                  localized
                  nullable
                  type
                  defaultValue
                  indexedDecimalPlaces
                }
                allEntitySchemas {
                  version
                  name
                  nameVariants {
                    camelCase
                    pascalCase
                    snakeCase
                    upperSnakeCase
                    kebabCase
                  }
                  description
                  deprecationNotice
                  withGeneratedPrimaryKey
                  withHierarchy
                  withPrice
                  indexedPricePlaces
                  locales
                  currencies
                  evolutionMode
                  allAttributes {
                    ... on GlobalAttributeSchema {
                      __typename
                      name
                      nameVariants {
                        camelCase
                        pascalCase
                        snakeCase
                        upperSnakeCase
                        kebabCase
                      }
                      description
                      deprecationNotice
                      uniqueGlobally
                      unique
                      filterable
                      sortable
                      localized
                      nullable
                      type
                      defaultValue
                      indexedDecimalPlaces
                    }
                    ... on AttributeSchema {
                      __typename
                      name
                      nameVariants {
                        camelCase
                        pascalCase
                        snakeCase
                        upperSnakeCase
                        kebabCase
                      }
                      description
                      deprecationNotice
                      unique
                      filterable
                      sortable
                      localized
                      nullable
                      type
                      defaultValue
                      indexedDecimalPlaces
                    }
                  }
                  allAssociatedData {
                    name
                    nameVariants {
                      camelCase
                      pascalCase
                      snakeCase
                      upperSnakeCase
                      kebabCase
                    }
                    description
                    deprecationNotice
                    localized
                    nullable
                    type
                  }
                  allReferences {
                    name
                    nameVariants {
                      camelCase
                      pascalCase
                      snakeCase
                      upperSnakeCase
                      kebabCase
                    }
                    description
                    deprecationNotice
                    cardinality
                    referencedEntityType
                    entityTypeNameVariants {
                      camelCase
                      pascalCase
                      snakeCase
                      upperSnakeCase
                      kebabCase
                    }
                    referencedEntityTypeManaged
                    referencedGroupType
                    groupTypeNameVariants {
                      camelCase
                      pascalCase
                      snakeCase
                      upperSnakeCase
                      kebabCase
                    }
                    referencedGroupTypeManaged
                    indexed
                    faceted
                    allAttributes {
                      name
                      nameVariants {
                        camelCase
                        pascalCase
                        snakeCase
                        upperSnakeCase
                        kebabCase
                      }
                      description
                      deprecationNotice
                      unique
                      filterable
                      sortable
                      localized
                      nullable
                      type
                      defaultValue
                      indexedDecimalPlaces
                    }
                  }
                }
              }
            }
            `
        )).data['catalogSchema'] as CatalogSchema

        this.store.commit(
            'lab/putCatalogSchema',
            {
                connectionId: connection.id,
                catalogSchema: fetchedCatalogSchema
            }
        )

        return fetchedCatalogSchema
    }
}

export const useLabService = (): LabService => {
    return inject(key) as LabService
}
