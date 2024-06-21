import { DefineComponent, markRaw } from 'vue'
import LabEditorDataGrid from '@/components/lab/editor/data-grid/LabEditorDataGrid.vue'
import { EntityViewerTabParams } from '@/modules/entity-viewer/viewer/workspace/EntityViewerTabParams'
import { EntityViewerTabData } from '@/modules/entity-viewer/viewer/workspace/EntityViewerTabData'
import { TabParamsDto } from '@/modules/workspace/tab/model/TabParamsDto'
import { TabDataDto } from '@/modules/workspace/tab/model/TabDataDto'
import { TabDefinition } from '@/modules/workspace/tab/model/TabDefinition'
import { EvitaDBConnection } from '@/modules/connection/model/EvitaDBConnection'
import { EntityViewerDataPointer } from '@/modules/entity-viewer/viewer/model/EntityViewerDataPointer'

/**
 * Creates new data grid tab.
 */
export class EntityViewerTabDefinition extends TabDefinition<EntityViewerTabParams, EntityViewerTabData> {

    private constructor(title: string, params: EntityViewerTabParams, initialData: EntityViewerTabData) {
        super(
            undefined,
            title,
            'mdi-table',
            markRaw(LabEditorDataGrid as DefineComponent<any, any, any>),
            params,
            initialData
        )
    }

    static createNew(connection: EvitaDBConnection,
                     catalogName: string,
                     entityType: string,
                     initialData: EntityViewerTabData | undefined = undefined,
                     executeOnOpen: boolean = false): EntityViewerTabDefinition {
        return new EntityViewerTabDefinition(
            this.constructTitle(connection, catalogName, entityType),
            new EntityViewerTabParams(
                new EntityViewerDataPointer(connection, catalogName, entityType),
                executeOnOpen
            ),
            initialData ? initialData : new EntityViewerTabData()
        )
    }

    static restoreFromJson(labService: LabService, paramsJson: TabParamsDto, dataJson?: TabDataDto): EntityViewerTabDefinition {
        const params: EntityViewerTabParams = EntityViewerTabParams.restoreFromSerializable(labService, paramsJson)
        const data: EntityViewerTabData = dataJson == undefined ? new EntityViewerTabData() : EntityViewerTabData.restoreFromSerializable(dataJson)

        return new EntityViewerTabDefinition(
            this.constructTitle(params.dataPointer.connection, params.dataPointer.catalogName, params.dataPointer.entityType),
            params,
            data
        )
    }

    private static constructTitle(connection: EvitaDBConnection, catalogName: string, entityType: string): string {
        return `${catalogName} - ${entityType} [${connection.name}]`
    }
}
