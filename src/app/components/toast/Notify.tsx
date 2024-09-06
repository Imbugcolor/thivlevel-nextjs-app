'use client'
import { useAppSelector } from '@/lib/hooks';
import React, { useEffect } from 'react'
import { useNotifications } from 'reapop';
import Loading from '../loading/Loading';

export default function Notify() {
    const alert = useAppSelector(state => state.notify)

    const { notify } = useNotifications();

    useEffect(() => {
      alert.error && 
            notify({
              title: 'Oh no!',
              message: alert.error,
              status: 'error'
            })
      alert.success && 
            notify({
              title: alert.success,
              status: 'success'
            })
    }, [notify, alert])

  return (
    <div>
       {alert.loading && <Loading />}
    </div>
  )
}
