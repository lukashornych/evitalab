import { defineStore } from 'pinia'
import { computed, ComputedRef, reactive, Ref, ref, shallowReadonly, UnwrapRef } from 'vue'
import { Connection } from '@/modules/connection/model/Connection'
import { ConnectionId } from '@/modules/connection/model/ConnectionId'
import { Catalog } from '@/modules/connection/model/Catalog'
import { CatalogSchema } from '@/modules/connection/model/schema/CatalogSchema'
import { UnwrapNestedRefs } from '@vue/reactivity'

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


    const cachedCatalogs: UnwrapNestedRefs<Map<ConnectionId, Map<string, Catalog>>> = reactive(new Map())
    const cachedCatalogSchemas: UnwrapNestedRefs<Map<ConnectionId, Map<string, CatalogSchema>>> = reactive(new Map())

    const catalogs = computed(() => {
        return (connectionId: ConnectionId) => {
            return Array.from(cachedCatalogs.get(connectionId)?.values() || [])
        }
    })

    return {
        preconfiguredConnections: shallowReadonly(preconfiguredConnections),
        userConnections,
        connections,
        replacePreconfiguredConnections,
        replaceUserConnections,
        cachedCatalogs,
        cachedCatalogSchemas,
        catalogs
    }
})

export type ConnectionStore = ReturnType<typeof useConnectionStore>
