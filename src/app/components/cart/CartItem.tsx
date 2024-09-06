import { cartApiRequest } from '@/app/api-request/cart.api'
import { decrementItemCart, incrementItemCart, removeItemCart } from '@/lib/features/cartSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import Image from 'next/image'
import React, { useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { GrFormSubtract } from 'react-icons/gr'
import { RiDeleteBinFill } from 'react-icons/ri'

export default function CartItem({ cartItem } : { cartItem: CartItem}) {
    const token = useAppSelector(state => state.auth).token
    const cartId = useAppSelector(state => state.cart)._id
    const dispatch = useAppDispatch()
    const [isProgress, setIsProgress] = useState(false)
    const [validation, setValidation] = useState<{[key: string]: string}>({})

    const decrement = async() => {
        if(cartItem.quantity === 1) return;
        if(isProgress) return;
        if(!token || !cartId) return;
        setIsProgress(true)
        const body = { cartId, itemId: cartItem._id }
        await cartApiRequest.decrement(token, dispatch, body)
        dispatch(decrementItemCart(cartItem))
        setIsProgress(false)
    }
  
      const increment = async() => {
        if(cartItem.quantity === cartItem.variantId.inventory) {
          return setValidation({ increment: 'Sản phẩm không đủ số lượng yêu cầu'})
        }
        if(isProgress) return;
        if(!token || !cartId) return;
        setIsProgress(true)
        const body = { cartId, itemId: cartItem._id }
        await cartApiRequest.increment(token, dispatch, body)
        dispatch(incrementItemCart(cartItem))
        setIsProgress(false)
      }
  
      const removeItem = async() => {
        if(isProgress) return;
        if(!token || !cartId) return;
        setIsProgress(true)
        const body = { cartId, itemId: cartItem._id }
        await cartApiRequest.removeItem(token, dispatch, body)
        dispatch(removeItemCart(cartItem))
        setIsProgress(false)
      }

    return (
        <div className="detail cart" key={cartItem._id}>
          <div className='product-images'>
            {
                cartItem.productId.images &&
                <Image src={cartItem.productId.images[0].url} alt="item" width={500} height={500} priority/>
            }
          </div>
          <div className="box-detail">
            <h2>{cartItem.productId.title}</h2>
            <h3>$ {cartItem.price}</h3>
            {
              cartItem.variantId.color ?
                <div className="product-color">
                  Màu sắc: {cartItem.variantId.color}        
                </div> : <div>Color: No Available</div>
            }
            {
              cartItem.variantId.size ?
                <strong>Size: {cartItem.variantId.size}</strong> : <strong>Size: No Available</strong>
            }
            <div className='product-in-stock'>
              <span>SL trong kho:</span>
              <h4>{cartItem.variantId.inventory}</h4> 
            </div>
            <div className="amount">         
              <div className='quantity__controll_wrapper'>       
                <button onClick={decrement} disabled={ isProgress }><GrFormSubtract /></button>
                <span>{cartItem.quantity}</span>
                <button onClick={increment} disabled={ isProgress }><FiPlus /></button>
              </div>
              <div className='total_num_bottom'>
                <span>Tổng cộng:</span>
                <h4>${(cartItem.price * cartItem.quantity).toFixed(2)}</h4>  
              </div>
            </div>
            {
              validation.increment &&
              <span style={{ color: 'red' }}>{validation.increment}</span>
            }
          </div>
          { 
            !cartItem.productId.isPublished && cartItem.variantId.inventory > 0 &&
            <div className="unvailible-layer">
              <span>Không có sẵn</span>
            </div>
          }

          {
            cartItem.variantId.inventory <= 0 &&
            <div className="unvailible-layer">
                <span>Hết hàng</span>
            </div>
          }
       
          <div className="delete" onClick={removeItem} style={{ opacity: isProgress ? 0.7 : 1 }}><RiDeleteBinFill /></div>
        </div>
    )
}
