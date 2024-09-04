import { EvitaDBDriverResolver } from '@/modules/connection/driver/EvitaDBDriverResolver'
import { InjectionKey } from 'vue'
import { mandatoryInject } from '@/utils/reactivity'
import { Connection } from '@/modules/connection/model/Connection'
import { FilesToFetch } from '@/modules/connection/model/data/FilesToFetch'
import { Uuid } from '@/modules/connection/model/data-type/Uuid'
import { EventType } from '@/modules/connection/model/data/EventType'

export const jfrServiceInjectionKey: InjectionKey<JfrService> = Symbol('jfrService')

export class JfrService {
    private  readonly evitaDBDriverResolver: EvitaDBDriverResolver

    constructor(evitaDBDriverResolver: EvitaDBDriverResolver) {
        this.evitaDBDriverResolver = evitaDBDriverResolver
    }

    async getAllJfrs(connection: Connection):Promise<FilesToFetch>{
        const driver = await this.evitaDBDriverResolver.resolveDriver(connection)
        return await driver.getJfrRecords(connection, 1,20)
    }

    async downloadFile(connection: Connection, fileId: Uuid):Promise<Blob> {
        const driver = await this.evitaDBDriverResolver.resolveDriver(connection)
        return await driver.downloadFile(connection, fileId)
    }

    async downloadRecordingEventTypes(connection: Connection):Promise<EventType[]>{
        const driver = await this.evitaDBDriverResolver.resolveDriver(connection)
        return await driver.downloadRecordingEventTypes(connection)
    }

    async startRecording(connection: Connection, entityTypes: string[]):Promise<boolean> {
        const driver = await this.evitaDBDriverResolver.resolveDriver(connection)
        return await driver.startJrfRecording(connection, entityTypes)
    }

    async stopRecording(connection: Connection){
        const driver = await this.evitaDBDriverResolver.resolveDriver(connection)
        return await driver.stopJfrRecording(connection)
    }
}

export const useJfrService = (): JfrService => {
    return mandatoryInject(jfrServiceInjectionKey) as JfrService
}
