import { addAdminNotification } from '@/lib/features/notificationSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import moment from 'moment'
import React, { useEffect } from 'react'
import InforBox from '../../../../../images/infor.jpg'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function AdminNotification() {
    const notifications = useAppSelector(state => state.notification).admin
    const socket = useAppSelector(state => state.client).socket
    const dispatch = useAppDispatch()
    const router = useRouter()

    useEffect(() => {
        if (socket) {
            socket.on('sendNotification', (message: any) => {
                console.log(message)
                if (message) {
                    return dispatch(addAdminNotification(message))
                }
            });

            return () => {
                socket.off('sendNotification')
            }
        }
    }, [socket, dispatch])

    const handleNotificationClick = (notification: NotificationSchema) => {
        if (notification.target_url) {
            router.push(notification.target_url);
        }
    }
    return (
        <>
            <button className="dropdown-item py-3 border-bottom">
                <p className="mb-0 fw-medium float-start">
                    {notifications.total > 0 ? 'You have new notifications' : 'You do not have any notifications yet'}{" "}
                </p>
                <span className="badge badge-pill badge-primary float-end">
                    View all
                </span>
            </button>
            {
                notifications.total > 0 && notifications.data.map(item => (
                    <button 
                        className="dropdown-item preview-item py-3"
                        key={item._id} 
                        onClick={() => handleNotificationClick(item)}
                    >
                        <div className="preview-thumbnail">
                            {item.image_url &&
                                <Image
                                    src={item.image_url ? item.image_url : InforBox} 
                                    height={40} 
                                    width={40} 
                                    alt='thumnail-notification'
                                    className='object-fit-cover'
                                />
                            }
                        </div>
                        <div className="preview-item-content">
                            <h6 className="preview-subject fw-normal text-dark mb-1">
                                {item.message}
                            </h6>
                            <p className="fw-light small-text mb-0"> {moment(item.createdAt).fromNow()} </p>
                        </div>
                    </button>
                ))
            }
        </>
    )
}
