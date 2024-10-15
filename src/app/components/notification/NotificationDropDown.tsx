import styles from './notification.module.css'
import React, { useState } from 'react'
import NotificationList from './NotificationList';
import { useAppSelector } from '@/lib/hooks';

export default function NotificationDropDown({ setIsOpen }: { setIsOpen: (open: boolean) => void}) {
    const userNotifications = useAppSelector(state => state.notification).user
    const [activeTab, setActiveTab] = useState('user'); // Default tab is "user"

    // Tab content (conditional rendering)
    const renderTabContent = () => {
        if (activeTab === 'user') {
            return <NotificationList type="user" setIsOpen={setIsOpen}/>;
        }
        if (activeTab === 'general') {
            return <NotificationList type="general" setIsOpen={setIsOpen}/>;
        }
    };

    return (
        <div>
            <div className={styles['tab-menu']}>
                <button
                    className={`${styles['tab-button']} ${activeTab === 'user' ? styles['active'] : ''}`}
                    onClick={() => setActiveTab('user')}
                >
                    Quan trọng
                    {
                        userNotifications.unreads > 0 &&
                        <span className={styles['unreads-count']}>
                            {userNotifications.unreads > 9 ? '9+' : userNotifications.unreads}
                        </span>
                    }
                </button>
                <button
                    className={`${styles['tab-button']} ${activeTab === 'general' ? styles['active'] : ''}`}
                    onClick={() => setActiveTab('general')}
                >
                    Thông báo chung
                </button>
            </div>
            <div className={styles['tab-content']}>{renderTabContent()}</div>
        </div>
    )
}
