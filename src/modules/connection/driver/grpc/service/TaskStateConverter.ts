import { GrpcTaskSimplifiedState } from "../gen/GrpcEnums_pb"
import { TaskState } from '@/modules/connection/model/task/TaskState'
// todo lho refactor
export class TaskStateConverter {

    convertTaskStates(taskStates: GrpcTaskSimplifiedState[]):TaskState[] {
        const statuses: TaskState[] = []
        for(const status of taskStates) {
            statuses.push(this.convertTaskState(status))
        }
        return statuses
    }

    convertTaskStatesToGrpc(taskStates: TaskState[]): GrpcTaskSimplifiedState[] {
        const statuses: GrpcTaskSimplifiedState[] = [];
        for (const status of taskStates) {
            statuses.push(this.convertTaskStateToGrpc(status))
        }
        return statuses;
    }

    convertTaskStateToGrpc(status: TaskState):GrpcTaskSimplifiedState{
        switch (status) {
            case TaskState.Failed:
                return GrpcTaskSimplifiedState.TASK_FAILED
            case TaskState.Finished:
                return GrpcTaskSimplifiedState.TASK_FINISHED
            case TaskState.Queued:
                return GrpcTaskSimplifiedState.TASK_QUEUED
            case TaskState.Running:
                return GrpcTaskSimplifiedState.TASK_RUNNING
        }
    }

    convertTaskState(status: GrpcTaskSimplifiedState):TaskState{
        switch(status){
            case GrpcTaskSimplifiedState.TASK_FAILED:
                return TaskState.Failed
            case GrpcTaskSimplifiedState.TASK_FINISHED:
                return TaskState.Finished
            case GrpcTaskSimplifiedState.TASK_QUEUED:
                return TaskState.Queued
            case GrpcTaskSimplifiedState.TASK_RUNNING:
                return TaskState.Running
        }
    }
}
