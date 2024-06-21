import { DefineComponent, markRaw } from 'vue'
import LabEditorEvitaQLConsole from '@/components/lab/editor/evitaql-console/LabEditorEvitaQLConsole.vue'
import { LabService } from '@/services/lab.service'
import { TabRequest } from '@/model/editor/tab/TabRequest'
import { EvitaQLConsoleParams } from '@/model/editor/tab/evitaQLConsole/EvitaQLConsoleParams'
import { EvitaQLConsoleData } from '@/model/editor/tab/evitaQLConsole/EvitaQLConsoleData'
import { EvitaQLDataPointer } from '@/model/editor/tab/evitaQLConsole/EvitaQLDataPointer'
import { TabRequestComponentParamsDto } from '@/model/editor/tab/TabRequestComponentParamsDto'
import { TabRequestComponentDataDto } from '@/model/editor/tab/TabRequestComponentDataDto'
import { EvitaDBConnection } from '@/model/EvitaDBConnection'

/**
 * Creates new EvitaQL tab.
 */
export class EvitaQLConsoleTabDefinition extends TabRequest<EvitaQLConsoleParams, EvitaQLConsoleData> {

    private constructor(title: string, params: EvitaQLConsoleParams, initialData: EvitaQLConsoleData) {
        super(
            undefined,
            title,
            'mdi-console',
            markRaw(LabEditorEvitaQLConsole as DefineComponent<any, any, any>),
            params,
            initialData
        )
    }

    static createNew(connection: EvitaDBConnection,
                     catalogName: string,
                     initialData: EvitaQLConsoleData | undefined = undefined,
                     executeOnOpen: boolean = false): EvitaQLConsoleTabDefinition {
        return new EvitaQLConsoleTabDefinition(
            this.constructTitle(connection, catalogName),
            new EvitaQLConsoleParams(
                new EvitaQLDataPointer(connection, catalogName),
                executeOnOpen
            ),
            initialData ? initialData : new EvitaQLConsoleData()
        )
    }

    static restoreFromJson(labService: LabService, paramsJson: TabRequestComponentParamsDto, dataJson?: TabRequestComponentDataDto): EvitaQLConsoleTabDefinition {
        const params: EvitaQLConsoleParams = EvitaQLConsoleParams.restoreFromSerializable(labService, paramsJson)
        const data: EvitaQLConsoleData = dataJson == undefined ? new EvitaQLConsoleData() : EvitaQLConsoleData.restoreFromSerializable(dataJson)

        return new EvitaQLConsoleTabDefinition(
            this.constructTitle(params.dataPointer.connection, params.dataPointer.catalogName),
            params,
            data
        )
    }

    private static constructTitle(connection: EvitaDBConnection, catalogName: string): string {
        return `${catalogName} [${connection.name}]`
    }
}

