import { TabRequest } from '@/model/editor'
import { EvitaDBConnection } from '@/model/lab'
import { markRaw } from 'vue'
import LabEditorConsoleDataGrid from '@/components/LabEditorConsoleDataGrid.vue'
import { DataGridConsoleProps, DataGridDataPointer } from '@/model/tab/data-grid-console'

export class DataGridConsoleRequest extends TabRequest<DataGridConsoleProps> {
    constructor(connection: EvitaDBConnection, catalogName: string, entityType: string) {
        super(
            `${catalogName} - ${entityType} [${connection.name}]`,
            'mdi-table',
            markRaw(LabEditorConsoleDataGrid),
            {
                dataPointer: new DataGridDataPointer(connection, catalogName, entityType)
            }
        )
    }
}
