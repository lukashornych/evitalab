import { TabRequest } from '@/model/editor'
import { EvitaDBConnection } from '@/model/lab'
import { markRaw } from 'vue'
import LabEditorConsoleEvitaQL from '@/components/LabEditorConsoleEvitaQL.vue'
import { EvitaQLConsoleProps, EvitaQLDataPointer } from '@/model/tab/evitaql-console'

/**
 * Creates new EvitaQL tab.
 */
export class EvitaQLConsoleRequest extends TabRequest<EvitaQLConsoleProps> {
    constructor(connection: EvitaDBConnection, catalogName: string) {
        super(
            `${catalogName} [${connection.name}]`,
            'mdi-console',
            markRaw(LabEditorConsoleEvitaQL),
            {
                dataPointer: new EvitaQLDataPointer(connection, catalogName)
            }
        )
    }
}

