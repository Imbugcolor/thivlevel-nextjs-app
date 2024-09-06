'use client'
import "../cart.css"
import CheckoutItem from '@/app/components/checkout/CheckoutItem'
import Payment from "@/app/components/checkout/Payment"
import { FormSubmit, InputChange } from '@/app/types/html-elements'
import { useAppSelector } from '@/lib/hooks'
import useLocationForm, { AddressFullObject, AddressLocation } from '@/lib/location/useLocationForm'
import Link from 'next/link'
import React, { useState } from 'react'
import { IoReturnDownBackSharp } from 'react-icons/io5'
import Select from 'react-select'

export default function Checkout() {
    const cart = useAppSelector(state => state.cart)

    const [detail, setDetail] = useState({
        name: '',
        phone: ''
    })

    const handleChangeInput = (e: InputChange) => {
        const { name, value } = e.target
        setDetail({ ...detail, [name]: value })
    }

    const [address, setAddress] = useState()

    const [numStreet, setNumStreet] = useState('')

    const [validateMsg, setValidateMsg] = useState<{ [key: string]: string }>({})

    const validate = () => {
        const msg: { [key: string]: string } = {}

        if (!detail.name) {
            msg.name = '*Bạn chưa nhập họ tên.'
        }

        if (!detail.phone) {
            msg.phone = '*Bạn chưa nhập số điện thoại.'
        } else if (detail.phone.length !== 10) {
            msg.phone = '*Số điện thoại không hợp lệ.'
        }

        if (!selectedCity) {
            msg.city = '*Bạn chưa chọn Tỉnh/Thành.'
        }
        if (!selectedDistrict) {
            msg.district = '*Bạn chưa chọn Quận/Huyện.'
        }
        if (!selectedWard) {
            msg.ward = '*Bạn chưa chọn Phường/Xã.'
        }
        if (!numStreet) {
            msg.numstreet = '*Bạn chưa nhập đường/số nhà.'
        }

        setValidateMsg(msg)
        if (Object.keys(msg).length > 0) return false
        return true
    }


    const customStyle = {
        control: (baseStyles: any) => ({
            ...baseStyles,
            height: '45px',
        }),
        container: (prodived: any) => ({
            ...prodived,
            marginBottom: 20,
            height: '45px'
        }),
        input: (prodived: any) => ({
            ...prodived,
            margin: 0,
            paddingBottom: 0,
            paddingTop: 0
        })
    }

    const {
        state,
        onCitySelect,
        onDistrictSelect,
        onWardSelect,
        onClick,
        onCancel
    } = useLocationForm(true, address)

    const {
        cityOptions,
        districtOptions,
        wardOptions,
        selectedCity,
        selectedDistrict,
        selectedWard
    } = state

    const handlePaymentMethodModal = () => {
        const viewbox = document.querySelector('.payment-method-option-box')
        viewbox?.classList.toggle('active')
    }

    const handleProcessPayment = (e: FormSubmit) => {
        e.preventDefault()
        const isValid = validate()
        if(!isValid) return
        onClick(e, numStreet, setAddress, "delivery-detail-form")
        
        handlePaymentMethodModal()
    }

    return (
        <div className="container-box payment-section">
            <div className="wrapper">
                <div className="payment-close">
                    <Link href={'/cart'}><IoReturnDownBackSharp /> Quay lại</Link>
                </div>
                <div className='res-row order__form_payment'>
                    <div className="payment-detail col l-5 m-12 c-12">
                        <div className='heading-payment-order'>
                            <h3>ĐƠN HÀNG</h3>
                        </div>
                        <div className='list-cart'>
                            {
                                cart.items.map(item => (
                                    <CheckoutItem item={item} key={item._id} />
                                ))
                            }
                        </div>
                        <div>
                            <div className='payment-total-wrapper'>
                                <div className="payment-total">
                                    <p>Đơn hàng:</p>
                                    <span>$ {cart.subTotal}</span>
                                </div>
                                <div className='other_cost'>
                                    <div className='discount__payment_confirm'>
                                        <p>Giảm giá:</p>
                                        <span>$ 0</span>
                                    </div>
                                    <div className='ship-cost'>
                                        <p>Phí vận chuyển:</p>
                                        <span>$ 0</span>
                                    </div>
                                </div>
                                <div className='grand-total-checkout divider'>
                                    <p>Tổng cộng:</p>
                                    <span style={{ color: '#d93938' }}>$ {cart.subTotal}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='confirm-detail-order-form col l-7 m-12 c-12'>
                        <div className='heading-detail-form'>
                            <h3>THÔNG TIN GIAO HÀNG</h3>
                        </div>
                        <form className='delivery-detail-form' onSubmit={handleProcessPayment}>
                            <div>
                                <div className="detail-form-input" style={{ marginRight: '15px' }}>
                                    <label htmlFor="name">Tên khách hàng</label>
                                    <input style={{ marginTop: '10px' }} type="text" name="name" id="name" placeholder='Họ và tên'
                                        value={detail.name}
                                        onChange={handleChangeInput}
                                    />
                                    <span style={{ color: 'red', fontSize: '12px' }}>{validateMsg.name}</span>
                                </div>

                                <div className="detail-form-input">
                                    <label htmlFor="phone">Điện thoại</label>
                                    <input style={{ marginTop: '10px' }} type="text" name="phone" id="phone" placeholder='Số điện thoại'
                                        value={detail.phone}
                                        onChange={handleChangeInput}
                                    />
                                    <span style={{ color: 'red', fontSize: '12px' }}>{validateMsg.phone}</span>
                                </div>
                            </div>


                            <div className="row">
                                <label htmlFor="address" style={{ fontWeight: '300' }}>Địa chỉ</label>
                                <div id="user-address" style={{ marginTop: '10px' }}>
                                    <div className="confirm-address-select-container">
                                        <div className="confirm-address-select-item">
                                            <div style={{ width: '100%' }}>

                                                <Select
                                                    name="cityId"
                                                    key={`cityId_${(selectedCity as unknown as AddressLocation)?.value}`}
                                                    isDisabled={cityOptions.length === 0}
                                                    options={cityOptions}
                                                    onChange={(option) => onCitySelect(option)}
                                                    placeholder="Tỉnh/Thành"
                                                    defaultValue={selectedCity}
                                                    styles={customStyle}
                                                />
                                                <span style={{ color: 'red', fontSize: '12px' }}>{validateMsg.city}</span>
                                            </div>
                                            <div>

                                                <Select
                                                    name="districtId"
                                                    key={`districtId_${(selectedDistrict as unknown as AddressLocation)?.value}`}
                                                    isDisabled={districtOptions.length === 0}
                                                    options={districtOptions}
                                                    onChange={(option) => onDistrictSelect(option)}
                                                    placeholder="Quận/Huyện"
                                                    defaultValue={selectedDistrict}
                                                    styles={customStyle}
                                                />
                                                <span style={{ color: 'red', fontSize: '12px' }}>{validateMsg.district}</span>
                                            </div>
                                            <div style={{ width: '100%' }}>

                                                <Select
                                                    name="wardId"
                                                    key={`wardId_${(selectedWard as unknown as AddressLocation)?.value}`}
                                                    isDisabled={wardOptions.length === 0}
                                                    options={wardOptions}
                                                    placeholder="Phường/Xã"
                                                    onChange={(option) => onWardSelect(option)}
                                                    defaultValue={selectedWard}
                                                    styles={customStyle}
                                                />
                                                <span style={{ color: 'red', fontSize: '12px' }}>{validateMsg.ward}</span>
                                            </div>
                                        </div>

                                        <div className="detail-form-input" style={{ marginRight: '15px' }}>
                                            <label htmlFor="name">Số nhà/ đường</label>
                                            <input type="text" placeholder="Số nhà, tòa nhà, đường..."
                                                value={numStreet || ''}
                                                onChange={e => setNumStreet(e.target.value)}
                                                className="address-detail-input"
                                                style={{ marginTop: '10px' }} />
                                            <span style={{ color: 'red', fontSize: '12px' }}>{validateMsg.numstreet}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className='delivery-confirm'>Thanh toán</button>
                        </form>
                    </div>
                </div>

            </div>

            <div className='payment-method-option-box'>
                <Payment
                    order={{ 
                        name: detail.name, 
                        phone: detail.phone, 
                        address: address as unknown as AddressFullObject 
                    }}
                />  
            </div>
        </div >
    )
}
