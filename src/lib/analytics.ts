'use client'

import { sendGAEvent } from '@next/third-parties/google'

const CURRENCY = 'USD'
const CHECKOUT_SNAPSHOT_KEY = 'ga4_checkout_snapshot'
const PURCHASED_TRANSACTION_PREFIX = 'ga4_purchase_'

export interface AnalyticsItem {
  item_id: string
  item_name: string
  item_category?: string
  item_variant?: string
  price: number
  quantity: number
}

interface CheckoutSnapshot extends Record<string, unknown> {
  currency: string
  value: number
  items: AnalyticsItem[]
}

const productItem = (product: Product, quantity = 1, variant?: Variant): AnalyticsItem => ({
  item_id: product.product_sku || product._id,
  item_name: product.title,
  item_category: product.category?.name,
  item_variant: variant ? [variant.color, variant.size].filter(Boolean).join(' / ') : undefined,
  price: Number(product.price) || 0,
  quantity,
})

const cartSnapshot = (cart: Cart): CheckoutSnapshot => ({
  currency: CURRENCY,
  value: Number(cart.subTotal) || 0,
  items: cart.items.map((item) => ({
    ...productItem(item.productId, item.quantity, item.variantId),
    price: Number(item.price) || Number(item.productId.price) || 0,
  })),
})

const event = (name: string, parameters: Record<string, unknown> = {}) => {
  if (typeof window === 'undefined') return
  sendGAEvent('event', name, parameters)
}

export const trackViewItem = (product: Product) => {
  event('view_item', {
    currency: CURRENCY,
    value: Number(product.price) || 0,
    items: [productItem(product)],
  })
}

export const trackAddToCart = (product: Product, variant: Variant, quantity: number) => {
  event('add_to_cart', {
    currency: CURRENCY,
    value: (Number(product.price) || 0) * quantity,
    items: [productItem(product, quantity, variant)],
  })
}

export const trackBeginCheckout = (cart: Cart) => {
  const snapshot = cartSnapshot(cart)
  sessionStorage.setItem(CHECKOUT_SNAPSHOT_KEY, JSON.stringify(snapshot))
  event('begin_checkout', snapshot)
}

export const trackViewCart = (cart: Cart) => event('view_cart', cartSnapshot(cart))

export const trackAddShippingInfo = (cart: Cart) => {
  event('add_shipping_info', {
    ...cartSnapshot(cart),
    shipping_tier: 'standard',
  })
}

export const trackAddPaymentInfo = (cart: Cart, paymentType: string) => {
  event('add_payment_info', {
    ...cartSnapshot(cart),
    payment_type: paymentType,
  })
}

export const trackLogin = (method: 'email' | 'google') => event('login', { method })

export const trackSignUp = (method: 'email' | 'google') => event('sign_up', { method })

export const trackPurchase = (
  transactionId: string,
  overrides?: Partial<Pick<CheckoutSnapshot, 'currency' | 'value' | 'items'>>,
) => {
  if (!transactionId || typeof window === 'undefined') return false

  const storageKey = `${PURCHASED_TRANSACTION_PREFIX}${transactionId}`
  if (localStorage.getItem(storageKey)) return false

  let snapshot: CheckoutSnapshot | null = null
  try {
    const saved = sessionStorage.getItem(CHECKOUT_SNAPSHOT_KEY)
    snapshot = saved ? JSON.parse(saved) : null
  } catch {
    snapshot = null
  }

  const purchase = {
    currency: overrides?.currency || snapshot?.currency || CURRENCY,
    value: overrides?.value ?? snapshot?.value,
    items: overrides?.items || snapshot?.items,
  }

  if (typeof purchase.value !== 'number' || !purchase.items?.length) return false

  event('purchase', { transaction_id: transactionId, ...purchase })
  localStorage.setItem(storageKey, new Date().toISOString())
  sessionStorage.removeItem(CHECKOUT_SNAPSHOT_KEY)
  return true
}
