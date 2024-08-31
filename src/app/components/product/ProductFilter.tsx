import '../styles/filter-product.css'
import { productsApiRequest } from '@/app/api-request/products.api'
import { InputChange } from '@/app/types/html-elements'
import { NUM_PER_PAGE } from '@/config'
import { filterCategory, filterPrice, filterSizes, getProducts, removeAllFilter, searchProducts, sortProducts } from '@/lib/features/productSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import React, { useState } from 'react'
import { FcClearFilters } from 'react-icons/fc'
import { GoSearch } from 'react-icons/go'
import { GrSubtract } from 'react-icons/gr'

export default function ProductFilter() {
    const [wordEntered, setWordEntered] = useState('')
    const [open, setOpen] = useState(false)
    const [searchSuggestion, setSearchSuggestion] = useState<Product[]>([])
    const [validate, setValidate] = useState<{ [key: string]: string }>()
    const filter = useAppSelector(state => state.producs).filter
    const categories = useAppSelector(state => state.categories).data
    const [searchInput, setSearchInput] = useState(filter.search)
    const dispatch = useAppDispatch()

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

    const handleSortProduct = async(e: InputChange) => {
        dispatch(sortProducts(e.target.value))
        const productsData = await productsApiRequest.getList(NUM_PER_PAGE, 1, {...filter, sort: e.target.value })
        dispatch(getProducts({ 
            data: productsData.payload.data, 
            total: productsData.payload.total, 
            page: Number(productsData.payload.page) 
        }))
    }

    const handleFilterSizes = (e: InputChange) => {
        const { name, checked } = e.target as HTMLInputElement
        if (checked) {
            dispatch(filterSizes([...filter.sizes, name]))
        } else {
            dispatch(filterSizes(filter.sizes.filter(size => size !== name)))
        }
    }

    const isChecked = (size: string) => {
        return filter.sizes.includes(size)
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

    const validation = () => {
        let message: { [key: string]: string } = {}

        if (!filter.fromPrice || !filter.toPrice || Number(filter.fromPrice) < 0 || Number(filter.toPrice) < Number(filter.fromPrice)) {
            message.price = '*Khoảng giá không hợp lệ'
        }

        setValidate(message)
        if (Object.keys(message).length > 0) return false
        return true
    }

    const handleFilterProducts = async () => {
        const isValid = validation()
        if (!isValid) return;
        const productsData = await productsApiRequest.getList(NUM_PER_PAGE, 1, filter)
        dispatch(getProducts({ 
            data: productsData.payload.data, 
            total: productsData.payload.total, 
            page: Number(productsData.payload.page) 
        }))
    }

    const handleFilterCategories = async (category: string) => {
        dispatch(filterCategory(category))
        const productsData = await productsApiRequest.getList(NUM_PER_PAGE, 1, {...filter, category })
        dispatch(getProducts({ 
            data: productsData.payload.data, 
            total: productsData.payload.total, 
            page: Number(productsData.payload.page) 
        }))
    }
    return (
        <div>
            <div className="filter_menu product ">
                <div className='filter__search-sort'>
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
                <div className="tool-wrapper">
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
            <div className="products__category">
                <h3 className="products__category-heading">Danh mục sản phẩm</h3>
                <ul>
                    <li style={{ color: `${!filter.category ? 'crimson' : '#000'}` }}>
                        <span onClick={() => handleFilterCategories('')}
                        >
                            Tất cả sản phẩm
                        </span>
                    </li>
                    {
                        categories.map((category) => (
                            <li key={category._id} style={{ color: `${filter.category === category._id ? 'crimson' : '#000'}` }}>
                                <span onClick={() => handleFilterCategories(category._id)}>
                                    {category.name}
                                </span>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className='products_price_filter'>
                <h3 className="products__category-heading">Khoảng giá</h3>
                <div className='input_filter__wrapper'>
                    <div className='price_filter_input'>
                        <input type='number' placeholder='$ TỪ'
                            value={filter.fromPrice}
                            onChange={e => dispatch(filterPrice({ fromPrice: Number(e.target.value) }))}
                        />
                        <div className='divider_input'>
                            <GrSubtract />
                        </div>
                        <input type='number' placeholder='$ ĐẾN'
                            value={filter.toPrice}
                            onChange={e => dispatch(filterPrice({ toPrice: Number(e.target.value) }))}
                        />
                    </div>
                    <span style={{ color: 'red', fontWeight: '300' }}>{validate?.price}</span>
                </div>
            </div>
            <div className='products_size_filter'>
                <h3 className="products__category-heading">Kích thước</h3>
                <div className='input_filter__wrapper'>
                    <div className='boxes_check_size'>
                        <label className="boxes_container">XS
                            <input type="checkbox" name='XS' onChange={handleFilterSizes} checked={isChecked('XS')} />
                            <span className="checkmark"></span>
                        </label>
                        <label className="boxes_container">S
                            <input type="checkbox" name='S' onChange={handleFilterSizes} checked={isChecked('S')} />
                            <span className="checkmark"></span>
                        </label>
                        <label className="boxes_container">M
                            <input type="checkbox" name='M' onChange={handleFilterSizes} checked={isChecked('M')} />
                            <span className="checkmark"></span>
                        </label>
                        <label className="boxes_container">L
                            <input type="checkbox" name='L' onChange={handleFilterSizes} checked={isChecked('L')} />
                            <span className="checkmark"></span>
                        </label>
                        <label className="boxes_container">XL
                            <input type="checkbox" name='XL' onChange={handleFilterSizes} checked={isChecked('XL')} />
                            <span className="checkmark"></span>
                        </label>
                        <label className="boxes_container">XXL
                            <input type="checkbox" name='XXL' onChange={handleFilterSizes} checked={isChecked('XXL')} />
                            <span className="checkmark"></span>
                        </label>
                    </div>
                </div>
            </div>
            <button onClick={handleFilterProducts}>Áp dụng</button>
        </div>
    )
}
