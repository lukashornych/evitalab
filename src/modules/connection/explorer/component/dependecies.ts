import { InjectionKey, provide, Ref } from 'vue'
import { Connection } from '@/modules/connection/model/Connection'
import { mandatoryInject } from '@/utils/reactivity'
import { Catalog } from '../../model/Catalog'

// todo docs
const connectionInjectionKey: InjectionKey<Connection> = Symbol('connection')
export function provideConnection(connection: Connection): void {
    provide(connectionInjectionKey, connection)
}
export function useConnection(): Connection {
    return mandatoryInject(connectionInjectionKey)
}

// todo docs
const catalogInjectionKey: InjectionKey<Ref<Catalog | undefined>> = Symbol('catalog')
export function provideCatalog(catalog: Ref<Catalog | undefined>): void {
    provide(catalogInjectionKey, catalog)
}
export function useCatalog(): Ref<Catalog | undefined> {
    return mandatoryInject(catalogInjectionKey)
}
