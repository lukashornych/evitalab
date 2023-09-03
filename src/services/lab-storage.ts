import { IncompatibleStorageVersionError } from '@/model/lab-storage'
import store from 'store2'

/**
 * Actual storage version of the current build.
 *
 * Represents a version of lab storage. Used to indicate with which versions of the lab this storage is compatible.
 * Because every new version requires empty storage, this version should be increased only with breaking changes
 * to storage format.
 */
const buildVersion = 1

/**
 * Global (version-agnostic) lab metadata. Used mainly to manage specific lab versions.
 */
export enum LabStorageGlobalItemType {
    InitializedVersions = 'initialized-versions',
}

/**
 * Actual supported lab storage items. These are supported only by the current version of the lab.
 */
export enum LabStorageVersionedItemType {
    Connections = 'connections',
    // todo lho implement, just a mockup
    // Tabs = 'tabs',
    // Settings = 'settings'
}

/**
 * System-wide manager of storage. Used for all data that need to be persisted between lab starts (connections, settings, ...).
 */
export class LabStorage {
    readonly storage: any

    constructor() {
        // obtain storage for the current build version
        this.storage = store.namespace('labv' + buildVersion)
    }

    /**
     * Initializes the storage for the current build version.
     */
    initialize(): void {
        const initializedVersions: number[] = JSON.parse(store.get(LabStorageGlobalItemType.InitializedVersions, '[]'))
        const currentVersionInitialized: boolean = initializedVersions.includes(buildVersion)
        const incompatibleVersionDetected: boolean = initializedVersions.length > 0 && !currentVersionInitialized
        if (!currentVersionInitialized) {
            initializedVersions.push(buildVersion)
            this.storeGlobalItem(LabStorageGlobalItemType.InitializedVersions, initializedVersions)

            this.initializeEmptyStorage()
        }
        if (incompatibleVersionDetected) {
            throw new IncompatibleStorageVersionError()
        }
    }

    /**
     * Retrieves a single item from the storage.
     *
     * @param type which item to retrieve
     * @param mapper maps the stringified item to the desired type as we don't know the type of the item
     */
    getItem(type: LabStorageVersionedItemType, mapper: (item: string) => any): any {
        return mapper(this.storage.get(type))
    }

    /**
     * Stores a single item to the storage.
     *
     * @param type what the item represents
     * @param item actual item
     */
    storeItem(type: LabStorageVersionedItemType, item: any): void {
        this.storage.set(type, this.stringifyItem(item), true)
    }

    /**
     * Fills new storage with default data.
     * @private
     */
    private initializeEmptyStorage(): void {
        this.storage.set(LabStorageVersionedItemType.Connections, JSON.stringify([]))
    }

    /**
     * Stores a single item to the global (version-agnostic) storage.
     *
     * @param type what the item represents
     * @param item actual item
     * @private
     */
    private storeGlobalItem(type: LabStorageGlobalItemType, item: any): void {
        store.set(type, this.stringifyItem(item), true)
    }

    private stringifyItem(item: any) {
        if (item instanceof Object) {
            return JSON.stringify(item)
        } else {
            return item.toString()
        }
    }
}
