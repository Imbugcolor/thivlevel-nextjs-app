'use client'
import { NotificationsProvider, setUpNotifications } from 'reapop';
import Popup from './components/toast/Popup';

setUpNotifications({
    defaultProps: {
        position: "top-right",
        dismissible: true,
        dismissAfter: 5000,
        showDismissButton: true,
    }
});

export default function ReapopProvider({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <NotificationsProvider>
            <Popup />
            {children}
        </NotificationsProvider>
    )
}