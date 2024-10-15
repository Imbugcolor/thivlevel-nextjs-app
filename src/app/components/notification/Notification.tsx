'use client'
import styles from './notification.module.css'
import React, { useEffect, useRef, useState } from 'react'
import { FaRegBell } from 'react-icons/fa'
import NotificationDropDown from './NotificationDropDown';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { addGeneralNotification, addUserNotification } from '@/lib/features/notificationSlice';

export default function Notification() {
    const [isOpen, setIsOpen] = useState(false);
    const userNotifications = useAppSelector(state => state.notification).user
    const socket = useAppSelector(state => state.client).socket
    const dispatch = useAppDispatch()
    const dropdownRef = useRef<HTMLDivElement>(null);
    const bellRef = useRef<HTMLDivElement>(null);

    // Toggle dropdown visibility when bell icon is clicked
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Check if the click is outside both the dropdown and bell button
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                bellRef.current &&
                !bellRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false) // Close the dropdown if click is outside
            }
        };

        // Attach event listener to detect outside clicks when dropdown is open
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup the event listener when the dropdown closes
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (socket) {
            console.log('render')
            socket.on('sendNotification', (message: any) => {
                console.log(message)
                if (message && message.user) {
                    return dispatch(addUserNotification(message))
                }
                return dispatch(addGeneralNotification(message))
            });
          
            return () => {
                socket.off('sendNotification')
            }
        }
    },[socket, dispatch])

    return (
        <>
            <div className={styles['bell-notification']} ref={bellRef} onClick={toggleDropdown} >
                <FaRegBell />
                {
                    userNotifications.unreads > 0 &&
                    <span className={styles['notifications-unreads-number']}>{userNotifications.unreads}</span>
                }
            </div>

            {isOpen && (
                <div className={styles['notification-dropdown']} ref={dropdownRef}>
                    <NotificationDropDown setIsOpen={setIsOpen}/>
                </div>
            )}
        </>
    )
}
