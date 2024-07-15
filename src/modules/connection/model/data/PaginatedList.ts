import { DataChunk } from '@/modules/connection/model/data/DataChunk'
import { Entity } from '@/modules/connection/model/data/Entity'
import { Value } from '@/modules/connection/model/Value'

/**
 * evitaLab's representation of a paginated list independent of specific evitaDB version
 */
export class PaginatedList extends DataChunk {

    readonly pageSize: Value<number>
    readonly pageNumber: Value<number>
    readonly lastPageItemNumber: Value<number>
    readonly firstPageItemNumber: Value<number>
    readonly lastPageNumber: Value<number>

    constructor(data: Value<Entity[]>,
                totalRecordCount: Value<number>,
                first: Value<boolean>,
                last: Value<boolean>,
                hasPrevious: Value<boolean>,
                hasNext: Value<boolean>,
                singlePage: Value<boolean>,
                empty: Value<boolean>,
                pageSize: Value<number>,
                pageNumber: Value<number>,
                lastPageItemNumber: Value<number>,
                firstPageItemNumber: Value<number>,
                lastPageNumber: Value<number>) {
        super(data, totalRecordCount, first, last, hasPrevious, hasNext, singlePage, empty)
        this.pageSize = pageSize
        this.pageNumber = pageNumber
        this.lastPageItemNumber = lastPageItemNumber
        this.firstPageItemNumber = firstPageItemNumber
        this.lastPageNumber = lastPageNumber
    }

    static empty(): PaginatedList {
        return new PaginatedList(
            Value.of([]),
            Value.of(0),
            Value.of(true),
            Value.of(false),
            Value.of(false),
            Value.of(false),
            Value.of(true),
            Value.of(true),
            Value.of(1),
            Value.of(20),
            Value.of(0),
            Value.of(0),
            Value.of(1)
        )
    }
}
