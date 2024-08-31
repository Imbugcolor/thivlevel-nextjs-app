'use client'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import React from 'react'
import ProductItem from './ProductItem'
import ProductFilter from './ProductFilter'
import Paginator from '../Paginator'
import { changePage, getProducts, ProductState } from '@/lib/features/productSlice'
import { productsApiRequest } from '@/app/api-request/products.api'
import { NUM_PER_PAGE } from '@/config'

export default function ListProducts() {
  const products = useAppSelector((state) => state.producs)
  const dispatch = useAppDispatch()
  
  const handleChangePage = async(num: number) => {
    const productsData = await productsApiRequest.getList(NUM_PER_PAGE, num, products.filter)
    dispatch(getProducts({ 
      data: productsData.payload.data, 
      total: productsData.payload.total, 
      page: Number(productsData.payload.page)
    }))
  }

  return (
    <div className="res-row products__container">
        <div className="col l-3 m-0 c-0 cate-side-bar">
          <ProductFilter />
        </div>
        
        <div className="col l-9 m-12 c-12">
        {
          <div>
          <div className="products res-row">
            <div className='col l-12 m-12 c-12'> 
            {
              products.total !== 0 ?  <span className='number_total_products'>{products.total} sản phẩm</span> : 
              <span className='number_total_products'>Không có sản phẩm nào.</span>
            } 
            </div>
            {          
                products.data.length > 0 && products.data.map(product => {
                  return <ProductItem key={product._id} product={product} />
                })
            }
          </div>
          
          </div>
          }

          {
            products.total > 1 &&
            <Paginator<ProductState>
            list={products} 
            total={products.total}
            callback={handleChangePage} 
            />
          }
        </div>
      </div>
  )
}
