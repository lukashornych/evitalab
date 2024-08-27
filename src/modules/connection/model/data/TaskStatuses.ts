import { List } from 'immutable'
import { TaskStatus } from './TaskStatus'

export class TaskStatuses {
    readonly pageSize: number
    readonly pageNumber: number
    readonly taskStatus: List<TaskStatus>
    readonly totalNumberOfRecords: number

    constructor(
        pageSize: number,
        pageNumber: number,
        taskStatus: List<TaskStatus>,
        totalNumberOfRecords: number
    ) {
        this.pageNumber = pageNumber
        this.pageSize = pageSize
        this.taskStatus = taskStatus
        this.totalNumberOfRecords = totalNumberOfRecords
    }
}
