import { InjectionKey, provide, Ref } from 'vue'
import { Connection } from '@/modules/connection/model/Connection'
import { mandatoryInject } from '@/utils/reactivity'
import { CatalogSchema } from '@/modules/connection/model/schema/CatalogSchema'

// todo docs
const connectionInjectionKey: InjectionKey<Connection> = Symbol('connection')
export function provideConnection(connection: Connection): void {
    provide(connectionInjectionKey, connection)
}
export function useConnection(): Connection {
    return mandatoryInject(connectionInjectionKey)
}

// todo docs
const catalogSchemaInjectionKey: InjectionKey<Ref<CatalogSchema | undefined>> = Symbol('catalogSchema')
export function provideCatalogSchema(catalogSchema: Ref<CatalogSchema | undefined>): void {
    provide(catalogSchemaInjectionKey, catalogSchema)
}
export function useCatalogSchema(): Ref<CatalogSchema | undefined> {
    return mandatoryInject(catalogSchemaInjectionKey)
}
