import { defineStore } from 'pinia'
import { computed, ComputedRef, readonly, Ref, ref, UnwrapRef } from 'vue'
import { EvitaDBConnection } from '@/modules/connection/model/EvitaDBConnection'

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

    return {
        preconfiguredConnections: readonly(preconfiguredConnections),
        userConnections,
        connections,
        replacePreconfiguredConnections,
        replaceUserConnections
    }
})

export type ConnectionStore = ReturnType<typeof useConnectionStore>
