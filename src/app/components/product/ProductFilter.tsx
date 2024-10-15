import '../styles/filter-product.css'
import { productsApiRequest } from '@/app/api-request/products.api'
import { InputChange } from '@/app/types/html-elements'
import { NUM_PER_PAGE } from '@/config'
import { filterPrice, filterSizes, getProducts } from '@/lib/features/productSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import React, { useState } from 'react'
import { GrSubtract } from 'react-icons/gr'

export default function ProductFilter() {
    const [validate, setValidate] = useState<{ [key: string]: string }>()
    const filter = useAppSelector(state => state.producs).filter
    const dispatch = useAppDispatch()

    const handleFilterSizes = (e: InputChange) => {
        const { name, checked } = e.target as HTMLInputElement
        if (checked) {
            dispatch(filterSizes([...filter.sizes, name]))
        } else {
            dispatch(filterSizes(filter.sizes.filter(size => size !== name)))
        }
    }

    const handleKeyDownOnPrice = (e: InputChange) => {
        var key = e.which || e.keyCode;
        if (!(key >= 48 && key <= 57) &&  // Numbers from the main keyboard
            !(key >= 96 && key <= 105) && // Numbers from the numeric keypad
            key !== 8 // Backspace key
        ) {
            e.preventDefault()
        }
    }

    const isChecked = (size: string) => {
        return filter.sizes.includes(size)
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

    return (
        <div>
            <div className='products_price_filter'>
                <h3 className="products__category-heading">Khoảng giá</h3>
                <div className='input_filter__wrapper'>
                    <div className='price_filter_input'>
                        <input type='text' placeholder='$ TỪ'
                            value={filter.fromPrice}
                            onChange={(e) => dispatch(filterPrice({ fromPrice: e.target.value }))}
                            onKeyDown={handleKeyDownOnPrice}
                            tabIndex={0}
                        />
                        <div className='divider_input'>
                            <GrSubtract />
                        </div>
                        <input type='text' placeholder='$ ĐẾN'
                            value={filter.toPrice}
                            onChange={(e) => dispatch(filterPrice({ toPrice: e.target.value }))}
                            onKeyDown={handleKeyDownOnPrice}
                            tabIndex={1}
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
            <button onClick={handleFilterProducts} className='filter-apply-btn'>Áp dụng</button>
        </div>
    )
}
