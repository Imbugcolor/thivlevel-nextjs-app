'use client'
import { removeNotify, setNotify } from '@/lib/features/notifySlice';
import { useAppDispatch } from '@/lib/hooks';
import React, { useEffect, useState } from 'react'
import NotificationsSystem, { atalhoTheme, useNotifications } from 'reapop';

export default function Popup() {
    const dispatch = useAppDispatch()

    // 1. Retrieve the notifications to display, and the function used to dismiss a notification.
    const { notifications, dismissNotification } = useNotifications();

    const handleDissmissNoti = (id: any) => {
        dismissNotification(id)
        dispatch(removeNotify())
    }

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
    setIsClient(true);
    }, []);

    if (!isClient) {
        return null; // Or return a skeleton/loading component
    }

    return (
        <>
            <NotificationsSystem
                // 2. Pass the notifications you want Reapop to display.
                notifications={notifications}
                // 3. Pass the function used to dismiss a notification.
                dismissNotification={(id) => handleDissmissNoti(id)}
                // 4. Pass a builtIn theme or a custom theme.
                theme={atalhoTheme}
            />
        </>
    );
}
