interface UserNotification {
    _id: string,
    user: string,
    notification: NotificationSchema
    status: string;
    read_at: Date | null;
}