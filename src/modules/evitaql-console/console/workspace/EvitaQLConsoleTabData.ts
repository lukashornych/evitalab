import { EvitaQLConsoleDataDto } from '@/model/editor/tab/evitaQLConsole/EvitaQLConsoleDataDto'
import { TabRequestComponentData } from '@/model/editor/tab/TabRequestComponentData'
import { TabRequestComponentDataDto } from '@/model/editor/tab/TabRequestComponentDataDto'

/**
 * Represents injectable/storable user data of the LabEditorConsoleEvitaQL component.
 */
export class EvitaQLConsoleTabData implements TabRequestComponentData<EvitaQLConsoleDataDto> {
    readonly query?: string
    readonly variables?: string

    constructor(query?: string, variables?: string) {
        this.query = query
        this.variables = variables
    }

    static restoreFromSerializable(json: TabRequestComponentDataDto): EvitaQLConsoleTabData {
        const dto: EvitaQLConsoleDataDto = json as EvitaQLConsoleDataDto
        return new EvitaQLConsoleTabData(dto.query, dto.variables)
    }

    toSerializable(): EvitaQLConsoleDataDto {
        return {
            query: this.query,
            variables: this.variables
        }
    }
}
