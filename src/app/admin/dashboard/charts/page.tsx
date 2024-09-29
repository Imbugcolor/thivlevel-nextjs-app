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
    const [totalOrders, setTotalOrders] = useState(0);
    const dispatch = useAppDispatch()
    const [totalRevenue, setTotalRevenue] = useState(0)

    useEffect(() => {
        if(token) {
            const fetch = async() => {
                try {
                    const res1 = privateOrdersApiRequest.getTotalRevenue(token, dispatch)
                    const res2 = privateOrdersApiRequest.getOrders(token, dispatch)

                    const response = await Promise.all([res1, res2])
                    const totalRevenue = response[0].payload
                    const totalOrders = response[1].payload.total
                    setTotalRevenue(totalRevenue)
                    setTotalOrders(totalOrders)
                } catch (error) {
                    console.log(error)
                }
            }
            fetch()
        }
    },[token, dispatch])

    return (
        <div className='charts-wrapper'>
          <div className='content-header'>
            <h2>Thống kê</h2>
          </div>
            <div className='chart'>
              <div className='row'>
                <div className='card-total col-lg-4 col-12'>
                  <div className='chart-item'>
                    <div>
                      <span className='icon-bg primary-bg'>$</span>
                    </div>
                    <div className='card-content'>
                      <h3>Doanh thu</h3>
                      <span>{USDollar.format(totalRevenue)}</span>
                    </div>
                  </div>
                </div>
                <div className='card-total col-lg-4 col-12'>
                  <div className='chart-item'>
                    <div>
                      <span className='icon-bg success-bg'><FaBoxOpen style={{ color: '#0f5132' }} /></span>
                    </div>
                    <div className='card-content'>
                      <h3>Đơn hàng</h3>
                      <span>{totalOrders}</span>
                    </div>
                  </div>
                </div>
                <div className='card-total col-lg-4 col-12'>
                  <div className='chart-item'>
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
            </div>
    
            <div className='chart'>
              <div className='row'>
                <div className='card-chart col-lg-6 col-12'>
                  <div className='card-chart-body'>
                    <div>
                      <Iframe
                        url="https://charts.mongodb.com/charts-nestjs-app-mvmdqoj/embed/charts?id=d546779e-f2fd-4855-a12e-0820ac9220cb&maxDataAge=1800&theme=light&autoRefresh=true"
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
                <div className='card-chart col-lg-6 col-12'>
                    <div className='card-chart-body'>
                      <div>
                        <Iframe
                          url="https://charts.mongodb.com/charts-nestjs-app-mvmdqoj/embed/charts?id=c920fbea-f5f2-412f-a874-baf4b3a06511&maxDataAge=1800&theme=light&autoRefresh=true"
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
            <div className='chart'>
              <div className='row'>
                <div className='card-chart'>
                  <div className='card-chart-body'>
                    <div>
                      <Iframe
                        url="https://charts.mongodb.com/charts-nestjs-app-mvmdqoj/embed/charts?id=2ddc2534-5c4f-40c9-b405-524e454395ae&maxDataAge=1800&theme=light&autoRefresh=true"
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
