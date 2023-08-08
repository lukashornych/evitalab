import { EvitaDBConnection } from '@/model/lab'
import { TabRequestComponentProps } from '@/model/editor/editor'

/**
 * Points to concrete evitaDB EvitaQL instance
 */
export class EvitaQLDataPointer {
    readonly connection: EvitaDBConnection
    readonly catalogName: string

    constructor(connection: EvitaDBConnection, catalogName: string) {
        this.connection = connection
        this.catalogName = catalogName
    }

}

/**
 * Represents props of the LabEditorConsoleEvitaQL component.
 */
export interface EvitaQLConsoleProps extends TabRequestComponentProps {
    readonly dataPointer: EvitaQLDataPointer
}
