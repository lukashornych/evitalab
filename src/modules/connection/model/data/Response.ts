import { DataChunk } from '@/modules/connection/model/data/DataChunk'
import { Value } from '@/modules/connection/model/Value'

/**
 * evitaLab's representation of a full response independent of specific evitaDB version
 */
export class Response {

    readonly recordPage: Value<DataChunk>
    readonly result: string

    constructor(recordPage: Value<DataChunk>, result: string) {
        this.recordPage = recordPage
        this.result = result
    }
}
