import { Catalog } from '@/modules/connection/model/Catalog'
import { Connection } from '@/modules/connection/model/Connection'
import { ConnectionService } from '@/modules/connection/service/ConnectionService'
import { mandatoryInject } from '@/utils/reactivity'
import { InjectionKey } from 'vue'

export const modifyActionServiceInjectionKey: InjectionKey<ModifyActionService> =
    Symbol('modifyActionService')

export class ModifyActionService {
    private readonly connectionService: ConnectionService

    constructor(connectionService: ConnectionService) {
        this.connectionService = connectionService
    }

    async dropCatalog(
        connection: Connection,
        catalog: string
    ): Promise<boolean> {
        const driver = await this.connectionService.getDriver(connection)
        return await driver.dropCatalog(connection, catalog)
    }

    async renameCatalog(
        connection: Connection,
        catalogName: string,
        newCatalogName: string
    ): Promise<boolean> {
        const driver = await this.connectionService.getDriver(connection)
        return await driver.renameCatalog(
            connection,
            catalogName,
            newCatalogName
        )
    }

    async createCollection(
        connection: Connection,
        collectionName: string,
        catalogName: string
    ): Promise<Catalog[] | undefined> {
        const driver = await this.connectionService.getDriver(connection)
        return await driver.createCollection(
            connection,
            collectionName,
            catalogName
        )
    }

    async getCatalogs(connection: Connection): Promise<Catalog[]> {
        const driver = await this.connectionService.getDriver(connection)
        return await driver.getCatalogs(connection)
    }

    async replaceCatalog(
        connection: Connection,
        catalogNameToBeReplaced: string,
        catalogNameToBeReplacedWith: string
    ): Promise<boolean> {
        const driver = await this.connectionService.getDriver(connection)
        return await driver.replaceCatalog(
            connection,
            catalogNameToBeReplaced,
            catalogNameToBeReplacedWith
        )
    }

    async createCatalog(
        connection: Connection,
        catalogName: string
    ): Promise<boolean> {
        const driver = await this.connectionService.getDriver(connection)
        return await driver.createCatalog(connection, catalogName)
    }

    async dropCollection(connection: Connection, collectionName: string, catalogName: string):Promise<Catalog[] | undefined> {
        const driver = await this.connectionService.getDriver(connection)
        return await driver.dropCollection(connection, collectionName, catalogName)
    }

    async renameCollection(
        connection: Connection,
        oldCollectionName: string,
        newCollectionName: string,
        catalogName: string
    ):Promise<Catalog[] | undefined> {
        const driver = await this.connectionService.getDriver(connection)
        return await driver.renameCollection(
            connection,
            oldCollectionName,
            newCollectionName,
            catalogName
        )
    }
}

export const useModifyActionService = (): ModifyActionService => {
    return mandatoryInject(
        modifyActionServiceInjectionKey
    ) as ModifyActionService
}
