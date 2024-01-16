import { DataGridDataPointer, NativeValue, QueryResult } from '@/model/editor/data-grid'
import { LabService } from '@/services/lab.service'

/**
 * Executes query against evitaDB server in language defined by implementation.
 */
export abstract class QueryExecutor {
    protected readonly labService: LabService

    protected constructor(labService: LabService) {
        this.labService = labService
    }

    /**
     * Executes a query against evitaDB server in language defined by implementation and returns formatted data.
     *
     * @param dataPointer points to a collection where to fetch data from
     * @param query pre-built query to execute in language defined by implementation
     */
    abstract executeQuery(dataPointer: DataGridDataPointer, query: string): Promise<QueryResult>

    /**
     * Converts an entity property value to properly formatted {@link NativeValue} wrapper.
     * @param value a raw entity property value
     * @protected
     */
    protected wrapRawValueIntoNativeValue(value: any): NativeValue | NativeValue[] {
        if (value instanceof Array) {
            return value.map(item => new NativeValue(item))
        } else {
            return new NativeValue(value)
        }
    }
}
