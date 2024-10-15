import moment from 'moment'
import styles from './notification.module.css'
import React from 'react'
import Image from 'next/image'
import InforBox from '../../../images/infor.jpg'

export default function NotificationItem({ notification }: { notification: NotificationSchema }) {
  return (
    <div className={styles['notification-item']}>
        <div className={styles["notification-image"]}>
        {/* Display image */}
        <Image
          src={ notification.image_url ? notification.image_url : InforBox}
          alt="Notification"
          width={40}
          height={40}
          className={styles["notification-img"]}
        />
      </div>
      <div className={styles["notification-content"]}>
        <p className={styles["notification-message"]}>{notification.message}</p>
        <p className={styles["notification-time"]}>
          {moment(notification.createdAt).fromNow()}
        </p>
      </div>
    </div>
    
  )
}
