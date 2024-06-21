import { NotificationType } from '@/modules/workspace/notification/model/NotificationType'

export type NotificationData = {
    readonly type: NotificationType,
    readonly message: string,
}
