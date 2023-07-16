export enum NotificationType {
    INFO = 'info',
    SUCCESS = 'success',
    ERROR = 'error'
}

export type NotificationData = {
    readonly type: NotificationType,
    readonly message: string,
}
