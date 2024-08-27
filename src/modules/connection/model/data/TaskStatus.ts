import { OffsetDateTime } from "../data-type/OffsetDateTime"
import { Uuid } from "../data-type/Uuid"
import { File } from "./File"

export class TaskStatus {
    readonly taskType: string
    readonly taskName: string
    readonly taskId: Uuid
    readonly catalogName: string
    readonly issued: OffsetDateTime
    readonly started: OffsetDateTime
    readonly finished: OffsetDateTime
    readonly progress: number
    readonly settings: string
    readonly result: string | File
    readonly exception: string

    constructor(taskType: string, taskName: string, taskId: Uuid, catalogName: string, issued: OffsetDateTime, started: OffsetDateTime, finished: OffsetDateTime, progress: number, settings: string, result: string | File, exception: string){
        this.taskType = taskType
        this.taskName = taskName
        this.taskId = taskId
        this.catalogName = catalogName
        this.issued = issued
        this.started = started
        this.finished = finished
        this.progress = progress
        this.settings = settings
        this.result = result
        this.exception = exception
    }
}