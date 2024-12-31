import styles from './notification.module.css'
import { notificationApiRequest } from '@/app/api-request/notification.api';
import { getGeneralNotifications, getUserNotifications, readUserNotification } from '@/lib/features/notificationSlice';
import { setNotify } from '@/lib/features/notifySlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { HttpError } from '@/lib/utils/http';
import React, { useEffect, useState } from 'react'
import NotificationItem from './NotificationItem';
import { useRouter } from 'next/navigation';
import UserNotificationItem from './UserNotificationItem';

export default function NotificationList(
    { type, setIsOpen }: { type: string, setIsOpen: (open: boolean) => void }
) {
    const token = useAppSelector(state => state.auth).token
    const userNotifications = useAppSelector(state => state.notification).user
    const generalNotifications = useAppSelector(state => state.notification).general
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [loading, setLoading] = useState(false);

    // notification
    useEffect(() => {
        if (!token) return;
        const fetch = async () => {
            try {
                setLoading(true)
                if (type === 'user') {
                    const response = await notificationApiRequest.getUserNotifications(token, dispatch, 10, userNotifications.page)
                    dispatch(getUserNotifications({
                        data: response.payload.data,
                        total: response.payload.total,
                        page: parseInt(response.payload.page)
                    }))
                }
                if (type === 'general') {
                    const response = await notificationApiRequest.getGeneralNotifications(token, dispatch, 10, generalNotifications.page)
                    dispatch(getGeneralNotifications({
                        data: response.payload.data,
                        total: response.payload.total,
                        page: parseInt(response.payload.page)
                    }))
                }
            } catch (error) {
                if (error instanceof HttpError) {
                    setLoading(false)
                    // Handle the specific HttpError
                    console.log("Error message:", error.message);
                    // Example: show error message to the user
                    dispatch(setNotify({ error: error.message }))
                } else {
                    setLoading(false)
                    // Handle other types of errors
                    console.log("An unexpected error occurred:", error);
                    dispatch(setNotify({ error: 'Lỗi hệ thống.' }))
                }
            } finally {
                setLoading(false)
            }
            fetch()
        }
    }, [type, token, dispatch, userNotifications.page, generalNotifications.page])

    const handleReadNotification = async (item: UserNotification) => {
        if (item.notification.target_url) {
            router.push(item.notification.target_url)
        }
        setIsOpen(false)
        if (token && item.status === 'UNREAD') {
            try {
                dispatch(readUserNotification({ id: item._id }))
                await notificationApiRequest.read(token, dispatch, item._id);
            } catch (error) {
                if (error instanceof HttpError) {
                    dispatch(setNotify({ error: error.message }))
                } else {
                    console.log("An unexpected error occurred:", error);
                    dispatch(setNotify({ error: 'Lỗi hệ thống.' }))
                }
            }
        }
    }
    return (
        <div>
            {
                type === 'user' &&
                <div>
                    {
                        userNotifications.total === 0 && <span>Không có thông báo nào.</span>
                    }
                    {
                        userNotifications.total > 0 && userNotifications.data.map(item => (
                            <div key={item._id}
                                className={item.status === 'UNREAD' ? styles['unread-notfification'] : ''}
                                onClick={() => handleReadNotification(item)}
                            >
                                <UserNotificationItem notification={item} />
                            </div>
                        ))
                    }
                </div>
            }
            {
                type === 'general' &&
                <div>
                    {
                        generalNotifications.total === 0 && <span>Không có thông báo nào.</span>
                    }
                    {
                        generalNotifications.total > 0 && generalNotifications.data.map(item => (
                            <div key={item._id}>
                                <NotificationItem notification={item} />
                            </div>
                        ))
                    }
                </div>
            }
        </div>
    )
}
