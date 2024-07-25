import { GrpcDataChunk, GrpcPaginatedList, GrpcQueryResponse, GrpcStripList } from "@/gen/GrpcEvitaSessionAPI_pb";
import { EntityConverter } from "./EntityConverter";
import { Response } from "@/modules/connection/model/data/Response";
import { Value } from "@/modules/connection/model/Value";
import { DataChunk } from "@/modules/connection/model/data/DataChunk";
import { PaginatedList } from "@/modules/connection/model/data/PaginatedList";

//TOOD: Implement and add documentation
export class ResponseConverter {
    private readonly entityConverter: EntityConverter = new EntityConverter();

    convert(grpcResponse: GrpcQueryResponse) : Response {
        return new Response(
            Value.of(this.convertDataChunk(grpcResponse.recordPage))
        )
    }

    private convertDataChunk(driverDataChunk: GrpcDataChunk | undefined): DataChunk {
        if (driverDataChunk == undefined) {
            return PaginatedList.empty()
        }
        
        const grpcRecordPage = driverDataChunk
        if (grpcRecordPage.chunk.case === 'paginatedList') {
            const page :GrpcPaginatedList = driverDataChunk.chunk.value as GrpcPaginatedList;
            return new PaginatedList(
                Value.of(grpcRecordPage.sealedEntities.map(it => this.entityConverter.convert(it))),
                Value.of(grpcRecordPage.totalRecordCount),
                Value.of(grpcRecordPage.isFirst),
                Value.of(grpcRecordPage.isLast),
                Value.of(grpcRecordPage.hasPrevious),
                Value.of(grpcRecordPage.hasNext),
                Value.of(grpcRecordPage.isSinglePage),
                Value.of(grpcRecordPage.isEmpty),
                Value.of(page.pageSize),
                Value.of(page.pageNumber),
                Value.of(this.getLastPageItemNumber(page.pageNumber, page.pageSize, grpcRecordPage.totalRecordCount)),
                Value.of(this.getFirstPageItemNumber(page.pageNumber, page.pageSize, grpcRecordPage.totalRecordCount)),
                Value.of(this.getLastPageNumber(grpcRecordPage.totalRecordCount, page.pageSize))
            )
        } else if(grpcRecordPage.chunk.case === 'stripList'){
            return PaginatedList.empty();
        } else {
            return PaginatedList.empty()
        }
    }

    private getLastPageNumber(totalRecordCount: number, pageSize: number) :number {
		return Math.ceil(totalRecordCount / pageSize);
	}

    private isRequestedResultBehindLimit(pageNumber: number, pageSize: number, totalRecordCount: number): boolean {
        return ((pageNumber - 1) * pageSize) + 1 > totalRecordCount;
    }

    private getFirstItemNumberForPage(pageNumber: number, pageSize: number): number {
        const firstRecord = (pageNumber - 1) * pageSize;
        return Math.max(firstRecord, 0);
    }

    private getFirstPageItemNumber(pageNumber: number, pageSize: number, totalRecordCount: number): number {
        if (this.isRequestedResultBehindLimit(pageNumber, pageSize, totalRecordCount)) {
            return 0;
        }
        return this.getFirstItemNumberForPage(pageNumber, pageSize);
    }

    getLastPageItemNumber(pageNumber: number, pageSize: number, totalRecordCount: number): number {
        const result = (pageNumber * pageSize) - 1;
        return Math.min(result, totalRecordCount);
    }
}
