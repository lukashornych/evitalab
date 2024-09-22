import { InjectionKey } from 'vue'
import { mandatoryInject } from '@/utils/reactivity'
import { Connection } from '@/modules/connection/model/Connection'
import { Uuid } from '@/modules/connection/model/data-type/Uuid'
import { FilesToFetch } from '@/modules/connection/model/file/FilesToFetch'
import { EventType } from '@/modules/connection/model/jfr/EventType'
import { ConnectionService } from '@/modules/connection/service/ConnectionService'

export const jfrViewerServiceInjectionKey: InjectionKey<JfrViewerService> = Symbol('jfrViewerService')

export const jfrRecorderTaskName: string = 'JfrRecorderTask'

export class JfrViewerService {
    private readonly connectionService: ConnectionService

    constructor(connectionService: ConnectionService) {
        this.connectionService = connectionService
    }

    async getRecordings(connection: Connection):Promise<FilesToFetch>{
        const driver = await this.connectionService.getDriver(connection)
        return await driver.getJfrRecords(connection, 1,20)
    }

    async downloadFile(connection: Connection, fileId: Uuid):Promise<Blob> {
        const driver = await this.connectionService.getDriver(connection)
        return await driver.downloadFile(connection, fileId)
    }

    async getEventTypes(connection: Connection):Promise<EventType[]>{
        const driver = await this.connectionService.getDriver(connection)
        return await driver.downloadRecordingEventTypes(connection)
    }

    async startRecording(connection: Connection, entityTypes: string[]): Promise<boolean> {
        const driver = await this.connectionService.getDriver(connection)
        return await driver.startJrfRecording(connection, entityTypes)
    }

    async stopRecording(connection: Connection): Promise<boolean>{
        const driver = await this.connectionService.getDriver(connection)
        return await driver.stopJfrRecording(connection)
    }
}

export const useJfrViewerService = (): JfrViewerService => {
    return mandatoryInject(jfrViewerServiceInjectionKey) as JfrViewerService
}
