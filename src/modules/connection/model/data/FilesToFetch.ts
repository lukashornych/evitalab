import { Immutable } from "@babel/types"
import { File } from "./File"

export class FilesToFetch {
    readonly pageSize: number
    readonly pageNumber: number
    readonly filesToFetch: Immutable.List<File>
    readonly totalNumberOfRecords: number

    constructor(pageSize: number, pageNumber: number, filesToFetch: Immutable.List<File>, totalNumberOfRecords: number){
        this.pageSize = pageSize
        this.pageNumber = pageNumber
        this.filesToFetch = filesToFetch
        this.totalNumberOfRecords = totalNumberOfRecords
    }
}