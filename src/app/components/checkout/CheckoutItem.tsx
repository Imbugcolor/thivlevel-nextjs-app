import Image from 'next/image'
import React from 'react'

export default function CheckoutItem({ item }: { item: CartItem }) {
  return (
    <div className="detail cart" key={item._id}>
                <div className="box-detail">
                    <div style={{display: 'flex'}}>
                        <div className="thumb__product_checkout">
                            <Image src={item.productId.images[0].url} 
                                   style={{ width: '100%', height: 'auto' }}
                                   width={500} 
                                   height={500} 
                                   alt='checkout' 
                                   priority/>
                            <span className='quantity__product_checkout'>{item.quantity}</span>
                        </div>
                        <div style={{width: '100%', marginLeft: '15px'}}>
                            <h2>{item.productId.title}</h2>
                            
                            <div style={{display:'flex', alignItems:'center'}}>
                                <span>{item.variantId.color}</span> 
                                <span>{item.variantId.size}</span> 
                            </div>       
                        </div>
                    </div>
                    <div className="item-amount">
                        <span>$ {item.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
  )
}
