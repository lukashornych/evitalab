import { inject, InjectionKey } from 'vue'
import { ConnectionStore, useConnectionStore } from '@/modules/connection/store/connectionStore'
import { EvitaDBClient } from '@/modules/connection/driver/service/EvitaDBClient'
import Cookies from 'js-cookie'
import { EvitaDBConnection } from '@/modules/connection/model/EvitaDBConnection'
import { LabStorage } from '@/modules/storage/LabStorage'
import { EvitaDBConnectionId } from '@/modules/connection/model/EvitaDBConnectionId'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { DuplicateEvitaDBConnectionError } from '@/modules/connection/exception/DuplicateEvitaDBConnectionError'

/**
 * Cookie containing preconfigured connections. These will be displayed next to the user-defined connections.
 */
const preconfiguredConnectionsCookieName: string = 'evitalab_pconnections'

const userConnectionsStorageKey: string = 'userConnections'

export const key: InjectionKey<ConnectionManager> = Symbol()

/**
 * Service that manages lifecycle of a whole evitaLab instance. It contains generic methods for accessing evitaDB servers
 * and so on.
 */
export class ConnectionManager {
    private readonly store: ConnectionStore
    private readonly labStorage: LabStorage
    private readonly evitaDBClient: EvitaDBClient

    private constructor(store: ConnectionStore, labStorage: LabStorage, evitaDBClient: EvitaDBClient) {
        this.store = store
        this.labStorage = labStorage
        this.evitaDBClient = evitaDBClient
    }

    /**
     * Loads data and initializes connection manager
     *
     * @param labStorage
     * @param evitaDBClient
     */
    static load(labStorage: LabStorage, evitaDBClient: EvitaDBClient): ConnectionManager {
        const store: ConnectionStore = useConnectionStore()

        let preconfiguredConnections: EvitaDBConnection[] = []
        // load preconfigured connections from cookie from hosted evitaDB instance
        const preconfiguredConnectionsCookie: string | undefined = Cookies.get(preconfiguredConnectionsCookieName)
        if (preconfiguredConnectionsCookie != undefined) {
            try {
                preconfiguredConnections = (JSON.parse(atob(preconfiguredConnectionsCookie)) as Array<any>)
                    .map(connection => EvitaDBConnection.fromJson(connection, true))
                // todo validate duplicate connections, move this to Lab component to have access to Toaster
            } catch (e) {
                console.error('Failed to load preconfigured connections cookie', e)
            }
        }
        // automatic demo connection configuration for easier development
        if (import.meta.env.DEV) {
            preconfiguredConnections.push(new EvitaDBConnection(
                'demo',
                'Demo (dev)',
                true,
                'https://demo.evitadb.io/lab/api',
                'https://demo.evitadb.io:5555/rest',
                'https://demo.evitadb.io:5555/gql'
            ))
            preconfiguredConnections.push(new EvitaDBConnection(
                'localhost',
                'Localhost (dev)',
                true,
                'https://localhost:5555/lab/api',
                'https://localhost:5555/rest',
                'https://localhost:5555/gql'
            ))
        }

        // load user-defined connections from local storage
        const userConnections: EvitaDBConnection[] = labStorage.get(userConnectionsStorageKey, [])

        // inject connections into the lab
        store.replacePreconfiguredConnections(preconfiguredConnections)
        store.replaceUserConnections(userConnections)

        // expire cookies, so when the lab is reloaded, it will load new cookie values
        Cookies.remove(preconfiguredConnectionsCookieName)

        return new ConnectionManager(store, labStorage, evitaDBClient)
    }

    /**
     * Returns specific connection (either preconfigured or user one)
     */
    getConnection(id: EvitaDBConnectionId): EvitaDBConnection {
        const connection: EvitaDBConnection | undefined = this.store.connections
            .find(c => c.id === id) as EvitaDBConnection | undefined
        if (connection == undefined) {
            throw new UnexpectedError(undefined, `Connection for ID '${id}' not found.`)
        }
        return connection
    }

    /**
     * Returns all connections: preconfigured and user ones.
     */
    getConnections(): EvitaDBConnection[] {
        return this.store.connections as EvitaDBConnection[]
    }

    isConnectionExists(connectionName: string): boolean {
        return this.store.connections.find(c => c.name === connectionName) != undefined
    }

    /**
     * Adds connection to UI and lab storage
     */
    addConnection(connection: EvitaDBConnection): void {
        if (this.isConnectionExists(connection.name)) {
            throw new DuplicateEvitaDBConnectionError(connection.name)
        }

        this.store.userConnections.push(connection)
        this.labStorage.set(userConnectionsStorageKey, this.store.userConnections)
    }

