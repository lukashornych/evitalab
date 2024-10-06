/**
 * State of a server task
 */
export enum TaskState {
    Queued = 'queued',
    Running = 'running',
    Finished = 'finished',
    Failed = 'failed'
}
