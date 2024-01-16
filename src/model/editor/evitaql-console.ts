import { EvitaDBConnection, EvitaDBConnectionId, UnexpectedError } from '@/model/lab'
import {
    CatalogPointer,
    ExecutableTabRequest, SerializableTabRequestComponentData, SerializableTabRequestComponentParams,
    TabRequestComponentData, TabRequestComponentDataDto,
    TabRequestComponentParams, TabRequestComponentParamsDto
} from '@/model/editor/editor'
import { LabService } from '@/services/lab.service'

/**
 * Represents props of the LabEditorConsoleEvitaQL component.
 */
export class EvitaQLConsoleParams implements TabRequestComponentParams, SerializableTabRequestComponentParams<EvitaQLConsoleParamsDto>, ExecutableTabRequest {
    readonly dataPointer: EvitaQLDataPointer
    readonly executeOnOpen: boolean

    constructor(dataPointer: EvitaQLDataPointer, executeOnOpen: boolean) {
        this.dataPointer = dataPointer
        this.executeOnOpen = executeOnOpen
    }

    static restoreFromSerializable(labService: LabService, json: any): EvitaQLConsoleParams {
        const dto: EvitaQLConsoleParamsDto = json as EvitaQLConsoleParamsDto
        return new EvitaQLConsoleParams(
            new EvitaQLDataPointer(
                labService.getConnection(dto.connectionId),
                dto.catalogName
            ),
            // We don't want to execute query on open if it's restored from a storage or link.
            // If from storage, there may a lots of tabs to restore, and we don't want to execute them all for performance reasons.
            // If from link, the query may be dangerous or something.
            false
        )
    }

    toSerializable(): EvitaQLConsoleParamsDto {
        return {
            connectionId: this.dataPointer.connection.id,
            catalogName: this.dataPointer.catalogName
        }
    }
}

/**
 * Serializable DTO for storing {@link EvitaQLConsoleParams} in a storage or link.
 */
interface EvitaQLConsoleParamsDto extends TabRequestComponentParamsDto {
    readonly connectionId: EvitaDBConnectionId
    readonly catalogName: string
}

/**
 * Represents injectable/storable user data of the LabEditorConsoleEvitaQL component.
 */
export class EvitaQLConsoleData implements TabRequestComponentData, SerializableTabRequestComponentData<EvitaQLConsoleDataDto> {
    readonly query?: string
    readonly variables?: string

    constructor(query?: string, variables?: string) {
        this.query = query
        this.variables = variables
    }

    static restoreFromSerializable(json: any): EvitaQLConsoleData {
        return new EvitaQLConsoleData(json.query, json.variables)
    }

    toSerializable(): EvitaQLConsoleDataDto {
        return {
            query: this.query,
            variables: this.variables
        }
    }
}

/**
 * Serializable DTO for storing {@link EvitaQLConsoleDataDto} in a storage or link.
 */
interface EvitaQLConsoleDataDto extends TabRequestComponentDataDto {
    readonly query?: string
    readonly variables?: string
}

/**
 * Points to concrete evitaDB EvitaQL instance
 */
export class EvitaQLDataPointer extends CatalogPointer {
    constructor(connection: EvitaDBConnection, catalogName: string) {
        super(connection, catalogName)
    }
}