    /**
     * Removes connection from UI and lab storage
     */
    removeConnection(connectionName: string): void {
        this.store.userConnections.splice(
            this.store.userConnections.findIndex(connection => connection.name === connectionName),
            1
        )
        this.labStorage.set(userConnectionsStorageKey, this.store.userConnections)
    }

    getCatalog = async (connection: EvitaDBConnection, catalogName: string): Promise<Catalog> => {
        let catalog: Catalog | undefined = this.store.getters['lab/getCatalog'](connection.id, catalogName)
        if (catalog == undefined) {
            await this.fetchCatalogs(connection)

            catalog = this.store.getters['lab/getCatalog'](connection.id, catalogName)
            if (catalog == undefined) {
                throw new UnexpectedError(undefined, `Catalog ${catalogName} not found.`)
            }
        }
        return catalog
    }

    getCatalogs = async (connection: EvitaDBConnection): Promise<Catalog[]> => {
        let catalogs: Catalog[] | undefined = this.store.getters['lab/getCatalogs'](connection.id)
        if (catalogs == undefined) {
            catalogs = await this.fetchCatalogs(connection)
        }
        return catalogs
    }

    getCatalogSchema = async (connection: EvitaDBConnection, catalogName: string): Promise<CatalogSchema> => {
        let catalogSchema: CatalogSchema | undefined = this.store.getters['lab/getCatalogSchema'](connection.id, catalogName)
        if (catalogSchema == undefined) {
            catalogSchema = await this.fetchCatalogSchema(connection, catalogName)
        }
        return catalogSchema
    }

    getEntitySchema = async (connection: EvitaDBConnection, catalogName: string, entityType: string): Promise<EntitySchema> => {
        // todo lho why this logic is in the store if other getters are here?
        let entitySchema: EntitySchema | undefined = this.store.getters['lab/getEntitySchema'](connection.id, catalogName, entityType)
        if (entitySchema == undefined) {
            await this.getCatalogSchema(connection, catalogName)
            entitySchema = this.store.getters['lab/getEntitySchema'](connection.id, catalogName, entityType)
            if (entitySchema == undefined) {
                throw new UnexpectedError(connection, `Entity ${entityType} not found.`)
            }
        }
        return entitySchema
    }

    getEntitySchemaFlags = (schema: EntitySchema): string[] => {
        const flags: string[] = []
        if (schema.withHierarchy) flags.push(EntitySchemaFlag.Hierarchical)
        return flags
    }

    getCatalogAttributeSchema = async (connection: EvitaDBConnection, catalogName: string, attributeName: string): Promise<GlobalAttributeSchema> => {
        const catalogSchema: CatalogSchema = await this.getCatalogSchema(connection, catalogName)
        const attributeSchema: GlobalAttributeSchema | undefined = Object.values(catalogSchema.attributes)
            .find(attribute => attribute.name === attributeName)
        if (attributeSchema == undefined) {
            throw new UnexpectedError(connection, `Attribute '${attributeName}' not found in catalog '${catalogName}'.`)
        }
        return attributeSchema
    }

    getEntityAttributeSchema = async (connection: EvitaDBConnection, catalogName: string, entityType: string, attributeName: string): Promise<AttributeSchemaUnion> => {
        const entitySchema: EntitySchema = await this.getEntitySchema(connection, catalogName, entityType)
        const attributeSchema: AttributeSchemaUnion | undefined = Object.values(entitySchema.attributes)
            .find(attribute => attribute.name === attributeName)
        if (attributeSchema == undefined) {
            throw new UnexpectedError(connection, `Attribute '${attributeName}' not found in entity '${entityType}' in catalog '${catalogName}'.`)
        }
        return attributeSchema
    }

    getReferenceAttributeSchema = async (connection: EvitaDBConnection,
                                         catalogName: string,
                                         entityType: string,
                                         referenceName: string,
                                         attributeName: string): Promise<AttributeSchemaUnion> => {
        const referenceSchema: ReferenceSchema = await this.getReferenceSchema(connection, catalogName, entityType, referenceName)
        const attributeSchema: AttributeSchemaUnion | undefined = Object.values(referenceSchema.attributes)
            .find(attribute => attribute.name === attributeName)
        if (attributeSchema == undefined) {
            throw new UnexpectedError(connection, `Attribute '${attributeName}' not found in reference '${referenceName}' in entity '${entityType}' in catalog '${catalogName}'.`)
        }
        return attributeSchema
    }

