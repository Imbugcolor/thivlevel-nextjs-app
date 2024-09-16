'use client'
import './products.css'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import Image from 'next/image'
import Link from 'next/link'
import React, { useRef, useState } from 'react'
import { BsToggleOff, BsToggleOn } from 'react-icons/bs'
import { FaEdit, FaEye, FaSpinner } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import Filter from '../../(component)/products/Filter'
import Paginator from '@/app/components/Paginator'
import { getProducts, ProductState, updatePublish } from '@/lib/features/productSlice'
import { privateProductApiRequest } from '../../api-request/products.api'
import { NUM_PER_PAGE } from '@/config'
import { HttpError } from '@/lib/utils/http'
import { setNotify } from '@/lib/features/notifySlice'

export default function ProductManager() {
    const products = useAppSelector(state => state.producs)
    const token = useAppSelector(state => state.auth).token
    const dispatch = useAppDispatch()

    const [deleting, setDeleting] = useState<Product | null>()
    const [toogling, setToogling] = useState(false)
    const uploadRef = useRef<HTMLInputElement>(null)

    const handlePublishProduct = async(product: Product) => {
        if(!token || toogling) return;
        try {
            const body = { publish: !product.isPublished }
            dispatch(updatePublish({ id: product._id, isPublised: !product.isPublished}))
            await privateProductApiRequest.publish(token, dispatch, product._id, body)
        } catch (error) {
            if (error instanceof HttpError) {
                // Handle the specific HttpError
                console.log("Error message:", error.message);
                // Example: show error message to the user
                dispatch(updatePublish({ id: product._id, isPublised: product.isPublished}))
                dispatch(setNotify({ error: error.message }))
            } else {
                // Handle other types of errors
                console.log("An unexpected error occurred:", error);
                dispatch(updatePublish({ id: product._id, isPublised: product.isPublished}))
                dispatch(setNotify({ error: "An unexpected error occurred" }))
            }
        }
    }

    const deleteProduct = (id: string) => {

    }

    const handleViewDetail = (product: Product) => {

    }

    const handleChangePage = async (num: number) => {
        const productsData = await privateProductApiRequest.get(NUM_PER_PAGE, num, products.filter)
        dispatch(getProducts({
          data: productsData.payload.data,
          total: productsData.payload.total,
          page: Number(productsData.payload.page)
        }))
    }

    return (
        <div>
            <div className='content-header'>
                <h2>Danh sách sản phẩm</h2>
            </div>
            <div className="products-list-container">
                {/* <div className="products-list-actions">
                    <div className="create__product">
                        <Link href='/admin/dashboard/create-product'>+ Thêm sản phẩm</Link>
                    </div>
                    <div className="file-wrapper">
                        <div className="file__upload">
                            <input type="file" accept="text/csv, .csv, application/vnd.ms-excel" style={{ display: 'none' }} ref={uploadRef} />
                            <div className="" onClick={() => uploadRef?.current?.click()}>Drop CSV file</div>
                        </div>
                        <div className="btn__item">
                            <button className="btn__item-upload">Upload</button>
                            <button className="btn__item-download">Download</button>
                        </div>
                    </div>
                </div> */}

                <div className="products-list-filter">
                    <Filter />
                </div>

                <div className="products-list">
                    <div className='products__count_number'>
                        <span>Hiển thị {products.data.length} / {products.total} sản phẩm</span>
                    </div>
                    <table className="products-list-table">
                        <thead className="table-header">
                            <tr>
                                <th>SKU</th>
                                <th>TÊN</th>
                                <th style={{ textAlign: 'start' }}>DANH MỤC</th>
                                <th>GIÁ</th>
                                <th>TRẠNG THÁI</th>
                                <th>CHI TIẾT</th>
                                <th>ẨN/HIỆN</th>
                                <th>SỬA/XÓA</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {
                                products.data.length > 0 ? products.data.map(product => (
                                    <tr key={product._id}>
                                        <td>
                                            <div className="product-id">
                                                {product.product_sku}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="product-name">
                                                <Image src={product.images[0].url} alt="product" width={500} height={500} priority />
                                                <span>{product.title}</span>
                                            </div>
                                        </td>
                                        <td>{product.category?.name}</td>
                                        <td>
                                            <div className="product-price">
                                                ${product.price}
                                            </div>
                                        </td>
                                        <td>{
                                            product.isPublished ?
                                                <span className="selling">Đang bán</span> :
                                                <span className="sold-out">Dừng bán</span>
                                        }</td>
                                        <td>
                                            <div className="product-view-detail">
                                                <a href="#!" onClick={() => handleViewDetail(product)}>
                                                    <FaEye style={{ color: '#9e9e9e' }} />
                                                </a>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="product-publish-toggle"
                                                onClick={() => handlePublishProduct(product)}>
                                                {
                                                    product.isPublished ?
                                                        <BsToggleOn style={{ color: '#0e9f6e' }} /> :
                                                        <BsToggleOff style={{ color: '#ff5a1f' }} />
                                                }
                                            </div>
                                        </td>
                                        <td>
                                            <div className="product-actions">
                                                <div className="edit-product">
                                                    <Link href={`/admin/dashboard/update-product/${product._id}`} >
                                                        <FaEdit style={{ color: '#9e9e9e' }} />
                                                    </Link>
                                                </div>
                                                <div className="delete-product">
                                                    <Link href="#!" onClick={() => deleteProduct(product._id)}>
                                                        {
                                                            product._id === deleting?._id ?
                                                                <FaSpinner className="fa-spin" style={{ color: '#9e9e9e' }} /> :
                                                                <MdDelete style={{ color: '#9e9e9e' }} />
                                                        }
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )) :
                                    <tr>
                                        <td style={{ borderBottom: 'none', textAlign: 'left' }}>
                                            <div>
                                                Không có sản phẩm nào.
                                            </div>
                                        </td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
                <Paginator<ProductState>
                    list={products}
                    total={products.total}
                    callback={handleChangePage}
                />
            </div>
        </div>
    )
}
