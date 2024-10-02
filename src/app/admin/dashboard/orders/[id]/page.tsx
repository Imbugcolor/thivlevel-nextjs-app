'use client'
import "./orderdetail.css"
import { privateOrdersApiRequest, UpdateOrder } from '@/app/admin/api-request/orders.api';
import LocationUpdate from '@/app/components/profile/LocationUpdate';
import { AddressProfile } from '@/app/types/profile.address';
import { Order } from '@/app/types/schema/order';
import { getOrder, updateOrder, updateStatus } from '@/lib/features/orderDetailSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import moment from 'moment';
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { CiEdit } from "react-icons/ci";
import CodLogo from '../../../../../images/cod-logo.webp'
import Visa from '../../../../../images/visa.png'
import { HttpError } from "@/lib/utils/http";
import { setNotify } from "@/lib/features/notifySlice";

export default function OrderDetail({ params }: { params: { id: string } }) {
    const token = useAppSelector(state => state.auth).token
    const order = useAppSelector(state => state.orderDetail)
    const [loading, setLoading] = useState(false)
    const [orderDetail, setOrderDetail] = useState<Order>()
    const [status, setStatus] = useState('')
    const [editName, setEditName] = useState(false)
    const [name, setName] = useState('')
    const [editPhone, setEditPhone] = useState(false)
    const [phone, setPhone] = useState('')
    const dispatch = useAppDispatch()

    const [address, setAddress] = useState<AddressProfile | string>('')
    const addressRef = useRef<HTMLInputElement>(null)
    const nameInputRef = useRef<HTMLInputElement>(null)
    const phoneInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (editName && nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, [editName]);

    useEffect(() => {
        if (editPhone && phoneInputRef.current) {
            phoneInputRef.current.focus();
        }
    },[editPhone])

    const handleChangeOrderName = () => {
        setEditName(true)
        setName(orderDetail?.name || '')
    }

    const cancelChangeName = () => {
        setEditName(false)
        setName(orderDetail?.name || '')
    }

    const saveChangeOrder = async(payload: UpdateOrder) => {
        if(!token) return;
        try {
            await privateOrdersApiRequest.updateOrder(token, dispatch, params.id, payload)
            dispatch(updateOrder({ id: params.id, ...payload }))
        } catch (error) {
            if (error instanceof HttpError) {
                // Handle the specific HttpError
                console.log("Error message:", error.message);
                // Example: show error message to the user
                dispatch(setNotify({ error: error.message }))
            } else {
                // Handle other types of errors
                console.log("An unexpected error occurred:", error);
                dispatch(setNotify({ error: "An unexpected error occurred" }))
            }
        }
    }

    const saveChangeName = async() => {
        await saveChangeOrder({ name })
        setEditName(false)
    }

    const saveChangePhone = async() => {
        await saveChangeOrder({ phone })
        setEditPhone(false)
    }

    const handleChangeAddress = () => {
        if (loading) return;
        if (addressRef.current) 
        addressRef.current.classList.add('active')
    }

    const handleChangePhone = () => {
        setEditPhone(true)
        setPhone(orderDetail?.phone || '')
    }

    const cancelChangePhone = () => {
        setEditPhone(false)
        setPhone(orderDetail?.phone || '')
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

    const handleSaveChangeStatus = async() => {
        if(!token) return;
        // if (status === 'Completed') {
        // }
        try {
            await privateOrdersApiRequest.updateStatus(token, dispatch, params.id, { status })
            dispatch(updateStatus({ id: params.id, status }))
        } catch (error) {
            if (error instanceof HttpError) {
                // Handle the specific HttpError
                console.log("Error message:", error.message);
                // Example: show error message to the user
                dispatch(setNotify({ error: error.message }))
            } else {
                // Handle other types of errors
                console.log("An unexpected error occurred:", error);
                dispatch(setNotify({ error: "An unexpected error occurred" }))
            }
        }
    }

    const saveAddress = async(data: AddressProfile) => {
        setAddress(data)
        await saveChangeOrder({ address: data })
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
                            {
                                (orderDetail?.status !== 'Completed' && orderDetail?.status !== 'Canceled') ?
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

                                        <option value="Completed">
                                            Đã hoàn thành
                                        </option>

                                        <option value="Canceled">
                                            Hủy
                                        </option>

                                    </select>

                                    <button 
                                        type='button' 
                                        className={`save-status ${status === orderDetail?.status && 'disable'}`} 
                                        onClick={handleSaveChangeStatus}
                                        disabled={status === orderDetail?.status}
                                    >Lưu</button>
                                </div> : 
                                <div className='col-lg-4'></div>
                            }
                            <div className='col-lg-4 order-name-address'>
                                <div className="order-name d-flex">
                                    {
                                        editName ? <div>
                                            <input 
                                                type="text" 
                                                name='name' 
                                                value={name} 
                                                ref={nameInputRef}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                            <div className="edit-order my-1">
                                                <button type="button" className="save-order" onClick={saveChangeName}>Lưu</button>
                                                <button type="button" className="cancel-edit" onClick={cancelChangeName}>Hủy</button>
                                            </div>
                                        </div>:
                                        <>
                                            <h1 className="mr-2" >{orderDetail?.name}</h1>
                                            <a href="#!" onClick={handleChangeOrderName}>
                                                <CiEdit style={{ color: '#9e9e9e', cursor: 'pointer' }} />
                                            </a>
                                        </>
                                    }
                                </div>
                                <p>
                                    {(orderDetail?.address?.detailAddress || '')} {orderDetail?.address?.ward?.label}, 
                                    {orderDetail?.address?.district?.label}, {orderDetail?.address?.city?.label}
                                </p>
                                <a href="#!"
                                    onClick={handleChangeAddress}>
                                    <CiEdit style={{ color: '#9e9e9e', cursor: 'pointer' }} />
                                </a>
                                <div className="address-form text-start" ref={addressRef}>
                                    <LocationUpdate element={"address-form"} onSave={saveAddress} initAddress={address} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='order-detail-body'>
                        <div className="row">
                            <div className='col-lg-3 col-md-4 col-sm-6 date-order'>
                                <label>NGÀY TẠO</label>
                                {
                                    orderDetail &&
                                    <>
                                        <p>{new Date(orderDetail.createdAt).toLocaleDateString()}</p>
                                        <span>{moment(orderDetail.createdAt).format('LT')}</span>
                                    </>
                                }
                            </div>
                            <div className='col-lg-3 col-md-4 col-sm-6 date-order'>
                                <label>CẬP NHẬT LẦN CUỐI:</label>
                                {
                                    orderDetail && 
                                    <>
                                        <p>{new Date(orderDetail.updatedAt).toLocaleDateString()}</p>
                                        <span>{moment(orderDetail.updatedAt).format('LT')}</span>
                                    </>
                                }
                            </div>
                            <div className='col-lg-3 col-md-4 col-sm-6 id-order'>
                                <label>EMAIL</label>
                                <p>{orderDetail?.email}</p>
                            </div>
                            <div className='col-lg-3 col-md-4 col-sm-6 phone-number-order'>
                                <label>SỐ ĐIỆN THOẠI</label>
                                <div className="order-phone">
                                    {
                                        editPhone ? <div>
                                        <input 
                                            type="text" 
                                            name='phone' 
                                            value={phone} 
                                            ref={phoneInputRef}
                                            placeholder="1234567890"
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                        <div className="edit-order my-1">
                                            <button type="button" className="save-order" onClick={saveChangePhone}>Lưu</button>
                                            <button type="button" className="cancel-edit" onClick={cancelChangePhone}>Hủy</button>
                                        </div>
                                    </div> : <>
                                        <p>+84 {orderDetail?.phone ? orderDetail?.phone : ''}</p>
                                        <a href="#!" onClick={() => handleChangePhone()}>
                                            <CiEdit style={{ color: '#9e9e9e', cursor: 'pointer' }} />
                                        </a>
                                    </>
                                    }
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
                                                        <div className='table-product-column'>
                                                            <span>{item.variantId.size} - </span>
                                                            <span>{item.variantId.color}</span>
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
