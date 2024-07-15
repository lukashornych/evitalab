import { defineStore } from 'pinia'
import { computed, ComputedRef, readonly, Ref, ref, UnwrapRef } from 'vue'
import { Connection } from '@/modules/connection/model/Connection'
import { ConnectionId } from '@/modules/connection/model/ConnectionId'
import { Catalog } from '@/modules/connection/model/Catalog'
import { CatalogSchema } from '@/modules/connection/model/schema/CatalogSchema'

/**
 * Defines Pinia store for evitaDB connections
 */
export const useConnectionStore = defineStore('connections', () => {
    /**
     * List of preconfigured evitaDB servers by hosted server.
     */
    const preconfiguredConnections: Ref<UnwrapRef<Connection[]>> = ref<Connection[]>([])
    /**
     * List of configured evitaDB servers by user.
     */
    const userConnections: Ref<UnwrapRef<Connection[]>> = ref<Connection[]>([])
    /**
     * All connections
     */
    const connections: ComputedRef<Connection[]> = computed<Connection[]>(() => [
        ...(preconfiguredConnections.value as Connection[]),
        ...(userConnections.value as Connection[]),
    ])

    function replacePreconfiguredConnections(newConnections: Connection[]): void {
        preconfiguredConnections.value.splice(0, preconfiguredConnections.value.length)
        preconfiguredConnections.value.push(...newConnections)
    }

    function replaceUserConnections(newConnections: Connection[]): void {
        userConnections.value.splice(0, userConnections.value.length)
        userConnections.value.push(...newConnections)
    }


    const cachedCatalogs: Ref<Map<ConnectionId, Map<string, Catalog>>> = ref(new Map())
    const cachedCatalogSchemas: Ref<Map<ConnectionId, Map<string, CatalogSchema>>> = ref(new Map())

    return {
        preconfiguredConnections: readonly(preconfiguredConnections),
        userConnections,
        connections,
        replacePreconfiguredConnections,
        replaceUserConnections,
        cachedCatalogs,
        cachedCatalogSchemas
    }
})

export type ConnectionStore = ReturnType<typeof useConnectionStore>
