import { GrpcCatalogState } from "@/gen/GrpcEnums_pb"
import { GrpcCatalogStatistics } from "@/gen/GrpcEvitaDataTypes_pb"
import { UnexpectedError } from "@/modules/base/exception/UnexpectedError"
import { Catalog } from "@/modules/connection/model/Catalog"
import { CatalogState } from "@/modules/connection/model/CatalogState"
import { NamingConvention } from "@/modules/connection/model/NamingConvetion"
import { Value } from "@/modules/connection/model/Value"

export class CatalogConverter
{
    convert(catalog: GrpcCatalogStatistics): Catalog {
        return new Catalog(
            undefined, //TODO: Remove
            Value.of(catalog.catalogVersion),
            catalog.catalogName,
            Value.of(new Map([ //TODO: Add NamingConvention
                [NamingConvention.CamelCase, ''],
                [NamingConvention.PascalCase, ''],
                [NamingConvention.SnakeCase, ''],
                [NamingConvention.UpperSnakeCase, ''],
                [NamingConvention.KebabCase, '']
            ])),
            undefined, //TODO: Remove
            Value.of(catalog.corrupted),
            undefined, //TODO: Remove
            Value.of(this.convertCatalogState(catalog.catalogState))
        )
    }

    private convertCatalogState(catalogState: GrpcCatalogState): CatalogState {
        switch (catalogState) {
            case GrpcCatalogState.WARMING_UP: return CatalogState.WarmingUp
            case GrpcCatalogState.ALIVE: return CatalogState.Alive
            default: throw new UnexpectedError(`Unsupported catalog state '${catalogState}'.`)
        }
    }
}
