import { Converter } from '@/modules/connection/driver/2024_8/service/Converter'
import { Response } from '@/modules/connection/model/data/Response'
import {
    DataChunk as DriverDataChunk,
    RecordPage as DriverRecordPage,
    Response as DriverResponse
} from '../model/model'
import { EntityConverter } from '@/modules/connection/driver/2024_8/service/EntityConverter'
import { DataChunk } from '@/modules/connection/model/data/DataChunk'
import { Value } from '@/modules/connection/model/Value'
import { PaginatedList } from '@/modules/connection/model/data/PaginatedList'

/**
 * Converts driver's representation of full response into evitaLab's representation of full response
 */
export class ResponseConverter implements Converter<DriverResponse, Response> {

    private readonly entityConverter: EntityConverter = new EntityConverter()

    /**
     * Converts driver's representation of full response into evitaLab's representation of full response
     */
    convert(driverResponse: DriverResponse): Response {
        return new Response(
            Value.of(this.convertDataChunk(driverResponse.recordPage))
        )
    }

    private convertDataChunk(driverDataChunk: DriverDataChunk | undefined): DataChunk {
        if (driverDataChunk == undefined) {
            return PaginatedList.empty()
        }

        const type = driverDataChunk.type
        if (type === 'PAGE') {
            const driverRecordPage: DriverRecordPage = driverDataChunk as DriverRecordPage
            return new PaginatedList(
                Value.of(driverRecordPage.data.map(it => this.entityConverter.convert(it))),
                Value.of(driverRecordPage.totalRecordCount),
                Value.of(driverRecordPage.first),
                Value.of(driverRecordPage.last),
                Value.of(driverRecordPage.hasPrevious),
                Value.of(driverRecordPage.hasNext),
                Value.of(driverRecordPage.singlePage),
                Value.of(driverRecordPage.empty),
                Value.of(driverRecordPage.pageSize),
                Value.of(driverRecordPage.pageNumber),
                Value.of(driverRecordPage.lastPageItemNumber),
                Value.of(driverRecordPage.firstPageItemNumber),
                Value.of(driverRecordPage.lastPageNumber)
            )
        } else {
            return PaginatedList.empty()
        }
    }
}
