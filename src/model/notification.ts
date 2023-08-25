export enum NotificationType {
    Info = 'info',
    Success = 'success',
    Error = 'error'
}

export type NotificationData = {
    readonly type: NotificationType,
    readonly message: string,
}
