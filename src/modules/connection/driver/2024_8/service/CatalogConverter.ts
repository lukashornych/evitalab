import { Catalog } from '@/modules/connection/model/Catalog'
import { NamingConvention } from '@/modules/connection/model/schema/NamingConvetion'
import { Catalog as DriverCatalog, CatalogState as DriverCatalogState } from '../model/model'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { CatalogState } from '@/modules/connection/model/CatalogState'
import { Value } from '@/modules/connection/model/Value'

/**
 * Converts driver's representation of catalog into evitaLab's representation of catalog
 */
export class CatalogConverter {

    /**
     * Converts driver's representation of catalog into evitaLab's representation of catalog
     */
    convert(driverCatalog: DriverCatalog): Catalog {
        return new Catalog(
            Value.notSupported(),
            Value.of(driverCatalog.version),
            Value.of(driverCatalog.name),
            Value.of(new Map([
                [NamingConvention.CamelCase, driverCatalog.nameVariants.camelCase],
                [NamingConvention.PascalCase, driverCatalog.nameVariants.pascalCase],
                [NamingConvention.SnakeCase, driverCatalog.nameVariants.snakeCase],
                [NamingConvention.UpperSnakeCase, driverCatalog.nameVariants.upperSnakeCase],
                [NamingConvention.KebabCase, driverCatalog.nameVariants.kebabCase]
            ])),
            Value.of(driverCatalog.entityTypes),
            Value.of(driverCatalog.corrupted),
            Value.of(driverCatalog.supportsTransaction),
            Value.of(this.convertCatalogState(driverCatalog.catalogState))
        )
    }

    private convertCatalogState(driverCatalogState: DriverCatalogState): CatalogState {
        switch (driverCatalogState) {
            case DriverCatalogState.WarmingUp: return CatalogState.WarmingUp
            case DriverCatalogState.Alive: return CatalogState.Alive
            default: throw new UnexpectedError(undefined, `Unsupported catalog state '${driverCatalogState}'.`)
        }
    }
}
