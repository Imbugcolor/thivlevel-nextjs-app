'use client'
import "./purchase.css"
import { ordersApiRequest } from '@/app/api-request/orders.api'
import Paginator from "@/app/components/Paginator"
import PurchaseSkeleton from "@/app/components/purchase/PurchaseSkeleton"
import { Order } from '@/app/types/schema/order'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { TfiMoreAlt } from 'react-icons/tfi'

interface OrderState {
    data: Order[],
    total: number,
    page: number,
}

export default function Purchase() {
    const token = useAppSelector(state => state.auth).token
    const dispatch = useAppDispatch()
    const [purchaseData, setPurchaseData] = useState<OrderState>()
    const [purchaseList, setPurchaseList] = useState<Order[]>([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [searchString, setSearchString] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const [sortInput, setSortInput] = useState('')
    const [statusInput, setStatusInput] = useState('')

    useEffect(() => {
        if (token) {
            const getHistory = async () => {
                setLoading(true)
                const res = await ordersApiRequest.getList(token, dispatch, 2, page, { status: statusInput, search: searchString, sort: sortInput })
                setPurchaseData({...res.payload, page: Number(res.payload.page)})
                setPurchaseList(res.payload.data)
                setPage(Number(res.payload.page)) 
                setLoading(false)       
            }
            getHistory()
        }
    }, [dispatch, token, page, sortInput, statusInput, searchString]);

    const handleFilter = () => {
        setSearchString(`name[regex]=${searchInput}`)
    }

    const handleChangePage = (page: number) => {
        setPage(page);
    }

    return (
        <div className="container-box history-page">
            <h2>Đơn hàng của bạn</h2>
            <div className="order-filter-client-wrapper">
                <div className='order-search-client'>
                    <input className="search-order-input" value={searchInput} type="text" 
                        placeholder="Tìm kiếm bằng tên người nhận hàng"
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter")
                                handleFilter();
                            }}   
                    />
                </div>
            </div>  
            <div className='my__order_wrapper res-row'>
                <div className='sidebar__filter_orders col l-3 m-3 c-12'>
                        <div className="order-status-client">
                            <select name="status" value={statusInput} onChange={(e) => setStatusInput(e.target.value)}>
                                <option value="">Tất cả đơn hàng</option>
                            
                                <option value="status=Pending">
                                    Đang chờ
                                </option>
                                
                                <option value="status=Processing">
                                    Đang xử lý
                                </option>

                                <option value="status=Shipping">
                                    Đang giao hàng
                                </option>

                                <option value="status=Delivered">
                                    Đã giao hàng
                                </option>

                                <option value="status=Cancel">
                                    Đơn bị hủy
                                </option>
                                
                            </select>
                        </div>

                        <div className="order-sortdate-client">
                            <select value={sortInput} 
                            onChange={e => setSortInput(e.target.value)}                     
                            >
                                <option value="">Mới nhất</option>
                                <option value="sort=oldest">Cũ nhất</option>
                            </select>
                        </div>
                </div>
                <div className="my__order_list_wrapper col l-9 m-9 c-12"> 

                    {
                        purchaseList.length !== 0 ?  <span className='number_total_orders'>Hiển thị {purchaseList.length} trên tổng {purchaseData?.total} đơn hàng</span> : 
                        <span className='number_total_orders'>Không tìm thấy kết quả tìm kiếm.</span>
                    }  
                   
                    {   
                        loading ? <PurchaseSkeleton /> :
                        purchaseList.map(item => (                                
                            <div className="my__order_item" key={item._id}>
                                <div className="my__order_item_heading">
                                    <h3 className="my_order_status">

                                        {
                                            item.status === 'Pending' ? <span className='dot__order_status dot_pending'></span> :
                                            item.status === 'Processing' ? <span className='dot__order_status dot_processing'></span> :
                                            item.status === 'Shipping' ? <span className='dot__order_status dot_shipping'></span> :
                                            item.status === 'Delivered' ? <span className='dot__order_status dot_delivered'></span> :
                                            <span className='dot__order_status dot_cancel'></span>
                                        }                             
                                    
                                        {
                                        item.status === 'Pending' ? 'Đang chờ xử lý' : item.status === 'Processing' ? 'Đang xử lý': 
                                        item.status === 'Shipping' ? 'Đang giao hàng' : item.status === 'Delivered' ? 'Đã giao hàng' : 'Đã hủy'
                                        }
                                    </h3>
                                    <span className='my__order_number'>Đơn hàng #</span>
                                    <span className='my__order_number uppercase'>{item._id}</span>
                                </div>
                                <div className="my__order_item_images">
                                    <Image src={item.items[0].productId.images[0].url} width={500} height={500} alt='purchase_item' priority/>
                                    {
                                        item.items.length > 1 &&
                                        <div className='more_images_item'>
                                            <TfiMoreAlt /> và {item.items.length - 1 } sản phẩm khác
                                        </div>
                                    }
                                </div>
                                <div className="my__order_item_bottom">
                                    <span>{item.items.length} sản phẩm tổng cộng:</span>
                                    <h4>{item.total}$</h4>
                                </div>
                                <div className="my__order_item_view">
                                    <Link href={`/user/purchase/${item._id}`} >
                                        Xem chi tiết
                                    </Link>
                                </div>
                            </div>
                        )) }
                </div>
            </div>     

            {
               purchaseData && purchaseData.total > 1 &&
              <Paginator<OrderState>
                list={purchaseData}
                total={purchaseData.total}
                limit={2}
                callback={handleChangePage}
              />
            }
         
        </div>
    )
}
