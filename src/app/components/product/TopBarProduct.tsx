import '../styles/filter-product.css'
import { productsApiRequest } from '@/app/api-request/products.api'
import { InputChange } from '@/app/types/html-elements'
import { NUM_PER_PAGE } from '@/config'
import { filterCategory, getProducts, removeAllFilter, searchProducts, sortProducts } from '@/lib/features/productSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import React, { useState } from 'react'
import { FcClearFilters } from 'react-icons/fc'
import { GoSearch } from 'react-icons/go'

export default function TopBarProduct() {
    const categories = useAppSelector(state => state.categories).data
    const dispatch = useAppDispatch()
    const filter = useAppSelector(state => state.producs).filter
    const [searchInput, setSearchInput] = useState(filter.search)

    const handleRemoveFilter = async() => {
        setSearchInput('')
        dispatch(removeAllFilter())
        const productsData = await productsApiRequest.getList(NUM_PER_PAGE, 1)
        dispatch(getProducts({ 
            data: productsData.payload.data, 
            total: productsData.payload.total, 
            page: Number(productsData.payload.page) 
        }))
    }

    const handleSearch = async() => {
        dispatch(searchProducts(searchInput))
        const productsData = await productsApiRequest.getList(NUM_PER_PAGE, 1, {...filter, search: searchInput })
        dispatch(getProducts({ 
            data: productsData.payload.data, 
            total: productsData.payload.total, 
            page: Number(productsData.payload.page) 
        }))
    }

    const handleSortProduct = async(e: InputChange) => {
        dispatch(sortProducts(e.target.value))
        const productsData = await productsApiRequest.getList(NUM_PER_PAGE, 1, {...filter, sort: e.target.value })
        dispatch(getProducts({ 
            data: productsData.payload.data, 
            total: productsData.payload.total, 
            page: Number(productsData.payload.page) 
        }))
    }

    const handleFilterCategories = async (e: InputChange) => {
        dispatch(filterCategory(e.target.value))
        const productsData = await productsApiRequest.getList(NUM_PER_PAGE, 1, {...filter, category: e.target.value })
        dispatch(getProducts({ 
            data: productsData.payload.data, 
            total: productsData.payload.total, 
            page: Number(productsData.payload.page) 
        }))
    }

  return (
    <div>
       <div className="filter_menu product res-row">
                <div className='filter__search-sort col l-4 m-12'>
                    {
                        <div className='remove__filter_wrapper'>
                            <button onClick={handleRemoveFilter}><FcClearFilters /></button>
                        </div>
                    }
                    <div className="search " >

                        <input className="search-input-bd-none" type="text" placeholder="Nhập sản phẩm bạn muốn tìm kiếm ..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value.toLowerCase())}
                        />
                        <button className="search-btn" onClick={handleSearch}>
                            <GoSearch />
                        </button>

                    </div>
                </div>
                <div className="tool-wrapper col l-4 m-12">
                    <div className='filter_right_side'>

                        <div className="sort">
                            <span>Danh mục</span>
                            <select value={filter.category} onChange={handleFilterCategories}>
                                <option value="">Tất cả</option>
                                {
                                    categories.map(category => (
                                        <option key={category._id} value={category._id}>{ category.name }</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </div>
                <div className="tool-wrapper col l-4 m-12">
                    <div className='filter_right_side'>

                        <div className="sort">
                            <span>Sắp xếp theo</span>
                            <select value={filter.sort} onChange={handleSortProduct}>
                                <option value="">Mới nhất</option>
                                <option value="sort=oldest">Cũ nhất</option>
                                <option value="sort=-sold">Best sales</option>
                                <option value="sort=-price">Giá: Cao -&gt; Thấp</option>
                                <option value="sort=price">Giá: Thấp -&gt; Cao</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div >
    </div>
  )
}
