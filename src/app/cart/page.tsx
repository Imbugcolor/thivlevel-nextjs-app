'use client'
import "./cart.css"
import { useAppSelector } from '@/lib/hooks'
import React from 'react'
import { BiSolidShoppingBag } from 'react-icons/bi'
import CartItem from '../components/cart/CartItem'
import Image from "next/image"
import EmptyCart from '../../images/empty-cart.jpg'
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Cart() {
  const cart = useAppSelector(state => state.cart)
  const router = useRouter()

  const handleBuyClick = () => {
    router.push('/cart/checkout')
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className='container-box' style={{ width: "100%", textAlign: 'center' }} >
        <div>
          Chưa có sản phẩm nào trong giỏ, <Link href={'/products'}> tiếp tục mua sắm</Link> nhé.
        </div>
        <Image draggable={false}
          style={{ display: 'block', width: '100%', height: '600px', objectFit: 'contain' }}
          src={EmptyCart} alt="" />
      </div>
    )
  }

  return (
    // page === 1 ? 
    // <Payment 
    //   cart={cart}
    //   codSuccess={codSuccess}
    //   closePayment={closePayment}
    // /> :
    <div className="container-box">

      <div className="res-row">
        <h2 className="cart-heading col l-12 m-12 c-12">
          <BiSolidShoppingBag style={{ paddingRight: 10 }} />
          Giỏ hàng
        </h2>
        <div className='cart-wrapper col l-12 m-12 c-12'>
          <div className="res-row">
            <div className='list-cart col l-8 m-8 c-12 '>
              {
                cart && cart.items?.map(item =>
                  <CartItem cartItem={item} key={item._id} />
                )
              }
            </div>
            <div className='payment col l-4 m-4 c-12 '>
              <div className="total divider">
                <p>Đơn hàng:</p>
                <span>$ {cart.subTotal}</span>
              </div>
              <div className='divider'>
                <div className='discount-cost'>
                  <p>Giảm giá:</p>
                  <span>$ 0</span>
                </div>
                <div className='ship-cost'>
                  <p>Phí vận chuyển:</p>
                  <span>$ 0</span>
                </div>
              </div>
              <div className='grand-total divider'>
                <p>Tổng cộng:</p>
                <span style={{ color: '#d93938' }}>$ {cart.subTotal}</span>
              </div>

              <button
                className="payment-buy-btn" onClick={handleBuyClick} >
                {/* {
                    loadingPayment ?
                      <img src={LoadIcon} alt='loading'/> :
                      "Tiếp tục thanh toán"    
                  } */}
                Tiếp tục thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
