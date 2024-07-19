import { GrpcCatalogState } from "@/gen/GrpcEnums_pb"
import { GrpcCatalogStatistics } from "@/gen/GrpcEvitaDataTypes_pb"
import { UnexpectedError } from "@/modules/base/exception/UnexpectedError"
import { Catalog } from "@/modules/connection/model/Catalog"
import { CatalogState } from "@/modules/connection/model/CatalogState"
import { NamingConvention } from "@/modules/connection/model/NamingConvetion"
import { Value } from "@/modules/connection/model/Value"

export class CatalogConverter
{
    convert(driverCatalog: GrpcCatalogStatistics): Catalog {
        return new Catalog(
            undefined,
            Value.of(driverCatalog.catalogVersion),
            driverCatalog.catalogName,
            Value.of(new Map([
                [NamingConvention.CamelCase, ''],
                [NamingConvention.PascalCase, ''],
                [NamingConvention.SnakeCase, ''],
                [NamingConvention.UpperSnakeCase, ''],
                [NamingConvention.KebabCase, '']
            ])),
            undefined,
            Value.of(driverCatalog.corrupted),
            undefined,
            Value.of(this.convertCatalogState(driverCatalog.catalogState))
        )
    }

    private convertCatalogState(driverCatalogState: GrpcCatalogState): CatalogState {
        switch (driverCatalogState) {
            case GrpcCatalogState.WARMING_UP: return CatalogState.WarmingUp
            case GrpcCatalogState.ALIVE: return CatalogState.Alive
            default: throw new UnexpectedError(`Unsupported catalog state '${driverCatalogState}'.`)
        }
    }
}