    getAttributeSchemaFlags = (schema: AttributeSchemaUnion): string[] => {
        const flags: string[] = []
        flags.push(this.formatDataTypeForFlag(schema.type))
        const globalAttribute = 'globalUniquenessType' in schema
        const entityAttribute = 'representative' in schema
        if (entityAttribute && (schema as EntityAttributeSchema).representative) {
            flags.push(AttributeSchemaFlag.Representative)
        }
        if (globalAttribute && (schema as GlobalAttributeSchema).globalUniquenessType === GlobalAttributeUniquenessType.UniqueWithinCatalog) {
            flags.push(AttributeSchemaFlag.GloballyUnique)
        } else if (globalAttribute && (schema as GlobalAttributeSchema).globalUniquenessType === GlobalAttributeUniquenessType.UniqueWithinCatalogLocale) {
            flags.push(AttributeSchemaFlag.GloballyUniquePerLocale)
        } else if (schema.uniquenessType === AttributeUniquenessType.UniqueWithinCollection) {
            flags.push(AttributeSchemaFlag.Unique)
        } else if (schema.uniquenessType === AttributeUniquenessType.UniqueWithinCollectionLocale) {
            flags.push(AttributeSchemaFlag.UniquePerLocale)
        }
        if ((globalAttribute && (schema as GlobalAttributeSchema).globalUniquenessType != GlobalAttributeUniquenessType.NotUnique) ||
            schema.uniquenessType != AttributeUniquenessType.NotUnique ||
            schema.filterable)
            flags.push(AttributeSchemaFlag.Filterable)
        if (schema.sortable) flags.push(AttributeSchemaFlag.Sortable)
        if (schema.localized) flags.push(AttributeSchemaFlag.Localized)
        if (schema.nullable) flags.push(AttributeSchemaFlag.Nullable)
        return flags
    }

    getAssociatedDataSchema = async (connection: EvitaDBConnection, catalogName: string, entityType: string, associatedDataName: string): Promise<AssociatedDataSchema> => {
        const entitySchema: EntitySchema = await this.getEntitySchema(connection, catalogName, entityType)
        const associatedData: AssociatedDataSchema | undefined = Object.values(entitySchema.associatedData)
            .find(associatedData => associatedData.name === associatedDataName)
        if (associatedData == undefined) {
            throw new UnexpectedError(connection, `Associated data '${associatedDataName}' not found in entity '${entityType}' in catalog '${catalogName}'.`)
        }
        return associatedData
    }

    getAssociatedDataSchemaFlags = (schema: AssociatedDataSchema): string[] => {
        const flags: string[] = []
        flags.push(this.formatDataTypeForFlag(schema.type))
        if (schema.localized) flags.push(AssociatedDataSchemaFlag.Localized)
        if (schema.nullable) flags.push(AssociatedDataSchemaFlag.Nullable)
        return flags
    }

    getReferenceSchema = async (connection: EvitaDBConnection, catalogName: string, entityType: string, referenceName: string): Promise<ReferenceSchema> => {
        const entitySchema: EntitySchema = await this.getEntitySchema(connection, catalogName, entityType)
        const referenceSchema: ReferenceSchema | undefined = Object.values(entitySchema.references)
            .find(reference => reference.name === referenceName)
        if (referenceSchema == undefined) {
            throw new UnexpectedError(connection, `Reference '${referenceName}' not found in entity '${entityType}' in catalog '${catalogName}'.`)
        }
        return referenceSchema
    }

    getReferenceSchemaFlags = (schema: ReferenceSchema): string[] => {
        const flags: string[] = []
        if (!schema.referencedEntityTypeManaged) flags.push(ReferenceSchemaFlag.External)
        if (schema.indexed) flags.push(ReferenceSchemaFlag.Indexed)
        if (schema.faceted) flags.push(ReferenceSchemaFlag.Faceted)
        return flags
    }

    private async fetchCatalogs(connection: EvitaDBConnection): Promise<Catalog[]> {
        const fetchedCatalogs: Catalog[] = await this.evitaDBClient.getCatalogs(connection)

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

        const fetchedCatalogSchema: CatalogSchema = await this.evitaDBClient.getCatalogSchema(connection, catalog.name)

        this.store.commit(
            'lab/putCatalogSchema',
            {
                connectionId: connection.id,
                catalogSchema: fetchedCatalogSchema
            }
        )

        return fetchedCatalogSchema
    }

    private formatDataTypeForFlag(dataType: string): string {
        return dataType
            .replace('ComplexDataObject', 'Object')
            .replace('Array', '[]')
    }
}

export const useConnectionManager = (): ConnectionManager => {
    return inject(key) as ConnectionManager
}
