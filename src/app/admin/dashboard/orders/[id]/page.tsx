'use client'
import "./orderdetail.css"
import { privateOrdersApiRequest } from '@/app/admin/api-request/orders.api';
import LocationUpdate from '@/app/components/profile/LocationUpdate';
import { AddressProfile } from '@/app/types/profile.address';
import { Order } from '@/app/types/schema/order';
import { getOrder } from '@/lib/features/orderDetailSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import moment from 'moment';
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { FaEdit } from 'react-icons/fa';
import CodLogo from '../../../../../images/cod-logo.webp'
import Visa from '../../../../../images/visa.png'

export default function OrderDetail({ params }: { params: { id: string } }) {
    const token = useAppSelector(state => state.auth).token
    const order = useAppSelector(state => state.orderDetail)
    const [loading, setLoading] = useState(false)
    const [orderDetail, setOrderDetail] = useState<Order>()
    const [status, setStatus] = useState('')
    const dispatch = useAppDispatch()

    const [address, setAddress] = useState<AddressProfile | string>('')
    const addressRef = useRef<HTMLInputElement>(null)


    const handleChangeAddress = () => {
        if (loading) return;
        if (addressRef.current) 
        addressRef.current.classList.add('active')
    }

    const handleChangePhone = () => {

    }

    useEffect(() => {
        if(!params.id) return;
        if(token) {
            const fetchData = async() => {
                if(order.data_cached.every(item => item._id !== params.id)){
                    setLoading(true)
                    const res = await privateOrdersApiRequest.getOrder(token, dispatch, params.id)
                    dispatch(getOrder(res.payload))
                    setOrderDetail(res.payload)
                    setStatus(res.payload.status)
                    setAddress(res.payload.address)
                    setLoading(false)
                } else {
                    const order_cached = order.data_cached.find(data => data._id === params.id)
                    setOrderDetail(order_cached)
                    setStatus(order_cached?.status || '')
                    setAddress(order_cached?.address || '')
                }
            }
            fetchData()
        }
    },[token, params.id, dispatch, order.data_cached])

    const handleSaveChangeStatus = () => {

    }
  return (
    <div className='order-detail'>
            <div className='content-header'>
                <h2>Chi tiết đơn hàng</h2>
            </div>
            <div className='order-detail-body'>
                <div className='order-detail-wrapper'>
                    <div className='order-detail-header'>
                        <div className="row">
                            <div className='col-lg-4 order-id-status'>
                                <h1>ĐƠN HÀNG <span style={{ textTransform: 'uppercase', fontWeight: '500'}}>{'#' + orderDetail?._id}</span></h1>
                                <p>TRẠNG THÁI: <span>{orderDetail?.status}</span></p>
                                <p>THANH TOÁN: <span>{orderDetail?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</span></p>                           
                            </div>
                            <div className='col-lg-4 change-order-status'>
                                <select name="status" value={status} onChange={(e) => setStatus(e.target.value)} style={{ borderRight: 'none' }}>

                                    <option value="Pending">
                                        Đang chờ
                                    </option>

                                    <option value="Processing">
                                        Đang xử lý
                                    </option>

                                    <option value="Shipping">
                                        Đang giao
                                    </option>

                                    <option value="Delivered">
                                        Đã giao
                                    </option>

                                    <option value="Cancel">
                                        Hủy
                                    </option>

                                </select>

                                <button type='button' className='save-status' onClick={handleSaveChangeStatus}>Lưu</button>
                            </div>
                            <div className='col-lg-4 order-name-address'>
                                <h1>{orderDetail?.name}</h1>
                                <p>
                                    {(orderDetail?.address?.detailAddress || '')} {orderDetail?.address?.ward?.label}, 
                                    {orderDetail?.address?.district?.label}, {orderDetail?.address?.city?.label}
                                </p>
                                <a href="#!"
                                    onClick={handleChangeAddress}>
                                    <FaEdit style={{ color: '#9e9e9e', cursor: 'pointer' }} />
                                </a>
                                <div className="address-form text-start" ref={addressRef}>
                                    <LocationUpdate element={"address-form"} onSave={setAddress} initAddress={address} />
                                </div>
                                <div className="address-form" ref={addressRef}>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='order-detail-body'>
                        <div className="row">
                            <div className='col-lg-3 col-md-4 col-sm-6 date-order'>
                                <label>NGÀY TẠO</label>
                                <p>{new Date(orderDetail?.createdAt || '').toLocaleDateString()}</p>
                                <span>{moment(orderDetail?.createdAt).format('LT')}</span>
                            </div>
                            <div className='col-lg-3 col-md-4 col-sm-6 date-order'>
                                <label>CẬP NHẬT LẦN CUỐI:</label>
                                <p>{new Date(orderDetail?.updatedAt || '').toLocaleDateString()}</p>
                                <span>{moment(orderDetail?.updatedAt).format('LT')}</span>
                            </div>
                            <div className='col-lg-3 col-md-4 col-sm-6 id-order'>
                                <label>EMAIL</label>
                                <p>{orderDetail?.email}</p>
                            </div>
                            <div className='col-lg-3 col-md-4 col-sm-6 phone-number-order'>
                                <label>SỐ ĐIỆN THOẠI</label>
                                    <div style={{ textAlign: 'right' }}>
                                    <p>+84 {orderDetail?.phone ? orderDetail?.phone : 'NO'}</p>
                                    <a href="#!" onClick={() => handleChangePhone()}>
                                        <FaEdit style={{ color: '#9e9e9e', cursor: 'pointer' }} />
                                    </a>
                                </div>
                            </div>  
                        </div>
                    </div>
                    <div className='list-product-order'>
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
                                    orderDetail?.items?.map((item, index) => {
                                        if (item.quantity > 0) {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className='table-product-column'>
                                                            <Image 
                                                                className='table-thumbnail-product' 
                                                                src={item?.productId.images[0].url} alt='hinh'
                                                                width={500}
                                                                height={500}
                                                                priority
                                                            />
                                                            <span style={{ marginLeft: 5}} >{item.productId.title}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className='table-product-column' style={{justifyContent: 'center'}}>
                                                            <span>{item.variantId.size} - </span>
                                                            <div style={{ backgroundColor: `${item.variantId.color}`, width: '15px', height: '15px', border: '1px solid #ccc' }}></div>
                                                        </div>
                                                    </td>
                                                    <td className='table-quantity'>{item.quantity}</td>
                                                    <td className='table-item-price'>${item.price}</td>
                                                    <td className='table-amount'>${(item.total).toFixed(2)}</td>
                                                </tr>
                                            )
                                        } else return null
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className='payment-detail-order'>
                        <div className="row">
                            <div className='col-lg-3 col-md-4 col-sm-6 method'>
                                <label>PHƯƠNG THỨC THANH TOÁN</label>
                                <div className='payment__detail_' style={{ display: 'flex', alignItems: 'center'}}>
                                    <Image src={
                                        orderDetail?.method === 'COD' ? CodLogo : Visa 
                                    } alt='card-brand' style={{ width: '45px', height: 'auto' }}/>
                                    <span>
                                    {
                                        orderDetail?.method === 'CARD' && orderDetail?.isPaid === true ? 
                                        `Đã thanh toán: ${new Date(orderDetail?.createdAt).toLocaleDateString() + ' ' + moment(orderDetail?.createdAt).format('LT')}` :
                                
                                        orderDetail?.method === 'COD' && orderDetail?.isPaid === true ? 
                                        `Đã thanh toán: ${new Date(orderDetail?.updatedAt).toLocaleDateString() + ' ' + moment(orderDetail?.updatedAt).format('LT')}` :
                                        'Chưa thanh toán'
                                    }
                                    </span>
                                </div>
                                {orderDetail?.paymentId ? <span>MÃ THANH TOÁN: {orderDetail?.paymentId}</span> : ''}
                            </div>
                            <div className='col-lg-3 col-md-4 col-sm-6 shipping-cost'>
                                <label>PHÍ VẬN CHUYỂN</label>
                                <p>$ 0</p>
                            </div>
                            <div className='col-lg-3 col-md-4 col-sm-6 discount'>
                                <label>GIẢM GIÁ</label>
                                <p>$ 0</p>
                            </div>
                            <div className='col-lg-3 col-md-4 col-sm-6 total-amount'>
                                <label>TỔNG THANH TOÁN</label>
                                <p>${orderDetail?.total}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}
