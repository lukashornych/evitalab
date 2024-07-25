import { GrpcCatalogState } from '@/gen/GrpcEnums_pb'
import {
    GrpcCatalogStatistics,
    GrpcEntityCollectionStatistics,
} from '@/gen/GrpcEvitaDataTypes_pb'
import { UnexpectedError } from '@/modules/base/exception/UnexpectedError'
import { Catalog } from '@/modules/connection/model/Catalog'
import { CatalogState } from '@/modules/connection/model/CatalogState'
import { EntityCollectionStatistics } from '@/modules/connection/model/EntityCollectionStatistics'
import { Value } from '@/modules/connection/model/Value'

//TODO: Add documentation
export class CatalogConverter {
    convert(catalog: GrpcCatalogStatistics): Catalog {
        return new Catalog(
            Value.of(catalog.catalogId?.toJsonString()),
            Value.of(catalog.catalogVersion),
            catalog.catalogName,
            Value.of(this.convertEntityTypes(catalog.entityCollectionStatistics)),
            Value.of(catalog.corrupted),
            Value.of(this.convertCatalogState(catalog.catalogState)),
            Value.of(catalog.totalRecords),
            Value.of(catalog.indexCount),
            Value.of(catalog.sizeOnDiskInBytes)
        )
    }

    private convertCatalogState(catalogState: GrpcCatalogState): CatalogState {
        switch (catalogState) {
            case GrpcCatalogState.WARMING_UP:
                return CatalogState.WarmingUp
            case GrpcCatalogState.ALIVE:
                return CatalogState.Alive
            default:
                throw new UnexpectedError(
                    `Unsupported catalog state '${catalogState}'.`
                )
        }
    }

    private convertEntityTypes(
        entityTypes: GrpcEntityCollectionStatistics[]
    ): EntityCollectionStatistics[] {
        const newEntityTypes: EntityCollectionStatistics[] = []
        for (const entityType of entityTypes) {
            newEntityTypes.push(
                new EntityCollectionStatistics(
                    Value.of(entityType.entityType),
                    Value.of(entityType.totalRecords),
                    Value.of(entityType.indexCount),
                    Value.of(entityType.sizeOnDiskInBytes)
                )
            )
        }
        return newEntityTypes;
    }
}
