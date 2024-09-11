'use client'
import "../purchase.css"
import { ordersApiRequest } from '@/app/api-request/orders.api';
import { Order, OrderItem } from '@/app/types/schema/order';
import { cancelOrder, getPurchaseDetail } from '@/lib/features/purchasedetailSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import Image from 'next/image';
import { IoTrashBin } from 'react-icons/io5';
import CodLogo from '../../../../images/cod-logo.webp'
import Visa from '../../../../images/visa.png'
import { setNotify } from "@/lib/features/notifySlice";
import { HttpError } from "@/lib/utils/http";
import { setItemReview } from "@/lib/features/reviewSlice";

export default function PurchaseDetail({ params }: { params: { id: string } }) {
    const token = useAppSelector(state => state.auth).token
    const purchase = useAppSelector(state => state.purchaseDetail)
    const dispatch = useAppDispatch()
    const [purchaseDetail, setPurchaseDetail] = useState<Order>()
    const [loading, setLoading] = useState(false)
    const [isCanceling, setIsCanceling] = useState(false)

    useEffect(() => {
        if(!params.id) return;
        if(token) {
            const fetchData = async() => {
                if(purchase.data_cached.every(item => item._id !== params.id)){
                    setLoading(true)
                    const res = await ordersApiRequest.getPurchase(token, dispatch, params.id)
                    dispatch(getPurchaseDetail(res.payload))
                    setPurchaseDetail(res.payload)
                    setLoading(false)
                } else {
                    const purchase_cached = purchase.data_cached.find(data => data._id === params.id)
                    setPurchaseDetail(purchase_cached)
                }
            }
            fetchData()
        }
    },[token, params.id, dispatch, purchase.data_cached])


    const handleCancelPurchase = async() => {
        if(token) {
            try {
                setIsCanceling(true)
                await ordersApiRequest.cancelOrder(token, dispatch, params.id)
                dispatch(cancelOrder(params.id))
                dispatch(setNotify({ success: 'Hủy đơn thành công' }))
                setIsCanceling(false)
            } catch (error) {
                if (error instanceof HttpError) {
                    // Handle the specific HttpError
                    console.log("Error message:", error.message);
                    // Example: show error message to the user
                    setIsCanceling(false)
                    dispatch(setNotify({ error: error.message }))
                  } else {
                    // Handle other types of errors
                    console.log("An unexpected error occurred:", error);
                    setIsCanceling(false)
                    dispatch(setNotify({ error: "An unexpected error occurred" }))
                  }
            }
        }
    }

    return (
        loading ? <div className="container-box">Loading</div> :
        <div className="container-box history-page res-row">
            <div className="order-infor-container col l-12 m-12 c-12">
                <div className='order__infor_heading'>
                    <h3>Chi tiết đơn hàng</h3>
                    {
                        purchaseDetail &&
                        <p>Ngày đặt: {new Date(purchaseDetail.createdAt).toLocaleDateString() + ' ' + moment(purchaseDetail.createdAt).format('LT')}</p>
                    }
                </div>
            </div>

            <div className="order-detail col l-12 m-12 c-12">
                <div className="res-row">
                    <div className='list-product-order-client col l-8 m-12 c-12'>
                        <table className="oder-product-list-table">
                            <thead className="table-header">
                                <tr>
                                    <th>STT</th>
                                    <th>SẢN PHẨM</th>
                                    <th>SIZE/MÀU</th>
                                    <th>SỐ LƯỢNG</th>
                                    <th>GIÁ</th>
                                    <th>TỔNG CỘNG</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {
                                    purchaseDetail?.items.map((item, index) => {
                                        if (item.quantity > 0) {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className='table-product-column'>
                                                            <Image className='table-thumbnail-product' src={item.productId.images[0].url} alt='hinh' height={500} width={500} priority/>
                                                            <span style={{ marginLeft: 5}} >{item.productId.title}</span>
                                                        </div>
                                                    </td>
                                                    <td className='table-product-column flx-center'>
                                                        <span>{item.variantId.size} - </span>
                                                        <span>{item.variantId.color}</span>
                                                    </td>
                                                    <td className='table-quantity'>{item.quantity}</td>
                                                    <td className='table-item-price'>${item.price}</td>
                                                    <td className='table-amount'>${(item.total)?.toFixed(2)}</td>
                                                </tr>
                                            )
                                        } else return null
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className='pay-infor-wrapper col l-4 m-12 c-12'>
                        <div className="heading__pay-infor">
                            <div>Mã đơn</div>
                            <div style={{ textTransform: 'uppercase', wordBreak: 'break-word', color: '#555' }}>
                                {'#'+ purchaseDetail?._id}
                            </div>
                        </div>
                        <div className="pay-infor">                              
                            <div className="item">
                                <div>Ngày đặt</div>
                                {
                                    purchaseDetail &&
                                    <div style={{ textTransform: 'uppercase', wordBreak: 'break-word', color: '#555' }}>
                                        {new Date(purchaseDetail.createdAt).toLocaleDateString()} 
                                        {moment(purchaseDetail.createdAt).format('LT')}
                                    </div>
                                }
                            </div>
                            <div className="divider"></div>
                            <div className="item">
                                <div>Tổng cộng</div>
                                <div>${purchaseDetail?.total?.toFixed(2)}</div>
                            </div>
                            <div className="item">
                                <div>Phí vận chuyển</div>
                                <div>$0.00</div>
                            </div>
                            <div className="item">
                                <div>Phương thức thanh toán</div>
                                <div>{purchaseDetail?.method}</div>
                            </div>
                            <div className="divider"></div>
                            <div className="item fw600">
                                <div>Tổng thanh toán</div>
                                <div style={{ color: '#d93938' }}>${purchaseDetail?.total?.toFixed(2)}</div>
                            </div>                    
                        </div>
                        
                    </div>
                </div>
                <div className='order__bottom_info res-row'>
                    <div className='customer__order_infor box-style_infor col l-3 m-6 c-12'>
                        <span className='heading__box'>Thông tin khách hàng</span>
                        <div className='box-detail_infor'>
                            <p>Tên: {purchaseDetail?.name}</p>
                            <p>Email: {purchaseDetail?.email}</p>
                            <p>Số điện thoại: +84 {purchaseDetail?.phone}</p>
                        </div>
                    </div>
                    <div className='shipping__order_infor box-style_infor col l-3 m-6 c-12'>
                        <span className='heading__box'>Thông tin giao hàng</span>
                        <div className='box-detail_infor'>
                            <span>Địa chỉ nhận hàng: </span>
                            <span>
                                {
                                    purchaseDetail &&
                                        ` ${(purchaseDetail.address.detailAddress || '')} ${purchaseDetail.address.ward.label}, ${purchaseDetail.address.district.label}, ${purchaseDetail.address.city.label}`
                                }
                            </span>
                        </div>
                    </div>
                    <div className='billing__order_infor box-style_infor col l-3 m-6 c-12'>
                        <span className='heading__box'>Thông tin thanh toán</span>
                        <div className='box-detail_infor'>
                            <span>
                                {
                                    purchaseDetail?.method === 'CARD' ? 'Online' : 'Thanh toán khi nhận hàng'
                                }
                            </span>
                            
                            <div className='payment__detail_'>
                                <Image src={
                                    purchaseDetail?.method === 'COD' ? CodLogo : Visa 
                                } alt='card-brand' style={{ width: '45px', height: 'auto' }}/>
                                <span>
                                {
                                    purchaseDetail?.method === 'CARD' && purchaseDetail?.isPaid === true ? 
                                    `Đã thanh toán: ${new Date(purchaseDetail?.createdAt).toLocaleDateString() + ' ' + moment(purchaseDetail?.createdAt).format('LT')}` :
                                    purchaseDetail?.method === 'PAYPAL_CREDIT_CARD' && purchaseDetail?.isPaid === true ? 
                                    `Đã thanh toán: ${new Date(purchaseDetail?.createdAt).toLocaleDateString() + ' ' + moment(purchaseDetail?.createdAt).format('LT')}` :
                                    purchaseDetail?.method === 'COD' && purchaseDetail?.isPaid === true ? 
                                    `Đã thanh toán: ${new Date(purchaseDetail?.updatedAt).toLocaleDateString() + ' ' + moment(purchaseDetail?.updatedAt).format('LT')}` :
                                    'Chưa thanh toán'
                                }
                            </span>
                            </div>
                        </div>
                    </div>
                    <div className='status__order_infor box-style_infor col l-3 m-6 c-12'>
                        <span className='heading__box'>Trạng thái đơn hàng</span>
                        <div className='box-detail_infor'>
                            {
                                purchaseDetail?.status === 'Pending' ?

                                <span style={{color: '#5e77bd', padding: '10px', fontSize: '14px', fontWeight: '500', border: '1px solid'}}>
                                    Đang chờ xử lý
                                </span> : purchaseDetail?.status === 'Processing'  ?  
                                <span style={{color: '#5e77bd', padding: '10px', fontSize: '14px', fontWeight: '500', border: '1px solid'}}>
                                    Đang xử lý
                                </span>  :  purchaseDetail?.status === 'Shipping'  ?  
                                <span style={{color: '#d16704', padding: '10px', fontSize: '14px', fontWeight: '500', border: '1px solid'}}>
                                    Đang giao hàng
                                </span>  :  purchaseDetail?.status === 'Delivered' ?
                                <span style={{color: '#0d9b25', padding: '10px', fontSize: '14px', fontWeight: '500', border: '1px solid'}}>
                                    Đã giao hàng
                                </span> : 
                                <span style={{color: '#d93131', padding: '10px', fontSize: '14px', fontWeight: '500', border: '1px solid'}}>
                                    Đã hủy
                                </span>

                            }                       
                        </div>
                        <div className='bottom__box'>
                        {
                            purchaseDetail?.status === 'Delivered' ? 
                            null :
                            purchaseDetail?.status === 'Processing' || purchaseDetail?.status === 'Shipping' || purchaseDetail?.status === 'Canceled' ?                    
                            <div className='cancel-order-disabled'>
                                <button className='disabled-btn' disabled><IoTrashBin /> Hủy đơn hàng</button>
                            </div> :
                            <div className='cancel-order'>
                                <button onClick={handleCancelPurchase} ><IoTrashBin /> Hủy đơn hàng</button>
                            </div> 
                          
                        } 
                        </div>
                    </div>
                    {
                    purchaseDetail?.status === 'Delivered' && 
                    <div className='review_feedback status__order_infor box-style_infor col l-3 m-6 c-12'>
                        <span className='heading__box'>Đánh giá sản phẩm</span>
                        {
                            purchaseDetail?.items.map((item, index) => (
                                <div className='item__feedback box-detail_infor' key={index}>
                                    <Image src={item.productId.images[0].url} className='item__img' alt='review-product' width={500} height={500} priority/>
                                    <div className='item__detail'>
                                        <p>{item.productId.title}</p>
                                        <span>{item.variantId.color}</span>
                                        <span>/</span>
                                        <span>{item.variantId.size}</span>
                                        {/* {
                                            reviewed.includes(item.product_id) ? 
                                            <button 
                                                className='reviewed-btn'>
                                                    Đã đánh giá
                                            </button> 
                                            : <button 
                                                onClick={() => handleReviewClick(item)} 
                                                className='review-btn'>Đánh giá
                                             </button>
                                        } */}
                                        <button 
                                            onClick={() => dispatch(setItemReview(item))} 
                                            className='review-btn'>
                                                Đánh giá
                                        </button>
                                    </div>        
                                </div>
                            )) 
                        }                  
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}
