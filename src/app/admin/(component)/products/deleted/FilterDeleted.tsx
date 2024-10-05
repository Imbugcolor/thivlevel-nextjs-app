import '../../styles/productfilter.css'
import { InputChange } from '@/app/types/html-elements'
import { filterCategory, removeAllFilter, searchProducts, sortProducts } from '@/lib/features/deletedProductsSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import React, { useState } from 'react'
import { FcClearFilters } from 'react-icons/fc'
import { GoSearch } from 'react-icons/go'

export default function FilterDeleted() {
    const categories = useAppSelector(state => state.categories).data
    const dispatch = useAppDispatch()
    const products = useAppSelector(state => state.deletedProducts)
    const [searchInput, setSearchInput] = useState(products.filter.search)

    const handleRemoveFilter = async () => {
        setSearchInput('')
        dispatch(removeAllFilter())
    }

    const handleSearch = async () => {
        dispatch(searchProducts(searchInput))
    }

    const handleSortProduct = async (e: InputChange) => {
        dispatch(sortProducts(e.target.value))
    }

    const handleFilterCategories = async (e: InputChange) => {
        dispatch(filterCategory(e.target.value))
    }

    return (
        <div className="filter_menu product">
            <div className='row'>
                <div className='py-2 col-lg-6 col-sm-12'>
                    <div className='search-wrapper d-flex align-items-center'>
                        {
                            <div className='remove__filter_wrapper'>
                                <button onClick={handleRemoveFilter}><FcClearFilters /></button>
                            </div>
                        }
                        <div className="search">
                            <input className="search-input-bd-none" type="text" placeholder="Nhập sản phẩm bạn muốn tìm kiếm ..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter")
                                        handleSearch();
                                }}
                            />
                            <button className="search-btn" onClick={handleSearch}>
                                <GoSearch />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="py-2 col-lg-3 col-sm-6">
                    <div className="category">
                        <select value={products.filter.category} onChange={handleFilterCategories}>
                            <option value="">Tất cả</option>
                            {
                                categories.map(category => (
                                    <option key={category._id} value={category._id}>{category.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="py-2 col-lg-3 col-sm-6">
                    <div className="sort">
                        <select value={products.filter.sort} onChange={handleSortProduct}>
                            <option value="">Sắp xếp: Tự động</option>
                            <option value="sort=-createdAt">Mới nhất</option>
                            <option value="sort=createdAt">Cũ nhất</option>
                            <option value="sort=-sold">Best sales</option>
                            <option value="sort=-rating">Best rating</option>
                            <option value="sort=-price">Giá: Cao -&gt; Thấp</option>
                            <option value="sort=price">Giá: Thấp -&gt; Cao</option>
                        </select>
                    </div>
                </div>
            </div>
        </div >
    )
}
