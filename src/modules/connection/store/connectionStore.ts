import { defineStore } from 'pinia'
import { computed, ComputedRef, readonly, Ref, ref, UnwrapRef } from 'vue'
import { EvitaDBConnection } from '@/modules/connection/model/EvitaDBConnection'
import { EvitaDBConnectionId } from '@/modules/connection/model/EvitaDBConnectionId'
import { Catalog, CatalogSchema } from '@/modules/connection/driver/model/evitadb'

/**
 * Defines Pinia store for evitaDB connections
 */
export const useConnectionStore = defineStore('connections', () => {
    /**
     * List of preconfigured evitaDB servers by hosted server.
     */
    const preconfiguredConnections: Ref<UnwrapRef<EvitaDBConnection[]>> = ref<EvitaDBConnection[]>([])
    /**
     * List of configured evitaDB servers by user.
     */
    const userConnections: Ref<UnwrapRef<EvitaDBConnection[]>> = ref<EvitaDBConnection[]>([])
    /**
     * All connections
     */
    const connections: ComputedRef<EvitaDBConnection[]> = computed<EvitaDBConnection[]>(() => [
        ...(preconfiguredConnections.value as EvitaDBConnection[]),
        ...(userConnections.value as EvitaDBConnection[]),
    ])

    function replacePreconfiguredConnections(newConnections: EvitaDBConnection[]): void {
        preconfiguredConnections.value.splice(0, preconfiguredConnections.value.length)
        preconfiguredConnections.value.push(...newConnections)
    }

    function replaceUserConnections(newConnections: EvitaDBConnection[]): void {
        userConnections.value.splice(0, userConnections.value.length)
        userConnections.value.push(...newConnections)
    }


    const cachedCatalogs: Ref<Map<EvitaDBConnectionId, Map<string, Catalog>>> = ref(new Map())
    const cachedCatalogSchemas: Ref<Map<EvitaDBConnectionId, Map<string, CatalogSchema>>> = ref(new Map())

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
