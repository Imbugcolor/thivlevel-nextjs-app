'use client'
import './charts.css'
import React, { useEffect, useState } from 'react'
import { FaBoxOpen } from 'react-icons/fa'
import { IoShirt } from 'react-icons/io5'
import Iframe from 'react-iframe'
import { privateOrdersApiRequest } from '../../api-request/orders.api'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { USDollar } from '@/lib/utils/func'

export default function Charts() {
    const token = useAppSelector(state => state.auth).token
    const totalProduct = useAppSelector(state => state.producs).total || 0
    const dispatch = useAppDispatch()
    const [totalRevenue, setTotalRevenue] = useState(0)

    useEffect(() => {
        if(token) {
            const fetch = async() => {
                try {
                    const res = await privateOrdersApiRequest.getTotalRevenue(token, dispatch)
                    setTotalRevenue(res.payload)
                } catch (error) {
                    console.log(error)
                }
            }
            fetch()
        }
    },[token, dispatch])

    return (
        <div>
          <div className='content-header'>
            <h2>Thống kê</h2>
          </div>
          <div className="content-wrapper">
            <div className='chart grid-3'>
              <div className='card-total'>
                <div className='chart-item row'>
                  <div>
                    <span className='icon-bg primary-bg'>$</span>
                  </div>
                  <div className='card-content'>
                    <h3>Doanh thu</h3>
                    <span>{USDollar.format(totalRevenue)}</span>
                  </div>
                </div>
              </div>
              <div className='card-total'>
                <div className='chart-item row'>
                  <div>
                    <span className='icon-bg success-bg'><FaBoxOpen style={{ color: '#0f5132' }} /></span>
                  </div>
                  <div className='card-content'>
                    <h3>Đơn hàng</h3>
                    {/* <span>{orderTotal}</span> */}
                    <span>0</span>
                  </div>
                </div>
              </div>
              <div className='card-total'>
                <div className='chart-item row'>
                  <div>
                    <span className='icon-bg warning-bg'><IoShirt style={{ color: '#664d03' }} /></span>
                  </div>
                  <div className='card-content'>
                    <h3>Sản phẩm</h3>
                    <span>{totalProduct}</span>
                  </div>
                </div>
              </div>
            </div>
    
            <div className='chart grid-2'>
              <div className='card-chart'>
                <div className='card-chart-body'>
                  <h3 className='cart-title'>Doanh thu</h3>
                  <div>
                    <Iframe
                      url="https://charts.mongodb.com/charts-ecommerce-website-nunye/embed/charts?id=64492b72-c6f2-4fa9-8417-76ca9cf2fbcc&maxDataAge=3600&theme=light&autoRefresh=true"
                      width="100%"
                      height="380px"
                      styles={{ background: '#FFFFFF', border: 'none', borderRadius: '2px', boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)' }}
                      id=""
                      className=""
                      display="block"
                      position="relative"
                    />
                  </div>
    
                </div>
              </div>
              <div className='card-chart'>
                  <div className='card-chart-body'>
                    <h3 className='cart-title'>Sản phẩm</h3>
                    <div>
                      <Iframe
                        url="https://charts.mongodb.com/charts-ecommerce-website-nunye/embed/charts?id=644933da-dfe4-4e4c-89c2-3326d5647e50&maxDataAge=3600&theme=light&autoRefresh=true"
                        width="100%"
                        height="380px"
                        styles={{ background: '#FFFFFF', border: 'none', borderRadius: '2px', boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)' }}
                        id=""
                        className=""
                        display="block"
                        position="relative"
                      />
                    </div>
    
                  </div>
              </div>
            </div>
            <div className='chart grid-1'>
              <div className='card-chart'>
                <div className='card-chart-body'>
                  <h3 className='cart-title'>Đơn hàng</h3>
                  <div>
                    <Iframe
                      url="https://charts.mongodb.com/charts-ecommerce-website-nunye/embed/charts?id=64492f3c-b3e2-4fcf-8ea1-4464f214e4ed&maxDataAge=3600&theme=light&autoRefresh=true"
                      width="100%"
                      height="380px"
                      styles={{ background: '#FFFFFF', border: 'none', borderRadius: '2px', boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)' }}
                      id=""
                      className=""
                      display="block"
                      position="relative"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )    
}
