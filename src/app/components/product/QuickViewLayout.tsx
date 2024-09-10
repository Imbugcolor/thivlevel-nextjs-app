'use client'
import { useAppSelector } from '@/lib/hooks'
import React from 'react'
import QuickView from './QuickView'

export default function QuickViewLayout() {
    const quickview = useAppSelector(state => state.quickview).product
    return (
        <>
            {
                quickview && <div className="product-view-detail-box"><QuickView /> </div>
            }
        </>
    )
}
