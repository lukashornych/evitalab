import { List } from 'immutable'
import { TaskStatus } from './TaskStatus'

export class TaskStatuses {
    readonly pageSize: number
    readonly pageNumber: number
    readonly statuses: List<TaskStatus>
    readonly totalNumberOfRecords: number

    constructor(
        pageSize: number,
        pageNumber: number,
        statuses: List<TaskStatus>,
        totalNumberOfRecords: number
    ) {
        this.pageNumber = pageNumber
        this.pageSize = pageSize
        this.statuses = statuses
        this.totalNumberOfRecords = totalNumberOfRecords
    }
}
