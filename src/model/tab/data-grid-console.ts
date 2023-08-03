import { EvitaDBConnection } from '@/model/lab'
import { TabRequestComponentProps } from '@/model/editor'

/**
 * Points to concrete evitaDB collection to fetch data from.
 */
export class DataGridDataPointer implements TabRequestComponentProps {
    readonly connection: EvitaDBConnection
    readonly catalogName: string
    readonly entityType: string

    constructor(connection: EvitaDBConnection, catalogName: string, entityType: string) {
        this.connection = connection
        this.catalogName = catalogName
        this.entityType = entityType
    }
}

/**
 * Represents props of the LabEditorConsoleDataGrid component.
 */
export interface DataGridConsoleProps extends TabRequestComponentProps {
    dataPointer: DataGridDataPointer
}

/**
 * Types of entity properties with their prefixes
 */
export enum EntityPropertyType {
    Entity = '',
    Attributes = 'attributes',
    AssociatedData = 'associatedData',
    References = 'references'
}

/**
 * Set of statically defined entity properties.
 */
export enum StaticEntityProperties {
    PrimaryKey = 'primaryKey',
    Parent = 'parent',
    Locales = 'locales',
    AllLocales = 'allLocales',
    PriceInnerRecordHandling = 'priceInnerRecordHandling'
}
