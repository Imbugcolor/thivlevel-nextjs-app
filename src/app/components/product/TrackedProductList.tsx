'use client'

import React, { useEffect, useRef } from 'react'
import { trackViewItemList } from '@/lib/analytics'
import ProductItem from './ProductItem'

interface TrackedProductListProps {
  products: Product[]
  itemListId: string
  itemListName: string
}

export default function TrackedProductList({
  products,
  itemListId,
  itemListName,
}: TrackedProductListProps) {
  const trackedFingerprint = useRef('')
  const fingerprint = products.map((product) => product._id).join(',')

  useEffect(() => {
    if (!fingerprint || trackedFingerprint.current === fingerprint) return
    trackViewItemList(products, itemListId, itemListName)
    trackedFingerprint.current = fingerprint
  }, [fingerprint, itemListId, itemListName, products])

  return (
    <>
      {products.map((product, index) => (
        <ProductItem
          key={product._id}
          product={product}
          itemListId={itemListId}
          itemListName={itemListName}
          itemIndex={index}
        />
      ))}
    </>
  )
}
