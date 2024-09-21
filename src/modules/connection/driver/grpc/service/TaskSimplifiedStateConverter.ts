import { TaskSimplifiedState } from "@/modules/connection/model/data/TaskSimplifiedState"
import { GrpcTaskSimplifiedState } from "../gen/GrpcEnums_pb"

export class TaskSimplifiedStateConverter {
    convertTaskStates(taskStates: GrpcTaskSimplifiedState[]):TaskSimplifiedState[] {
        const statuses: TaskSimplifiedState[] = []
        for(const status of taskStates) {
            statuses.push(this.convertTaskState(status))
        } 
        return statuses
    }

    convertTaskStatesToGrpc(taskStates: TaskSimplifiedState[]): GrpcTaskSimplifiedState[] {
        const statuses: GrpcTaskSimplifiedState[] = [];
        for (const status of taskStates) {
            statuses.push(this.convertTaskStateToGrpc(status))
        }
        return statuses;
    }

    convertTaskStateToGrpc(status: TaskSimplifiedState):GrpcTaskSimplifiedState{
        switch (status) {
            case TaskSimplifiedState.TaskFailed:
                return GrpcTaskSimplifiedState.TASK_FAILED
            case TaskSimplifiedState.TaskFinished:
                return GrpcTaskSimplifiedState.TASK_FINISHED
            case TaskSimplifiedState.TaskQueued:
                return GrpcTaskSimplifiedState.TASK_QUEUED
            case TaskSimplifiedState.TaskRunning:
                return GrpcTaskSimplifiedState.TASK_RUNNING
        }
    }

    convertTaskState(status: GrpcTaskSimplifiedState):TaskSimplifiedState{
        switch(status){
            case GrpcTaskSimplifiedState.TASK_FAILED:
                return TaskSimplifiedState.TaskFailed
            case GrpcTaskSimplifiedState.TASK_FINISHED:
                return TaskSimplifiedState.TaskFinished
            case GrpcTaskSimplifiedState.TASK_QUEUED:
                return TaskSimplifiedState.TaskQueued
            case GrpcTaskSimplifiedState.TASK_RUNNING:
                return TaskSimplifiedState.TaskRunning
        }
    }
}