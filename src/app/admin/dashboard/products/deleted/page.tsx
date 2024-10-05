'use client'
import "../products.css"
import FilterDeleted from "@/app/admin/(component)/products/deleted/FilterDeleted";
import { privateProductApiRequest } from '@/app/admin/api-request/products.api';
import Paginator from '@/app/components/Paginator';
import { NUM_PER_PAGE } from '@/config';
import { changePage, getProducts, restoreAction } from '@/lib/features/deletedProductsSlice';
import { setNotify } from '@/lib/features/notifySlice';
import { ProductState } from '@/lib/features/productSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { HttpError } from '@/lib/utils/http';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { FaEye, FaSpinner } from 'react-icons/fa';
import { MdOutlineSettingsBackupRestore } from 'react-icons/md';

export default function DeletedProducts() {
    const token = useAppSelector(state => state.auth).token
    const products = useAppSelector(state => state.deletedProducts)
    const [restoring, setRestoring] = useState<Product | null>(null)
    const dispatch = useAppDispatch()

    const handleChangePage = (num: number) => {
        dispatch(changePage(num))
    }

    useEffect(() => {
        if (token) {
            const fetch = async () => {
                try {
                    const res = await privateProductApiRequest.getDeletedList(token, dispatch, NUM_PER_PAGE, products.page, products.filter);
                    dispatch(getProducts({
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
    },[token, dispatch, products.page, products.filter])

    const handleRestoreProduct = async(product: Product) => {
        if (!token) return;
        try {
            setRestoring(product)
            await privateProductApiRequest.restore(token, dispatch, product._id)
            dispatch(restoreAction(product._id))
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
        } finally {
            setRestoring(null)
        }
    }

    return (
        <div>
            <div className='content-header'>
                <h2>Danh sách sản phẩm đã xóa</h2>
            </div>
            <div className="products-list-container">
                <div className="products-list-filter">
                    <FilterDeleted />
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
                                <th>T/G XÓA</th>
                                <th>KHÔI PHỤC</th>
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
                                            <div className="product-deleted-time">
                                                {product.deletedAt && new Date(product.deletedAt).toLocaleString()}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="product-actions">
                                                <div className="delete-product">
                                                    <Link href="#!" onClick={() => handleRestoreProduct(product)}>
                                                        {
                                                            product._id === restoring?._id ?
                                                                <FaSpinner className="fa-spin" style={{ color: '#9e9e9e' }} /> :
                                                                <MdOutlineSettingsBackupRestore style={{ color: '#9e9e9e' }}/>
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
