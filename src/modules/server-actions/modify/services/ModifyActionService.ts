import { Connection } from "@/modules/connection/model/Connection";
import { ConnectionService } from "@/modules/connection/service/ConnectionService";
import { mandatoryInject } from "@/utils/reactivity";
import { InjectionKey } from "vue";

export const modifyActionServiceInjectionKey: InjectionKey<ModifyActionService> = Symbol('modifyActionService')

export class ModifyActionService {
    private readonly connectionService: ConnectionService
    
    constructor(evitaDBDriver: ConnectionService) {
        this.connectionService = evitaDBDriver
    }

    async dropCatalog(connection: Connection, catalog: string):Promise<boolean>{
        const driver = await this.connectionService.getDriver(connection)
        return await driver.dropCatalog(connection, catalog)
    }

    async renameCatalog(connection: Connection, catalogName: string, newCatalogName: string):Promise<boolean>{
        const driver = await this.connectionService.getDriver(connection)
        return await driver.renameCatalog(connection, catalogName, newCatalogName)
    }
}

export const useModifyActionService = (): ModifyActionService => {
    return mandatoryInject(modifyActionServiceInjectionKey) as ModifyActionService
}