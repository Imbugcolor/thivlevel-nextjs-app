'use client'
import "./orders.css"
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import moment from 'moment'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BsTruck } from 'react-icons/bs'
import { FaEdit } from 'react-icons/fa'
import { MdPayment } from 'react-icons/md'
import { privateOrdersApiRequest } from '../../api-request/orders.api'
import { NUM_PER_PAGE } from '@/config'
import { HttpError } from '@/lib/utils/http'
import { setNotify } from '@/lib/features/notifySlice'
import { changeOrdesPage, getOrders, OrdersState, searchOrders, sortOrders, statusOrders } from '@/lib/features/ordersSlice'
import Paginator from '@/app/components/Paginator'
import { GoSearch } from "react-icons/go"
import { InputChange } from "@/app/types/html-elements"

export default function Orders() {
    const token = useAppSelector(state => state.auth).token
    const orders = useAppSelector(state => state.orders)
    const dispatch = useAppDispatch()
    const [searchInput, setSearchInput] = useState('')

    useEffect(() => {
        if (token) {
            const fetch = async () => {
                try {
                    const res = await privateOrdersApiRequest.getOrders(token, dispatch, NUM_PER_PAGE, orders.page, orders.filter);
                    dispatch(getOrders({
                        data: res.payload.data,
                        total: res.payload.total,
                        page: parseInt(res.payload.page)
                    }))
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
            fetch()
        }
    }, [token, dispatch, orders.page, orders.filter])

    const search = () => {
        dispatch(searchOrders(searchInput))
    }

    const statusFilter = (e: InputChange) => {
        dispatch(statusOrders(e.target.value))
    }

    const handleChangePage = (num: number) => {
        dispatch(changeOrdesPage(num));
    }

    return (
        <div className="orders-wrapper">
            <div className='content-header'>
                <h2>Quản lý đơn hàng</h2>
            </div>

            <div className="order-container">
                <div className="ctrl-order">
                    <div className="row">
                        <div className='py-2 col-lg-6 col-sm-12 search-order-by'>
                            <input className="search-order-input" value={searchInput} type="text" placeholder="Tìm kiếm bằng mã đơn/ tên/ emai/ sđt"
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter")
                                        search();
                                }} />
                            <button className="search-btn" onClick={search}>
                                <GoSearch />
                            </button>
                        </div>

                        <div className="py-2 col-lg-3 col-sm-6 filter-order-status">
                            <select name="status" value={orders.filter.status} onChange={statusFilter}>
                                <option value="">Trạng thái: Tất cả</option>

                                <option value="status=Pending">
                                    Đang chờ
                                </option>

                                <option value="status=Processing">
                                    Đang xử lý
                                </option>

                                <option value="status=Shipping">
                                    Đang giao
                                </option>

                                <option value="status=Delivered">
                                    Đã giao
                                </option>

                                <option value="status=Completed">
                                    Đã hoàn thành
                                </option>

                                <option value="status=Canceled">
                                    Đã Hủy
                                </option>

                            </select>
                        </div>

                        <div className="py-2 col-lg-3 col-sm-6 sort-order-by">
                            <select value={orders.filter.sort} onChange={e => dispatch(sortOrders(e.target.value))}>
                                <option value="sort=-createdAt">Mới nhất</option>
                                <option value="sort=createdAt">Cũ nhất</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="orders-list">
                    <div className='products__count_number'>
                        {/* <span>Hiển thị {currentItems.length} / {orders.length} đơn hàng</span> */}
                    </div>
                    <table className="orders-list-table">
                        <thead className="table-header">
                            <tr>
                                <th>MÃ ĐƠN</th>
                                <th>NGÀY ĐẶT</th>
                                <th>HỌ TÊN</th>
                                <th>SĐT</th>
                                <th>PHƯƠNG THỨC</th>
                                <th>TỔNG CỘNG</th>
                                <th>TRẠNG THÁI</th>
                                <th>CẬP NHẬT</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {
                                orders.data.length > 0 ? orders.data.map(order => (
                                    <tr key={order._id}>
                                        <td>
                                            <div className="order-id">
                                                <span style={{ textTransform: 'uppercase' }}
                                                    title={order._id}>...{order._id.slice(-5)}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="order-name">
                                                <span>{new Date(order.createdAt).toLocaleDateString() + ' ' + moment(order.createdAt).format('LT')}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="order-name">
                                                <span>{order.name}</span>
                                            </div>
                                        </td>
                                        <td>{order.phone ? order.phone : ''}</td>
                                        <td>{
                                            order.method === 'COD' ?
                                            <span style={{ backgroundColor: 'coral', display: 'flex', alignItems: 'center' }} className="method-span">
                                                <BsTruck style={{ color: '#fff', paddingRight: '3px' }} />
                                                COD
                                            </span> :
                                            <span style={{ backgroundColor: '#57a7af', display: 'flex', alignItems: 'center' }} className="method-span">
                                                <MdPayment style={{ color: '#fff', paddingRight: '3px' }} />
                                                Online
                                            </span>
                                            }
                                        </td>
                                        <td>${order.total}</td>
                                        <td>{order.status}</td>
                                        <td>
                                            <div className="order-actions">
                                                <div className="edit-order">
                                                    <Link href={`/admin/dashboard/orders/${order._id}`} >
                                                        <FaEdit style={{ color: '#9e9e9e' }} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )) :
                                    <tr>
                                        <td style={{ borderBottom: 'none', textAlign: 'left' }}>
                                            <div>
                                                Không tìm thấy kết quả tìm kiếm.
                                            </div>
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
                <Paginator<OrdersState>
                    list={orders}
                    total={orders.total}
                    callback={handleChangePage}
                />
            </div>
        </div>
    )
}
