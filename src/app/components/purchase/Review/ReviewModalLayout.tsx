'use client'
import { useAppSelector } from '@/lib/hooks'
import React from 'react'
import ReviewModal from './ReviewModal'

export default function ReviewModalLayout() {
  const item = useAppSelector(state => state.review).item

  return (
        <>
            {
                item && <div className="product-view-detail-box"><ReviewModal item={item}/> </div>
            }
        </>
  )
}
