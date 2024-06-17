import { TabRequestComponentParams } from '@/model/editor/tab/TabRequestComponentParams'
import { ExecutableTabRequest } from '@/model/editor/tab/ExecutableTabRequest'
import { LabService } from '@/services/lab.service'
import { TabRequestComponentParamsDto } from '@/model/editor/tab/TabRequestComponentParamsDto'

import { EntityViewerDataPointer } from '@/modules/entity-viewer/viewer/workspace/EntityViewerDataPointer'

/**
 * Represents props of the LabEditorDataGrid component.
 */
export class EntityViewerParams implements TabRequestComponentParams<DataGridParamsDto>, ExecutableTabRequest {
    readonly dataPointer: EntityViewerDataPointer
    readonly executeOnOpen: boolean

    constructor(dataPointer: EntityViewerDataPointer, executeOnOpen: boolean = false) {
        this.dataPointer = dataPointer
        this.executeOnOpen = executeOnOpen
    }

    static restoreFromSerializable(labService: LabService, json: TabRequestComponentParamsDto): EntityViewerParams {
        const dto: DataGridParamsDto = json as DataGridParamsDto
        return new EntityViewerParams(
            new EntityViewerDataPointer(
                labService.getConnection(dto.connectionId),
                dto.catalogName,
                dto.entityType
            ),
            // We don't want to execute query on open if it's restored from a storage or link.
            // If from storage, there may a lots of tabs to restore, and we don't want to execute them all for performance reasons.
            // If from link, the query may be dangerous or something.
            false
        )
    }

    toSerializable(): DataGridParamsDto {
        return {
            connectionId: this.dataPointer.connection.id,
            catalogName: this.dataPointer.catalogName,
            entityType: this.dataPointer.entityType
        }
    }
}
