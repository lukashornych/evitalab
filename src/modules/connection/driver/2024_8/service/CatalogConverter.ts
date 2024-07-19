import { Catalog } from '@/modules/connection/model/Catalog'
import { NamingConvention } from '@/modules/connection/model/NamingConvetion'
import { Catalog as DriverCatalog, CatalogState as DriverCatalogState } from '../model/model'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { CatalogState } from '@/modules/connection/model/CatalogState'
import { Value } from '@/modules/connection/model/Value'
import { Converter } from '@/modules/connection/driver/2024_8/service/Converter'
import { GrpcCatalogStatistics } from '@/gen/GrpcEvitaDataTypes_pb'

/**
 * Converts driver's representation of catalog into evitaLab's representation of catalog
 */
export class CatalogConverter implements Converter<DriverCatalog, Catalog> {

    /**
     * Converts driver's representation of catalog into evitaLab's representation of catalog
     */
    convert(driverCatalog: DriverCatalog): Catalog {
        return new Catalog(
            Value.of(driverCatalog.catalogId),
            Value.of(driverCatalog.version as unknown as BigInt),
            driverCatalog.name,
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
            default: throw new UnexpectedError(`Unsupported catalog state '${driverCatalogState}'.`)
        }
    }
}
