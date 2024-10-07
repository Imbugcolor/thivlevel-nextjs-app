import "../styles/payment.css"
import { InputChange } from '@/app/types/html-elements'
import Image from 'next/image'
import React, { useState } from 'react'
import { FaSpinner } from 'react-icons/fa'
import CodIcon from '../../../images/cod.png'
import VnpayIcon from '../../../images/vnpay-logo.jpg'
import StripeIcon from '../../../images/stripe.png'
import PaypalIcon from '../../../images/paypal-credit-card-1.png'
import Paypal from './Paypal'
import { CreateCheckoutSessionRequest, ordersApiRequest } from "@/app/api-request/orders.api"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { IoCloseOutline } from "react-icons/io5"
import { HttpError } from "@/lib/utils/http"
import { setNotify } from "@/lib/features/notifySlice"

interface OrderProps extends CreateCheckoutSessionRequest { }

export default function Payment({ order }: { order: OrderProps }) {
    const token = useAppSelector(state => state.auth).token
    const dispatch = useAppDispatch()
    const [method, setMethod] = useState('')
    const [validation, setValidation] = useState<{ [key: string]: string }>({})
    const [loading, setLoading] = useState(false)

    const handleChangeMethod = (e: InputChange) => {
        setMethod(e.target.value)
    }

    const handleCloseView = (e: any) => {
        e.preventDefault()
        const viewbox = document.querySelector('.payment-method-option-box')
        viewbox && viewbox.classList.remove('active')
    }

    const validate = () => {
        const msg: { [key: string]: string } = {}

        if (!method) {
            msg.notSelected = '*Bạn chưa chọn phương thức thanh toán.'
        }

        setValidation(msg)
        if (Object.keys(msg).length > 0) return false
        return true
    }

    const handlePaymentCOD = async() => {
        if (!token) return;
        try {
            setLoading(true)
            await ordersApiRequest.createCodOrder(token, dispatch, order)
            dispatch(setNotify({loading: true}))
            window.location.href = '/cart/checkout/thanks'
        } catch (error: any) {
            if (error instanceof HttpError) {
                console.log("Error message:", error.message);
                dispatch(setNotify({ error: error.message }))
            } else {
                console.log("An unexpected error occurred:", error);
                dispatch(setNotify({ error: 'Lỗi không xác định.' }))
            }
        } finally {
            setLoading(false)
            dispatch(setNotify({loading: false}))
        }
    }

    const handleCheckoutVnpay = async() => {
        if (!token) return;
        try {
            setLoading(true)
            const checkout = await ordersApiRequest.createVnpayCheckoutSession(token, dispatch, order)

            window.location.href = checkout.payload.paymentUrl
        } catch (error: any) {
            if (error instanceof HttpError) {
                console.log("Error message:", error.message);
                dispatch(setNotify({ error: error.message }))
            } else {
                console.log("An unexpected error occurred:", error);
                dispatch(setNotify({ error: 'Lỗi không xác định.' }))
            }
        } finally {
            setLoading(false)
        }
    }

    const handleCheckoutStripe = async () => {
        if (!token) return;
        try {
            setLoading(true)
            const checkout = await ordersApiRequest.createStripeCheckoutSession(token, dispatch, order)

            window.location.href = checkout.payload.url
            setLoading(false)
        } catch (error: any) {
            if (error instanceof HttpError) {
                console.log("Error message:", error.message);
                dispatch(setNotify({ error: error.message }))
            } else {
                console.log("An unexpected error occurred:", error);
                dispatch(setNotify({ error: 'Lỗi không xác định.' }))
            }
        } finally {
            setLoading(false)
        }
    }

    const handleComplete = async () => {
        const isValid = validate()
        if (!isValid) return
        try {
            setLoading(true)
            if (method === 'cod') {
                return handlePaymentCOD()
            }
            if (method === 'vnpay') {
                return handleCheckoutVnpay()
            }
            if (method === 'stripe') {
                return handleCheckoutStripe()
            }
            if (method === 'paypal') {
                return;
            }
            setLoading(false)
        } catch (err) {
            setLoading(false)
            const viewbox = document.querySelector('.payment-method-option-box')
            viewbox && viewbox.classList.remove('active')
        }
    }

    return (
        <div className='payment-method-options-modal'>
            <div className="payment-method">
                <h3 style={{ color: '#555' }}>Chọn phương thức thanh toán: </h3>
                <div style={{ marginTop: '15px' }}>
                    <span style={{ color: 'red', fontWeight: '300', fontSize: '14px' }}>{validation.notSelected}</span>
                </div>
                <div className='list__method_wrapper'>
                    <div className='method_item'>
                        <div className='check_options_method'>
                            <input type='radio' name='options'
                                value='cod'
                                onChange={handleChangeMethod}
                                checked={method === 'cod'}
                            />
                        </div>
                        <div className='content_options_method'>
                            <div className='text_options_method'>
                                <span>Thanh toán khi giao hàng (COD)</span>
                            </div>
                            <div className='img_options_method'>
                                <Image src={CodIcon} alt='cod' style={{ height: 'auto' }} />
                            </div>
                        </div>
                    </div>
                    <div className='method_item stripe_method_option credit-card-method'>
                        <div className='check_options_method'>
                            <input type='radio' name='options'
                                value='vnpay'
                                onChange={handleChangeMethod}
                                checked={method === 'vnpay'}
                            />
                        </div>
                        <div className='credit-card-content'>
                            <div className='text_options_method'>
                                <span>Thanh toán qua {'('}Vnpay{')'} </span>
                            </div>
                            <div className='img_options_method credit-card-img'>
                                <Image src={VnpayIcon} alt='vnpay' style={{ height: '65px', width: '65px' }} />
                            </div>
                        </div>
                    </div>
                    <div className='method_item stripe_method_option credit-card-method'>
                        <div className='check_options_method'>
                            <input type='radio' name='options'
                                value='stripe'
                                onChange={handleChangeMethod}
                                checked={method === 'stripe'}
                            />
                        </div>
                        <div className='credit-card-content'>
                            <div className='text_options_method'>
                                <span>Thanh toán qua {'('}Stripe{')'}</span>
                            </div>
                            <div className='img_options_method credit-card-img'>
                                <Image src={StripeIcon} alt='stripe' style={{ height: '65px' }} />
                            </div>
                        </div>
                    </div>
                    <div className='method_item stripe_method_option credit-card-method'>
                        <div className='check_options_method'>
                            <input type='radio' name='options'
                                value='paypal'
                                onChange={handleChangeMethod}
                                checked={method === 'paypal'}
                            />
                        </div>
                        <div className='credit-card-content'>
                            <div className='text_options_method'>
                                <span>Thanh toán qua {'('}Paypal{')'} </span>
                            </div>
                            <div className='img_options_method credit-card-img'>
                                <Image src={PaypalIcon} alt='paypal' style={{ height: '65px' }} />
                            </div>
                        </div>
                    </div>
                    <div className='paypal_section'>
                        {
                            method === 'paypal' &&
                            <Paypal name={order.name} phone={order.phone} address={order.address} />
                        }
                    </div>
                </div>
                {
                    method === 'vnpay' || method === 'stripe' || method === 'cod' ?
                        <button className='completed-check-option' onClick={handleComplete}
                        style={{ opacity: loading ? 0.7 : 1}}>
                            {
                                loading ? 
                                <FaSpinner 
                                    className="fa-spin" 
                                    style={{ color: '#ffffff', fontSize: '18px' }} 
                                /> : (method === 'stripe' || method === 'vnpay' ) ? 
                                'Tiếp tục thanh toán' : 'Hoàn tất đơn hàng'
                            }
                        </button> : null
                }
            </div>
            <div className="payment-method-options-modal-close" onClick={handleCloseView}>
                <IoCloseOutline />
            </div>
        </div>
    )
}
